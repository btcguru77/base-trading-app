import { tokenProps, txProps } from "@/props/types";
import axios from "axios"
import { Alchemy, Network } from 'alchemy-sdk'
import {ethers} from 'ethers'
import fs from 'fs'

const settings = {
    apiKey: "xnnXJrOQ7CgAPHBeq2qSNYZbScYetvWf",
    network: Network.BASE_MAINNET
}

const alchemy = new Alchemy(settings);

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');

export const getTokenInfo = async (tokenAddr: string, id: number) => {
    const response: any = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddr}`);
    console.log('token data => ', response.data)
    const tokenBasicInfo: any = response.data.pairs[0];

    const filterSocial = (socials: { type: string, url: string }[], target: string) => {
        const result: any = socials.filter((social: { type: string, url: string }) => {
            if (social.type.toUpperCase() === target.toUpperCase()) {
                return true
            }
        })
        if (result.length !== 0) {
            return result[0].url
        } else {
            return undefined
        }
    }

    const tokenInfo: tokenProps = {
        id: id,
        addr: tokenBasicInfo.baseToken.address,
        name: tokenBasicInfo.baseToken.name,
        price: tokenBasicInfo.priceUsd,
        volumeH6: tokenBasicInfo.volume.h6,
        priceChangeH6: tokenBasicInfo.priceChange.h6,
        fdv: tokenBasicInfo.fdv,
        website: tokenBasicInfo.info.websites.length !== 0 ? tokenBasicInfo.info.websites[0].url : undefined,
        twitter: filterSocial(tokenBasicInfo.info.socials, 'twitter'),
        telegram: filterSocial(tokenBasicInfo.info.socials, 'telegram'),
        discord: filterSocial(tokenBasicInfo.info.socials, 'discord'),
    }
    return tokenInfo
}

export const getTokenPairAddr = async (tokenAddr: string) => {
    const response: any = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddr}`);
    console.log('token data => ', response.data)
    const tokenPairAddr: any = response.data.pairs[0].pairAddress;
    return tokenPairAddr
}


export const getTxHistory = async (
    tokenAddr: string,
    walletAddr: string, // Optional wallet address filter
) => {
    const tokenPairAddr = await getTokenPairAddr(tokenAddr);

    // Fetch transfers from Alchemy
    const transfersBuy = await alchemy.core.getAssetTransfers({
        contractAddresses: [tokenAddr],
        category: ["erc20"],
        toAddress: walletAddr
    });

    const transfersSell = await alchemy.core.getAssetTransfers({
        contractAddresses: [tokenAddr],
        category: ["erc20"],
        fromAddress: walletAddr
    });

    console.log("transfers buy =>>>", transfersBuy)

    const fetchBlockTimestamp = async (blockNum: string) => {
        const block = await alchemy.core.getBlock(blockNum);
        return block.timestamp;
    };

    const fetchTokenBalanceAtBlock = async (walletAddr: string, tokenAddr: string) => {
        const balances = await alchemy.core.getTokenBalances(walletAddr, [tokenAddr]);
        const hexBalance = balances.tokenBalances[0].tokenBalance;

        // Convert hex balance to BigNumber and divide by 10^18 for 18 decimals
        const balance = ethers.BigNumber.from(hexBalance).div(ethers.BigNumber.from(10).pow(18));

        return balance.toString();
    };

    let txs: any = [];

    for (let i = 0; i < transfersBuy.transfers.length; i++) {
        const tx = transfersBuy.transfers[i];
        const timestamp = await fetchBlockTimestamp(tx.blockNum);
        const blockTokenBalance = await fetchTokenBalanceAtBlock(walletAddr, tokenAddr);
        console.log('block token balance => ', blockTokenBalance)
        const txData: txProps = {
            id: i + 1,
            blocknum: tx.blockNum,
            type: tx.from.toUpperCase() === tokenPairAddr.toUpperCase() ? 1 : 0,
            asset: tx.asset,
            amount: tx.value,
            tx: tx.hash,
            timestamp: timestamp
        };
        txs.push(txData);
    }
    for (let i = 0; i < transfersSell.transfers.length; i++) {
        const tx = transfersSell.transfers[i];
        const timestamp = await fetchBlockTimestamp(tx.blockNum);
        const txData: txProps = {
            id: i + 1,
            blocknum: tx.blockNum,
            type: tx.from.toUpperCase() === tokenPairAddr.toUpperCase() ? 1 : 0,
            asset: tx.asset,
            amount: tx.value,
            tx: tx.hash,
            timestamp: timestamp
        };
        txs.push(txData);
    }

    return txs.reverse();
};

export const getQuote = async (isBuy: boolean, token: string, inAmount: number, walletAddr?: string) => {
    let buyTokenAddr;
    let sellTokenAddr;
    console.log("my wallet address => ", walletAddr)
    const convertToSmallestUnit = (amount: number) => {
        return ethers.utils.parseUnits(amount.toString(), 18);
      };
    if (isBuy) {
        sellTokenAddr = "ETH";
        buyTokenAddr = token;
        inAmount *= 10 ** 18;
    } else {
        sellTokenAddr = token;
        buyTokenAddr = "ETH";
    }
    try {
        let price;
        if (isBuy) {
            price = await fetch(`https://base.api.0x.org/swap/v1/quote?sellToken=${sellTokenAddr}&buyToken=${buyTokenAddr}&sellAmount=${inAmount}`, {
                headers: {
                    '0x-api-key': 'adce9c25-843c-4db3-8301-6bc43221c70d'
                }
            })
        } else {
            price = await fetch(`https://base.api.0x.org/swap/v1/quote?sellToken=${sellTokenAddr}&buyToken=${buyTokenAddr}&sellAmount=${convertToSmallestUnit(inAmount).toString()}&taker=${walletAddr}`, {
                headers: {
                    '0x-api-key': 'adce9c25-843c-4db3-8301-6bc43221c70d'
                }
            })
        }

        const data = await price.json();
        console.log("quote data", data)
        return data
    } catch (error) {
        return error
    }
}


export const getTokenAmount = async (tokenAddr: string, walletAddr: string) => {
    const abi = [
        "function balanceOf(address owner) view returns (uint256)"
    ]
    try {
        const contract = new ethers.Contract(tokenAddr, abi, provider);
        let balance = await contract.balanceOf(walletAddr);

        balance = Number(balance)/10 ** 18;

        return formatNumberWithSuffix(balance);
    } catch (error) {
        console.error("Error fetching token balance:", error);
        return 0
    }
}

export function formatNumberWithSuffix(value: number, decimals: number = 2): string {
    if (value >= 10 ** 9) {
        return (value / 10 ** 9).toFixed(decimals) + 'B'; // Billions
    } else if (value >= 10 ** 6) {
        return (value / 10 ** 6).toFixed(decimals) + 'M'; // Millions
    } else if (value >= 10 ** 3) {
        return (value / 10 ** 3).toFixed(decimals) + 'K'; // Thousands
    }
    return value.toFixed(decimals); // Less than a thousand
}
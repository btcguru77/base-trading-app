"use client";

import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatNumberWithSuffix, getQuote, getTokenAmount, getTokenInfo } from "@/lib/api";
export type DetailItemProps = {
  label: string;
  value: number;
};

import { useAccount, useSendTransaction, useWaitForTransactionReceipt, type BaseError } from "wagmi";
import { tokenProps } from "@/props/types";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export default function App() {
  const [selected, setSelected] = React.useState<any>("buy");
  const [amount, setAmount] = React.useState<number>(0);
  const [tokenAddr, setTokenAddr] = useState<string>('');
  const account = useAccount();
  const [tokenAmount, setTokenAmount] = useState<string | number>(0);
  const [tokenInfo, setTokenInfo] = useState<tokenProps>();

  const [canbuy, setCanbuy] = useState(false);

  const [quote, setQuote] = useState<any>();

  const { data: hash, isPending, error, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  })

  const gettingQuote = async (e: any) => {
    console.log("getting quote")
    const tokenAmount = e.target.value;
    setAmount(tokenAmount);
    setCanbuy(true);
    let buy = selected === "buy" ? true : false;
    const quote = await getQuote(buy, tokenAddr, tokenAmount, account.address);
    setQuote(quote);
    setCanbuy(false);
  }



  const run = async () => {
    let buy = selected === "buy" ? true : false;
    const gas: any = 10 ** 6;
  
    if (!quote) return toast.error("Transaction is invalid!");
  
    if (!buy) {
      const tokenAddress = tokenAddr; 
      const proxyAddress = quote.to; 
  
      await approveToken(tokenAddress, proxyAddress, amount.toString(), account);
  
      sendTransaction({
        gas: gas,
        to: quote?.to,
        data: quote?.data,
        gasPrice: quote?.gasPrice,
      });
    } else {
      sendTransaction({
        gas: gas,
        to: quote?.to,
        data: quote?.data,
        gasPrice: quote?.gasPrice,
      });
    }
  };

  const getTokenAmounts = async () => {
    const amount = await getTokenAmount(tokenAddr, account.address!);
    console.log("token amount => ", amount)
    setTokenAmount(amount)
  }

  const getTokenInfos = async () => {
    const token = await getTokenInfo(tokenAddr, 0);
    setTokenInfo(token);
  }

  const approveToken = async (tokenAddress: string, spenderAddress: string, amount: string, signer: any) => {
    const tokenAbi = [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ];
    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      console.log('signer address => ', signer.getAddress())
  
      const allowance = await tokenContract.allowance(signer.getAddress(), spenderAddress);
  
      const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
      if (allowance.lt(amountInWei)) {
        const tx = await tokenContract.approve(spenderAddress, amountInWei);
        console.log("Approval transaction sent:", tx.hash);
        await tx.wait(); 
        console.log("Approval transaction confirmed");
      } else {
        console.log("Sufficient allowance already granted");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Approval failed!");
    }
  };

  useEffect(() => {
    const currentPage = location.pathname;
    setTokenAddr(currentPage.split('/')[2]);
    if (account.address) {
      getTokenAmounts();
      getTokenInfos();
    }
  }, [account.address])

  useEffect(() => {
    if (isPending) {
      toast.success('Pending');
    }
    if (isConfirming) {
      toast.success("Confirming");
    }
    if (isConfirmed) {
      toast.success("Success!")
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
    if (error) {
      toast.error("Transaction failed!")
      console.log("transaction failed!", error)
    }
  }, [isPending, isConfirming, isConfirmed, error])


  return (
    <div className="flex flex-col w-full h-full gap-4 pt-5">
      <ConnectButton />
      <Card className="w-[340px] max-w-full h-full border bg-slate-300">
        <CardHeader className="w-full text-center font-bold flex justify-between items-center">
          Trade {tokenInfo?.name}
          <div className="font-normal">
            Your balance: {tokenAmount}
          </div>
        </CardHeader>
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
            color="primary" variant="bordered"
          >
            <Tab key="buy" title="Buy">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount to buy"
                  type="number"
                  value={amount.toString()}
                  onChange={gettingQuote}
                />
                <div className="flex justify-between items-center">
                  You will get:
                  <div>
                    {quote && quote.price ? formatNumberWithSuffix(Number(quote.price)) : 0} {tokenInfo?.name}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button fullWidth color="primary" onClick={run} disabled={canbuy}>
                    Buy
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sell" title="Sell">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount to sell"
                  type="number"
                  value={amount.toString()}
                  onChange={gettingQuote}
                />
                <div className="flex justify-between items-center">
                  You will get:
                  <div>
                    {quote && quote.price ? formatNumberWithSuffix(Number(quote.price)) : 0} Eth
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button fullWidth color="primary" onClick={run}>
                    Sell
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

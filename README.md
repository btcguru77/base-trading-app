# Base Chain Trading App

## Purpose

THe purpose of this project is to create a basic trading app using typescript on Base (EVM L2 Blockchain)

## Funtionality

1. Show information about a specific asset (Price, 6h Volume, 6h Price Change, FDV, Others...)
2. Buy/Sell asset with/for native token
3. Show portfolio data (In USD)
4. Track and show transactions for the wallet

## Helpful APIs/Docs

- Understanding how EVM transactions work: https://www.quicknode.com/guides/ethereum-development/smart-contracts/a-dive-into-evm-architecture-and-opcodes#understanding-evm-transaction-execution
- Check out the Alchemy docs: https://docs.alchemy.com/reference/api-overview
- Get token info using Dexscreener api: https://docs.dexscreener.com/api/reference
- Use 0x for swapping https://0x.org/products/swap

## Implementation

1. Completed

    You can specify the token list that you want to track in `/app/props/data.ts/tokenAddrs`.
    Get the token data by calling `getTokenInfo` function of `/app/lib/api.ts`.

2. Not Completed

    Just completed funtionality that can make buy/sell transaction using `@0x/swap-ts-sdk` SDK. Didn't test yet.

3. Completed

    In the first page `https://localhost:3000/` we can see all infomation of token in USD.

4. Completed

    We can check the buy/sell transactions of specific token in `http://localhost:3000/token/${tokenAddr}`.

    Completed using `alchemy-sdk`. 
    
    `getTxHistory()` function of `/app/lib/api.ts`.
5. Just completed `Trading View Chart` for static data.
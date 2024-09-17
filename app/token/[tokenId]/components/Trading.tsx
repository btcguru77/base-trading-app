import React from "react";
import { useParams } from "next/navigation";
import { TradingChart } from "@/components/TVChart/TradingChart";
import { CoinInfo } from "@/props/types";

export default function Trading() {
  let { tokenId }: any = useParams();
  tokenId = decodeURIComponent(tokenId);

  const coin: CoinInfo = {
    _id: "string",
    tokenId,
    name: "Rune Name",
    creator: "Abra",
    ticker: "12345",
    url: "url",
    reserveOne: 100,
    reserveTwo: 123,
    token: "string",
    marketcap: 156743,
    replies: 27,
    description: "This is Description",
    twitter: "twitter",
    date: new Date("2022-07-01"),
  };
  return (
    <div>
      <TradingChart param={coin}></TradingChart>
    </div>
  );
}

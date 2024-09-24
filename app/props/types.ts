import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ChartTable = {
  table: {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
  }[];
};

export type Chart = {
  time: number;
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
};

export interface tokenProps {
  id: number,
  addr: string,
  name: string,
  price: number,
  volumeH6: number,
  priceChangeH6: number,
  fdv: number,
  website?: string,
  twitter?: string,
  telegram?: string,
  discord?: string 
}

export interface txProps {
  id: number,
  blocknum: string,
  type: number,
  asset: string | null,
  amount: number | null,
  tx: string,
  timestamp: number
}

export interface CoinInfo {
  _id?: string;
  name: string;
  creator: string;
  ticker: string;
  url: string;
  reserveOne: number;
  reserveTwo: number;
  token: string;
  marketcap?: number;
  replies?: number;
  description?: string;
  twitter?: string;
  tokenId?: string;
  date?: Date;
}

export interface PeriodParamsInfo {
  from: number;
  to: number;
  countBack: number;
  firstDataRequest: boolean;
}

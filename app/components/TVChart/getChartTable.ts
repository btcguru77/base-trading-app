"use client";

import { ChartTable } from "@/props/types";
import axios from "axios";

export async function getChartTable({
  tokenId,
  // pairIndex,
  // from,
  // to,
  range,
  // token,
}: {
  tokenId: string;
  // pairIndex: number;
  // from: number;
  // to: number;
  range: number;
  // token: string;
}): Promise<ChartTable> {
  try {
    const resData: any = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pump/get-bar-status`,
      { tokenId, range, countBack: 300 }
    );
    const res = {
      table: resData?.data?.chartData || [],
    };
    if (!res) {
      throw new Error();
    }
    return res as ChartTable;
  } catch (err) {
    return Promise.reject(new Error("Failed at fetching charts"));
  }
}

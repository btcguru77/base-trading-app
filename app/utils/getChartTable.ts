"use client";

import axios from "axios";
import { ChartTable } from "./types";
import chartData from "@/assets/json/tempTradingData.json";

export async function getChartTable({
  runeId,
  pairIndex,
  from,
  to,
  range,
  token,
}: {
  runeId: string;
  pairIndex: number;
  from: number;
  to: number;
  range: number;
  token: string;
}): Promise<ChartTable> {
  try {
    const res = {
      table: chartData || [],
    };
    if (!res) {
      throw new Error();
    }
    return res as ChartTable;
  } catch (err) {
    return Promise.reject(new Error("Failed at fetching charts"));
  }
}

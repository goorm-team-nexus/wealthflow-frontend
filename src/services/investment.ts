import { apiClient } from "@/lib/api-client";

// --- Stock Price ---

export interface StockPriceResponse {
  ticker?: string;
  currentPrice?: number;
  changePrice?: number;
  changeRate?: number;
  marketCap?: number;
  per?: number;
  range52w?: string;
  priceUpdatedAt?: string;
}

export interface ApiResponseStockPriceResponse {
  success?: boolean;
  data?: StockPriceResponse;
}

/**
 * 특정 종목의 실시간 시세를 조회합니다.
 * GET /api/v1/market/stocks/{ticker}
 */
export async function getStockPrice(ticker: string): Promise<ApiResponseStockPriceResponse> {
  return apiClient<ApiResponseStockPriceResponse>(`/market/stocks/${encodeURIComponent(ticker)}`);
}

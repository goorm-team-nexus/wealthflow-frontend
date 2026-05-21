import { apiClient, ApiError } from "@/lib/api-client";
import { MAIN_STOCK_SEEDS } from "@/services/marketService";

// --- Types ---

export type TradeType = "BUY" | "SELL";

export interface OrderRequest {
  quantity: number;
  ticker: string;
  tradeType: TradeType;
}

export interface OrderResult {
  currency?: "KRW" | "USD";
  executedAt?: string;
  price?: number;
  quantity?: number;
  ticker?: string;
  totalAmount?: number;
  tradeType?: TradeType;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

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

export interface TransactionResponseDto {
  createdAt?: string;
  currency?: "KRW" | "USD";
  id?: number;
  price?: number;
  quantity?: number;
  ticker?: string;
  totalAmount?: number;
  tradeType?: TradeType;
}

export interface PageTransactionResponseDto {
  content?: TransactionResponseDto[];
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface TransactionHistoryItem {
  id: string;
  stockName: string;
  stockCode: string;
  type: TradeType;
  price: number;
  quantity: number;
  totalAmount: number;
  currency: "KRW" | "USD";
  date: Date;
}

export interface GetTransactionsParams {
  tradeType?: TradeType;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
  sort?: string;
}

// --- Stock Price ---

/**
 * 특정 종목의 실시간 시세를 조회합니다.
 * GET /api/v1/market/stocks/{ticker}
 */
export async function getStockPrice(ticker: string): Promise<ApiResponse<StockPriceResponse>> {
  return apiClient<ApiResponse<StockPriceResponse>>(`/market/stocks/${encodeURIComponent(ticker)}`);
}

// --- Transaction History ---

/**
 * 모의투자 거래 내역을 조회합니다.
 * GET /api/v1/exchange/transactions
 */
export async function getTransactions({
  tradeType,
  startDate,
  endDate,
  page = 0,
  size = 20,
  sort = "createdAt,desc",
}: GetTransactionsParams = {}): Promise<TransactionHistoryItem[]> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  if (tradeType) {
    searchParams.set("tradeType", tradeType);
  }

  const formattedStartDate = formatDateParam(startDate);
  const formattedEndDate = formatDateParam(endDate);

  if (formattedStartDate) {
    searchParams.set("startDate", formattedStartDate);
  }

  if (formattedEndDate) {
    searchParams.set("endDate", formattedEndDate);
  }

  const response = await apiClient<PageTransactionResponseDto>(
    `/exchange/transactions?${searchParams.toString()}`,
  );

  return (response.content ?? []).map(toTransactionHistoryItem);
}

// --- Trade Order ---

/**
 * 주식 모의투자 주문을 처리합니다.
 * POST /api/v1/investments/order
 */
export async function placeOrder(order: OrderRequest): Promise<OrderResult> {
  try {
    const response = await apiClient<ApiResponse<OrderResult>>("/investments/order", {
      method: "POST",
      body: JSON.stringify(order),
    });

    if (!response.success || !response.data) {
      throw new Error("ORDER_FAILED");
    }

    return response.data;
  } catch (error) {
    // apiClient가 ApiError(401)를 던지면 화면단에서 AUTH_REQUIRED로 해석할 수 있도록 변환해줍니다.
    if (error instanceof ApiError && error.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    throw error;
  }
}

function toTransactionHistoryItem(transaction: TransactionResponseDto): TransactionHistoryItem {
  const stockCode = transaction.ticker ?? "";
  const stockMeta = MAIN_STOCK_SEEDS.find((stock) => stock.ticker === stockCode);

  return {
    id: String(transaction.id ?? ""),
    stockName: stockMeta?.name ?? stockCode,
    stockCode,
    type: transaction.tradeType ?? "BUY",
    price: transaction.price ?? 0,
    quantity: transaction.quantity ?? 0,
    totalAmount: transaction.totalAmount ?? 0,
    currency: transaction.currency ?? "KRW",
    date: toValidDate(transaction.createdAt),
  };
}

function toValidDate(value: string | undefined): Date {
  if (!value) {
    return new Date(0);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function formatDateParam(date: Date | undefined) {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

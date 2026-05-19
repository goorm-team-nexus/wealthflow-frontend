import { apiClient } from "@/lib/api-client";
export type StockQuoteSeed = {
  id: number;
  logo: string;
  name: string;
  ticker: string;
  volumeRank: number;
};

export type StockQuote = StockQuoteSeed & {
  change: string;
  changePrice: number;
  changeRate: number;
  marketCap: number | null;
  per: number | null;
  price: string;
  range52w: string | null;
  priceValue: number;
  tone: "blue" | "red";
};

export const MAIN_STOCK_SEEDS: StockQuoteSeed[] = [
  { id: 1, logo: "S", name: "\uc0bc\uc131\uc804\uc790", ticker: "005930", volumeRank: 1 },
  { id: 2, logo: "S", name: "SK\ud558\uc774\ub2c9\uc2a4", ticker: "000660", volumeRank: 2 },
  { id: 3, logo: "N", name: "\ub124\uc774\ubc84", ticker: "035420", volumeRank: 5 },
  { id: 4, logo: "K", name: "\uce74\uce74\uc624", ticker: "035720", volumeRank: 3 },
  { id: 5, logo: "H", name: "\ud604\ub300\ucc28", ticker: "005380", volumeRank: 4 },
  {
    id: 6,
    logo: "L",
    name: "LG\uc5d0\ub108\uc9c0\uc194\ub8e8\uc158",
    ticker: "373220",
    volumeRank: 6,
  },
  { id: 7, logo: "P", name: "POSCO\ud640\ub529\uc2a4", ticker: "005490", volumeRank: 7 },
  { id: 8, logo: "C", name: "\uc140\ud2b8\ub9ac\uc628", ticker: "068270", volumeRank: 8 },
  { id: 9, logo: "K", name: "KB\uae08\uc735", ticker: "105560", volumeRank: 9 },
  { id: 10, logo: "S", name: "\uc2e0\ud55c\uc9c0\uc8fc", ticker: "055550", volumeRank: 10 },
  { id: 11, logo: "H", name: "\ud55c\ud654\uc624\uc158", ticker: "042660", volumeRank: 11 },
  { id: 12, logo: "K", name: "\ud06c\ub798\ud504\ud1a4", ticker: "259960", volumeRank: 12 },
];

type ApiResponse<T> = {
  data?: T;
  success?: boolean;
};

type StockPriceResponse = {
  changePrice?: number | null;
  changeRate?: number | null;
  currentPrice?: number | null;
  eps?: number | null;
  marketCap?: number | null;
  per?: number | null;
  priceUpdatedAt?: string | null;
  range52w?: string | null;
  ticker?: string | null;
};

export async function fetchMainStockQuotes(seeds: StockQuoteSeed[]): Promise<StockQuote[]> {
  const results = await Promise.allSettled(seeds.map((seed) => fetchStockQuote(seed)));

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return toFallbackStockQuote(seeds[index]);
  });
}

export async function fetchStockQuoteByTicker(ticker: string): Promise<StockQuote> {
  return fetchStockQuote(getStockQuoteSeed(ticker));
}

export function getStockQuoteSeed(ticker: string): StockQuoteSeed {
  return (
    MAIN_STOCK_SEEDS.find((stock) => stock.ticker === ticker) ?? {
      id: 0,
      logo: ticker.slice(0, 1).toUpperCase(),
      name: ticker,
      ticker,
      volumeRank: 0,
    }
  );
}

async function fetchStockQuote(seed: StockQuoteSeed): Promise<StockQuote> {
  const apiResponse = await apiClient<ApiResponse<StockPriceResponse>>(
    `/market/stocks/${encodeURIComponent(seed.ticker)}`,
  );

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid stock quote response");
  }

  return toStockQuote(seed, apiResponse.data);
}

function toStockQuote(seed: StockQuoteSeed, quote: StockPriceResponse): StockQuote {
  const priceValue = quote.currentPrice ?? 0;
  const changeRate = quote.changeRate ?? 0;
  const changePrice = quote.changePrice ?? 0;
  const isRising = changeRate >= 0;
  const per = quote.per ?? calculatePer(priceValue, quote.eps);

  return {
    ...seed,
    change: `${isRising ? "\u25b2" : "\u25bc"} ${Math.abs(changeRate).toFixed(2)}%`,
    changePrice,
    changeRate,
    marketCap: quote.marketCap ?? null,
    per,
    price: formatKoreanWon(priceValue),
    range52w: quote.range52w ?? null,
    priceValue,
    tone: isRising ? "red" : "blue",
  };
}

function toFallbackStockQuote(seed: StockQuoteSeed): StockQuote {
  return {
    ...seed,
    changePrice: 0,
    changeRate: 0,
    change: "-",
    marketCap: null,
    per: null,
    price: "-",
    range52w: null,
    priceValue: 0,
    tone: "blue",
  };
}

function formatKoreanWon(value: number) {
  return `\u20a9${Math.round(value).toLocaleString("ko-KR")}`;
}

function calculatePer(priceValue: number, eps?: number | null) {
  if (!eps) {
    return null;
  }

  return priceValue / eps;
}

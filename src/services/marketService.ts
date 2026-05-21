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
  currency: "KRW" | "USD";
  marketCap: number | null;
  per: number | null;
  price: string;
  range52w: string | null;
  priceValue: number;
  tone: "blue" | "red";
};

export type MarketIndexQuote = {
  id: number;
  change: string;
  name: string;
  points: string;
  price: string;
  tone: "blue" | "red";
};

type MarketIndexSeed = {
  apiName: string;
  id: number;
  name: string;
};

const MARKET_INDEX_SEEDS: MarketIndexSeed[] = [
  { apiName: "KOSPI", id: 1, name: "\ucf54\uc2a4\ud53c" },
  { apiName: "KOSDAQ", id: 2, name: "\ucf54\uc2a4\ub2e5" },
  { apiName: "NASDAQ", id: 3, name: "\ub098\uc2a4\ub2e5" },
  { apiName: "S&P500", id: 4, name: "S&P 500" },
  { apiName: "DOW", id: 5, name: "\ub2e4\uc6b0" },
  { apiName: "NIKKEI", id: 6, name: "\ub2c8\ucf00\uc774" },
];

export const MAIN_STOCK_SEEDS: StockQuoteSeed[] = [
  { id: 1, logo: "S", name: "\uc0bc\uc131\uc804\uc790", ticker: "005930", volumeRank: 1 },
  { id: 2, logo: "S", name: "SK\ud558\uc774\ub2c9\uc2a4", ticker: "000660", volumeRank: 2 },
  { id: 3, logo: "H", name: "\ud604\ub300\ucc28", ticker: "005380", volumeRank: 3 },
  { id: 4, logo: "N", name: "NAVER", ticker: "035420", volumeRank: 4 },
  { id: 5, logo: "K", name: "\uce74\uce74\uc624", ticker: "035720", volumeRank: 5 },
  {
    id: 6,
    logo: "S",
    name: "\uc0bc\uc131\ubc14\uc774\uc624\ub85c\uc9c1\uc2a4",
    ticker: "207940",
    volumeRank: 6,
  },
  { id: 7, logo: "L", name: "LG\ud654\ud559", ticker: "051910", volumeRank: 7 },
  { id: 8, logo: "S", name: "\uc0bc\uc131SDI", ticker: "006400", volumeRank: 8 },
  { id: 9, logo: "K", name: "\uae30\uc544", ticker: "000270", volumeRank: 9 },
  { id: 10, logo: "C", name: "\uc140\ud2b8\ub9ac\uc628", ticker: "068270", volumeRank: 10 },
  { id: 11, logo: "K", name: "KB\uae08\uc735", ticker: "105560", volumeRank: 11 },
  { id: 12, logo: "S", name: "\uc2e0\ud55c\uc9c0\uc8fc", ticker: "055550", volumeRank: 12 },
  { id: 13, logo: "C", name: "CJ", ticker: "001040", volumeRank: 13 },
  { id: 14, logo: "S", name: "\uc0bc\uc131\ud654\uc7ac", ticker: "000810", volumeRank: 14 },
  { id: 15, logo: "D", name: "\ub300\ud55c\ud56d\uacf5", ticker: "003490", volumeRank: 15 },
  {
    id: 16,
    logo: "P",
    name: "\ud3ec\uc2a4\ucf54\ud4e8\ucc98\uc5e0",
    ticker: "003670",
    volumeRank: 16,
  },
  { id: 17, logo: "L", name: "LG\uc804\uc790", ticker: "066570", volumeRank: 17 },
  { id: 18, logo: "K", name: "\ud55c\uad6d\uc804\ub825", ticker: "015760", volumeRank: 18 },
  { id: 19, logo: "S", name: "\uc0bc\uc131\ubb3c\uc0b0", ticker: "028260", volumeRank: 19 },
  { id: 20, logo: "S", name: "\uc0bc\uc131SDS", ticker: "018260", volumeRank: 20 },
  { id: 21, logo: "S", name: "SK", ticker: "034730", volumeRank: 21 },
  {
    id: 22,
    logo: "H",
    name: "\ud558\ub098\uae08\uc735\uc9c0\uc8fc",
    ticker: "086790",
    volumeRank: 22,
  },
  { id: 23, logo: "S", name: "\uc0bc\uc131\uc804\uae30", ticker: "009150", volumeRank: 23 },
  { id: 24, logo: "S", name: "\uc0bc\uc131\uc911\uacf5\uc5c5", ticker: "010140", volumeRank: 24 },
  { id: 25, logo: "H", name: "\ud55c\ud654\uc194\ub8e8\uc158", ticker: "009830", volumeRank: 25 },
  { id: 26, logo: "S", name: "S-Oil", ticker: "010950", volumeRank: 26 },
  { id: 27, logo: "H", name: "HMM", ticker: "011200", volumeRank: 27 },
  { id: 28, logo: "H", name: "\ud604\ub300\ubaa8\ube44\uc2a4", ticker: "012330", volumeRank: 28 },
  { id: 29, logo: "S", name: "SK\ud154\ub808\ucf64", ticker: "017670", volumeRank: 29 },
  { id: 30, logo: "C", name: "\ucf54\uc6e8\uc774", ticker: "021240", volumeRank: 30 },
  { id: 31, logo: "P", name: "\ud3ec\uc2a4\ucf54DX", ticker: "022100", volumeRank: 31 },
  { id: 32, logo: "I", name: "\uae30\uc5c5\uc740\ud589", ticker: "024110", volumeRank: 32 },
  {
    id: 33,
    logo: "E",
    name: "\uc5d0\ucf54\ud504\ub85c\ube44\uc5e0",
    ticker: "247540",
    volumeRank: 33,
  },
  { id: 34, logo: "E", name: "\uc5d0\ucf54\ud504\ub85c", ticker: "086520", volumeRank: 34 },
  { id: 35, logo: "L", name: "\uc5d8\uc564\uc5d0\ud504", ticker: "066970", volumeRank: 35 },
  {
    id: 36,
    logo: "K",
    name: "\uce74\uce74\uc624\uac8c\uc784\uc988",
    ticker: "293490",
    volumeRank: 36,
  },
  {
    id: 37,
    logo: "S",
    name: "\uc2a4\ud29c\ub514\uc624\ub4dc\ub798\uace4",
    ticker: "253450",
    volumeRank: 37,
  },
  { id: 38, logo: "A", name: "\uc54c\ud14c\uc624\uc820", ticker: "196170", volumeRank: 38 },
  { id: 39, logo: "C", name: "\ud074\ub798\uc2dc\uc2a4", ticker: "214150", volumeRank: 39 },
  { id: 40, logo: "S", name: "\uc194\ube0c\ub808\uc778", ticker: "036830", volumeRank: 40 },
  {
    id: 41,
    logo: "I",
    name: "\uc774\uc624\ud14c\ud06c\ub2c9\uc2a4",
    ticker: "039030",
    volumeRank: 41,
  },
  { id: 42, logo: "H", name: "\ud558\uc774\ube0c", ticker: "352820", volumeRank: 42 },
  { id: 43, logo: "H", name: "\ud55c\ud654\uc2dc\uc2a4\ud15c", ticker: "272210", volumeRank: 43 },
  {
    id: 44,
    logo: "H",
    name: "\ud55c\ud654\uc5d0\uc5b4\ub85c\uc2a4\ud398\uc774\uc2a4",
    ticker: "012450",
    volumeRank: 44,
  },
  { id: 45, logo: "H", name: "\ud604\ub300\uc81c\ucca0", ticker: "004020", volumeRank: 45 },
  { id: 46, logo: "L", name: "LG\uc774\ub178\ud14d", ticker: "011070", volumeRank: 46 },
  { id: 47, logo: "K", name: "KT", ticker: "030200", volumeRank: 47 },
  { id: 48, logo: "L", name: "LG\uc720\ud50c\ub7ec\uc2a4", ticker: "032640", volumeRank: 48 },
  {
    id: 49,
    logo: "M",
    name: "\uba54\ub9ac\uce20\uae08\uc735\uc9c0\uc8fc",
    ticker: "000060",
    volumeRank: 49,
  },
  { id: 50, logo: "H", name: "\ud638\ud154\uc2e0\ub77c", ticker: "008770", volumeRank: 50 },
  { id: 51, logo: "A", name: "\uc560\ud50c", ticker: "AAPL", volumeRank: 51 },
  {
    id: 52,
    logo: "M",
    name: "\ub9c8\uc774\ud06c\ub85c\uc18c\ud504\ud2b8",
    ticker: "MSFT",
    volumeRank: 52,
  },
  { id: 53, logo: "G", name: "\uc54c\ud30c\ubcb3(\uad6c\uae00)", ticker: "GOOGL", volumeRank: 53 },
  { id: 54, logo: "A", name: "\uc544\ub9c8\uc874", ticker: "AMZN", volumeRank: 54 },
  { id: 55, logo: "N", name: "\uc5d4\ube44\ub514\uc544", ticker: "NVDA", volumeRank: 55 },
  { id: 56, logo: "T", name: "\ud14c\uc2ac\ub77c", ticker: "TSLA", volumeRank: 56 },
  { id: 57, logo: "M", name: "\uba54\ud0c0", ticker: "META", volumeRank: 57 },
  {
    id: 58,
    logo: "B",
    name: "\ubc84\ud06c\uc154\ud574\uc11c\uc6e8\uc774",
    ticker: "BRK-B",
    volumeRank: 58,
  },
  { id: 59, logo: "V", name: "\ube44\uc790", ticker: "V", volumeRank: 59 },
  { id: 60, logo: "J", name: "JP\ubaa8\uac74", ticker: "JPM", volumeRank: 60 },
  {
    id: 61,
    logo: "U",
    name: "\uc720\ub098\uc774\ud2f0\ub4dc\ud5ec\uc2a4",
    ticker: "UNH",
    volumeRank: 61,
  },
  { id: 62, logo: "J", name: "\uc874\uc2a8\uc564\uc874\uc2a8", ticker: "JNJ", volumeRank: 62 },
  { id: 63, logo: "W", name: "\uc6d4\ub9c8\ud2b8", ticker: "WMT", volumeRank: 63 },
  { id: 64, logo: "P", name: "\ud504\ub85d\ud130\uc564\uac2c\ube14", ticker: "PG", volumeRank: 64 },
  { id: 65, logo: "X", name: "\uc5d1\uc2a8\ubaa8\ube4c", ticker: "XOM", volumeRank: 65 },
  { id: 66, logo: "L", name: "\uc77c\ub77c\uc774\ub9b4\ub9ac", ticker: "LLY", volumeRank: 66 },
  { id: 67, logo: "M", name: "\ub9c8\uc2a4\ud130\uce74\ub4dc", ticker: "MA", volumeRank: 67 },
  { id: 68, logo: "A", name: "\ube0c\ub85c\ub4dc\ucef4", ticker: "AVGO", volumeRank: 68 },
  { id: 69, logo: "H", name: "\ud648\ub514\ud3ec", ticker: "HD", volumeRank: 69 },
  { id: 70, logo: "C", name: "\uc250\ube0c\ub860", ticker: "CVX", volumeRank: 70 },
  { id: 71, logo: "S", name: "S&P 500 ETF", ticker: "SPY", volumeRank: 71 },
  { id: 72, logo: "Q", name: "\ub098\uc2a4\ub2e5 100 ETF", ticker: "QQQ", volumeRank: 72 },
  {
    id: 73,
    logo: "T",
    name: "\ub098\uc2a4\ub2e5 3\ubc30 \ub808\ubc84\ub9ac\uc9c0",
    ticker: "TQQQ",
    volumeRank: 73,
  },
  {
    id: 74,
    logo: "S",
    name: "\ub098\uc2a4\ub2e5 3\ubc30 \uc778\ubc84\uc2a4",
    ticker: "SQQQ",
    volumeRank: 74,
  },
  {
    id: 75,
    logo: "S",
    name: "\ubc18\ub3c4\uccb4 3\ubc30 \ub808\ubc84\ub9ac\uc9c0",
    ticker: "SOXL",
    volumeRank: 75,
  },
  {
    id: 76,
    logo: "S",
    name: "\ubc18\ub3c4\uccb4 3\ubc30 \uc778\ubc84\uc2a4",
    ticker: "SOXS",
    volumeRank: 76,
  },
  {
    id: 77,
    logo: "M",
    name: "\ube44\ud2b8\ucf54\uc778 \ub808\ubc84\ub9ac\uc9c0 ETF",
    ticker: "MSTX",
    volumeRank: 77,
  },
  {
    id: 78,
    logo: "C",
    name: "\ubc45\uac00\ub4dc \ucc44\uad8c ETF",
    ticker: "CRCA",
    volumeRank: 78,
  },
  { id: 79, logo: "O", name: "\uc624\ud074\ub85c", ticker: "OKLO", volumeRank: 79 },
  {
    id: 80,
    logo: "M",
    name: "\ub9c8\uc774\ud06c\ub85c\uc2a4\ud2b8\ub798\ud2f0\uc9c0",
    ticker: "MSTR",
    volumeRank: 80,
  },
];

type ApiResponse<T> = {
  data?: T;
  success?: boolean;
};

export type FavoriteStockSummary = {
  falling: number;
  rising: number;
  total: number;
};

export type FavoriteStockList = {
  items: StockQuote[];
  summary: FavoriteStockSummary;
};

type StockPriceResponse = {
  changeAmount?: number | null;
  changePrice?: number | null;
  changeRate?: number | null;
  currentPrice?: number | null;
  eps?: number | null;
  marketCap?: number | null;
  per?: number | null;
  prevClosePrice?: number | null;
  priceUpdatedAt?: string | null;
  range52w?: string | null;
  ticker?: string | null;
};

type FavoriteStockItemResponse = {
  changePrice?: number | null;
  changeRate?: number | null;
  currentPrice?: number | null;
  marketType?: "KOSPI" | "KOSDAQ" | "NASDAQ" | "NYSE" | null;
  nameKo?: string | null;
  priceUpdatedAt?: string | null;
  ticker?: string | null;
};

type FavoriteStockListResponse = {
  fallingCount?: number | null;
  items?: FavoriteStockItemResponse[] | null;
  risingCount?: number | null;
  totalCount?: number | null;
};

type FavoriteStockResultResponse = {
  favorite?: boolean;
  ticker?: string;
};

type MarketIndexResponseDto = {
  changeAmount?: number | null;
  changeRate?: number | null;
  currentPrice?: number | null;
  indexName?: string | null;
};

type MarketIndexListResponse = ApiResponse<MarketIndexResponseDto[]>;

export type ExchangeRateResponse = {
  currency?: string;
  rate?: number;
  rateDate?: string;
};

export type ApiResponseExchangeRateResponse = {
  data?: ExchangeRateResponse;
  success?: boolean;
};

export type ExchangeRate = {
  currency: "KRW" | "USD";
  rate: number;
  rateDate: string | null;
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

export async function fetchMarketIndices(): Promise<MarketIndexQuote[]> {
  const apiResponse = await apiClient<MarketIndexListResponse>("/market/indices");

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid market index response");
  }

  const indexMap = new Map(
    apiResponse.data.map((marketIndex) => [normalizeIndexName(marketIndex.indexName), marketIndex]),
  );

  return MARKET_INDEX_SEEDS.map((seed) =>
    toMarketIndexQuote(seed, indexMap.get(normalizeIndexName(seed.apiName))),
  );
}

export type PricePointDto = {
  closePrice: number;
  date: string;
};

export type HistoricalPriceResponseDto = {
  prices: PricePointDto[];
  range: string;
  ticker: string;
};

const KOSDAQ_TICKERS = new Set([
  "247540", // 에코프로비엠
  "086520", // 에코프로
  "066970", // 엘앤에프
  "293490", // 카카오게임즈
  "253450", // 스튜디오드래곤
  "196170", // 알테오젠
  "214150", // 클래시스
  "036830", // 솔브레인
  "039030", // 이오테크닉스
]);

export function getBackendChartTicker(ticker: string): string {
  if (/^\d+$/.test(ticker)) {
    if (KOSDAQ_TICKERS.has(ticker)) {
      return `${ticker}.KQ`;
    }
    return `${ticker}.KS`;
  }
  return ticker;
}

const RANGE_MAPPING: Record<string, string> = {
  "1d": "5d",
  "1w": "1mo",
  "1m": "3mo",
  "3m": "1y",
  "1y": "2y",
};

export async function fetchStockCharts(
  ticker: string,
  range: string,
): Promise<HistoricalPriceResponseDto> {
  const formattedTicker = getBackendChartTicker(ticker);
  const mappedRange = RANGE_MAPPING[range] ?? range;

  const apiResponse = await apiClient<ApiResponse<HistoricalPriceResponseDto>>(
    `/market/charts?ticker=${encodeURIComponent(formattedTicker)}&range=${encodeURIComponent(mappedRange)}`,
  );

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid stock charts response");
  }

  return apiResponse.data;
}

export async function fetchStockQuoteByTicker(ticker: string): Promise<StockQuote> {
  return fetchStockQuote(getStockQuoteSeed(ticker));
}

export async function getExchangeRate(currency: "KRW" | "USD"): Promise<ExchangeRate> {
  const apiResponse = await apiClient<ApiResponseExchangeRateResponse>(
    `/market/exchange/${encodeURIComponent(currency)}`,
  );

  if (!apiResponse.success || !apiResponse.data || typeof apiResponse.data.rate !== "number") {
    throw new Error("Invalid exchange rate response");
  }

  return {
    currency: toCurrencyCode(apiResponse.data.currency) ?? currency,
    rate: apiResponse.data.rate,
    rateDate: apiResponse.data.rateDate ?? null,
  };
}

export async function fetchFavoriteStocks(): Promise<FavoriteStockList> {
  const apiResponse = await apiClient<ApiResponse<FavoriteStockListResponse>>("/favorites");

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid favorite stock response");
  }

  const items = apiResponse.data.items ?? [];

  return {
    items: items.map(toFavoriteStockQuote),
    summary: {
      falling: apiResponse.data.fallingCount ?? 0,
      rising: apiResponse.data.risingCount ?? 0,
      total: apiResponse.data.totalCount ?? items.length,
    },
  };
}

export async function addFavoriteStock(ticker: string): Promise<FavoriteStockResultResponse> {
  const apiResponse = await apiClient<ApiResponse<FavoriteStockResultResponse>>("/favorites", {
    method: "POST",
    body: JSON.stringify({ ticker }),
  });

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid add favorite response");
  }

  return apiResponse.data;
}

export async function removeFavoriteStock(ticker: string): Promise<FavoriteStockResultResponse> {
  const apiResponse = await apiClient<ApiResponse<FavoriteStockResultResponse>>(
    `/favorites/${encodeURIComponent(ticker)}`,
    { method: "DELETE" },
  );

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("Invalid remove favorite response");
  }

  return apiResponse.data;
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
  const changePrice =
    quote.changeAmount ?? quote.changePrice ?? priceValue - (quote.prevClosePrice ?? priceValue);
  const isRising = changeRate >= 0;
  const per = quote.per ?? calculatePer(priceValue, quote.eps);
  const currency = getTickerCurrency(seed.ticker);

  return {
    ...seed,
    change: `${isRising ? "\u25b2" : "\u25bc"} ${Math.abs(changeRate).toFixed(2)}%`,
    changePrice,
    changeRate,
    currency,
    marketCap: quote.marketCap ?? null,
    per,
    price: formatPrice(priceValue, currency),
    range52w: quote.range52w ?? null,
    priceValue,
    tone: isRising ? "red" : "blue",
  };
}

function toMarketIndexQuote(
  seed: MarketIndexSeed,
  marketIndex?: MarketIndexResponseDto,
): MarketIndexQuote {
  const currentPrice = marketIndex?.currentPrice ?? 0;
  const changeAmount = marketIndex?.changeAmount ?? 0;
  const changeRate = marketIndex?.changeRate ?? 0;
  const isRising = changeRate >= 0;

  return {
    ...seed,
    change: `${formatSignedNumber(changeAmount)} (${formatSignedPercent(changeRate)})`,
    points: toMarketIndexPoints({
      changeAmount,
      currentPrice,
      seed: seed.id,
    }),
    price: formatIndexPrice(currentPrice),
    tone: isRising ? "red" : "blue",
  };
}

function toFallbackStockQuote(seed: StockQuoteSeed): StockQuote {
  return {
    ...seed,
    changePrice: 0,
    changeRate: 0,
    change: "-",
    currency: getTickerCurrency(seed.ticker),
    marketCap: null,
    per: null,
    price: "-",
    range52w: null,
    priceValue: 0,
    tone: "blue",
  };
}

function normalizeIndexName(indexName?: string | null) {
  return (indexName ?? "").replace(/\s/g, "").toUpperCase();
}

function toCurrencyCode(value: string | undefined): "KRW" | "USD" | null {
  if (value === "KRW" || value === "USD") {
    return value;
  }

  return null;
}

function toMarketIndexPoints({
  changeAmount,
  currentPrice,
  seed,
}: {
  changeAmount: number;
  currentPrice: number;
  seed: number;
}) {
  const fiveMinutePointCount = 24;
  const previousPrice = currentPrice - changeAmount;
  const basePrice = previousPrice || currentPrice || 1;
  const changeScale = Math.max(Math.abs(changeAmount), Math.max(currentPrice * 0.002, 1));
  const prices = Array.from({ length: fiveMinutePointCount }, (_, index) => {
    const progress = index / (fiveMinutePointCount - 1);
    const trendPrice = basePrice + (currentPrice - basePrice) * progress;
    const shortSpike =
      Math.sin((index + seed) * 2.15) * changeScale * 0.32 +
      Math.cos((index + seed * 3) * 3.7) * changeScale * 0.18;
    const sawTooth = (index % 2 === 0 ? 1 : -1) * changeScale * 0.22;

    return index === fiveMinutePointCount - 1
      ? currentPrice
      : Math.max(trendPrice + shortSpike + sawTooth, 1);
  });
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = Math.max(maxPrice - minPrice, 1);

  return prices
    .map((price, index) => {
      const x = Math.round(1 + (index * 118) / (fiveMinutePointCount - 1));
      const y = Math.round(50 - ((price - minPrice) / range) * 40);

      return `${x},${y}`;
    })
    .join(" ");
}

function formatIndexPrice(value: number) {
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function formatSignedNumber(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toLocaleString("ko-KR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function toFavoriteStockQuote(stock: FavoriteStockItemResponse): StockQuote {
  const ticker = stock.ticker ?? "";
  const seed = getStockQuoteSeed(ticker);
  const priceValue = stock.currentPrice ?? 0;
  const changeRate = stock.changeRate ?? 0;
  const changePrice = stock.changePrice ?? 0;
  const isRising = changeRate >= 0;
  const currency =
    stock.marketType === "NASDAQ" || stock.marketType === "NYSE"
      ? "USD"
      : getTickerCurrency(ticker);

  return {
    ...seed,
    change: `${isRising ? "\u25b2" : "\u25bc"} ${Math.abs(changeRate).toFixed(2)}%`,
    changePrice,
    changeRate,
    currency,
    marketCap: null,
    name: stock.nameKo ?? seed.name,
    per: null,
    price: formatPrice(priceValue, currency),
    priceValue,
    range52w: null,
    ticker,
    tone: isRising ? "red" : "blue",
  };
}

export function getTickerCurrency(ticker: string): "KRW" | "USD" {
  return /[A-Za-z]/.test(ticker) ? "USD" : "KRW";
}

function formatPrice(value: number, currency: "KRW" | "USD") {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `\u20a9${Math.round(value).toLocaleString("ko-KR")}`;
}

function calculatePer(priceValue: number, eps?: number | null) {
  if (!eps) {
    return null;
  }

  return priceValue / eps;
}

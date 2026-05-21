"use client";

import {
  CandlestickSeries,
  createChart,
  type CandlestickData,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchStockCharts,
  fetchStockQuoteByTicker,
  getStockQuoteSeed,
  getTickerCurrency,
  type StockQuote,
  type StockQuoteSeed,
} from "@/services/marketService";

type StockMetric = {
  label: string;
  value: string;
  tone?: "positive";
};

type ChartPeriod = "1d" | "1w" | "1m" | "3m" | "1y";

const chartPeriods: { label: string; value: ChartPeriod }[] = [
  { label: "1\uc77c", value: "1d" },
  { label: "1\uc8fc", value: "1w" },
  { label: "1\ub2ec", value: "1m" },
  { label: "3\ub2ec", value: "3m" },
  { label: "1\ub144", value: "1y" },
];

export default function StockDetailPage() {
  const params = useParams<{ slug: string }>();
  const ticker = params.slug;
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>("1d");
  const [stock, setStock] = useState<StockQuote>(() => toPendingStock(getStockQuoteSeed(ticker)));

  useEffect(() => {
    let isMounted = true;

    const loadStock = async () => {
      try {
        const stockQuote = await fetchStockQuoteByTicker(ticker);

        if (isMounted) {
          setStock(stockQuote);
        }
      } catch {
        if (isMounted) {
          setStock(toPendingStock(getStockQuoteSeed(ticker)));
        }
      }
    };

    void loadStock();

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <PriceSummary stock={stock} />
      <PriceChart
        selectedPeriod={selectedPeriod}
        stock={stock}
        onPeriodChange={setSelectedPeriod}
      />
      <StockInfoCard stock={stock} />
      <div className="flex w-full gap-3">
        <Button asChild size="lg" className="flex-1 !bg-red-500 text-white hover:!bg-red-600">
          <Link href={`/stock-detail/${stock.ticker}/purchase`}>{"\uad6c\ub9e4\ud558\uae30"}</Link>
        </Button>
        <Button asChild size="lg" className="flex-1 !bg-blue-500 text-white hover:!bg-blue-600">
          <Link href={`/stock-detail/${stock.ticker}/sell`}>{"\ud310\ub9e4\ud558\uae30"}</Link>
        </Button>
      </div>
    </div>
  );
}

function PriceSummary({ stock }: { stock: StockQuote }) {
  const changeToneClass = stock.tone === "red" ? "text-red-500" : "text-blue-600";

  return (
    <section className="flex flex-col gap-1 px-2 pt-6">
      <h2 className="text-3xl font-bold tracking-normal">{stock.price}</h2>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${changeToneClass}`}>
          {formatSignedPrice(stock.changePrice, stock.currency)} (
          {formatSignedRate(stock.changeRate)})
        </span>
        <span className="text-xs text-muted-foreground">{"\uc624\ub298\uae30\uc900"}</span>
      </div>
    </section>
  );
}

function PriceChart({
  selectedPeriod,
  stock,
  onPeriodChange,
}: {
  selectedPeriod: ChartPeriod;
  stock: StockQuote;
  onPeriodChange: (period: ChartPeriod) => void;
}) {
  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex w-fit rounded-md bg-muted p-1">
          {chartPeriods.map((period) => (
            <Button
              key={period.value}
              type="button"
              variant={period.value === selectedPeriod ? "secondary" : "ghost"}
              size="sm"
              className={`min-w-11 ${
                period.value === selectedPeriod
                  ? "!bg-white text-foreground shadow-sm hover:!bg-white"
                  : ""
              }`}
              aria-pressed={period.value === selectedPeriod}
              onClick={() => onPeriodChange(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
        <TradingViewCandlestickChart
          key={`${stock.ticker}-${selectedPeriod}`}
          selectedPeriod={selectedPeriod}
          stock={stock}
        />
      </CardContent>
    </Card>
  );
}

function TradingViewCandlestickChart({
  selectedPeriod,
  stock,
}: {
  selectedPeriod: ChartPeriod;
  stock: StockQuote;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartData, setChartData] = useState<CandlestickData<UTCTimestamp>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadChartData = async () => {
      try {
        const response = await fetchStockCharts(stock.ticker, selectedPeriod);
        if (!isMounted) return;

        if (response && response.prices) {
          const sortedPrices = [...response.prices].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

          const seenTimes = new Set<number>();
          const candlestickData: CandlestickData<UTCTimestamp>[] = [];

          for (let i = 0; i < sortedPrices.length; i++) {
            const current = sortedPrices[i];

            // 날짜 파싱
            let timestamp: number;
            const parsedTime = Date.parse(current.date);
            if (isNaN(parsedTime)) {
              const dateObj = new Date(current.date);
              timestamp = Math.floor(
                Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()) / 1000,
              );
            } else {
              timestamp = Math.floor(parsedTime / 1000);
            }

            const time = timestamp as UTCTimestamp;

            if (seenTimes.has(time)) {
              continue;
            }
            seenTimes.add(time);

            const close = current.closePrice;
            const open = i > 0 ? sortedPrices[i - 1].closePrice : close;

            candlestickData.push({
              time,
              open,
              // 꼬리가 없는 몸통만 렌더링되도록 처리
              high: Math.max(open, close),
              low: Math.min(open, close),
              close,
            });
          }

          setChartData(candlestickData);
        }
      } catch (error) {
        console.error("Failed to load chart data:", error);
        if (isMounted) {
          setChartData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadChartData();

    return () => {
      isMounted = false;
    };
  }, [stock.ticker, selectedPeriod]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) {
      return;
    }

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      height: 256,
      layout: {
        attributionLogo: false,
        background: { color: "transparent" },
        textColor: "#111827",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "#e5e7eb" },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderColor: "#e5e7eb",
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 1,
        tickMarkFormatter: selectedPeriod === "1d" ? formatKoreanMarketTime : formatKoreanChartDate,
        timeVisible: selectedPeriod === "1d",
        secondsVisible: false,
      },
      localization: {
        locale: "ko-KR",
        timeFormatter: selectedPeriod === "1d" ? formatKoreanMarketTime : formatKoreanChartDate,
      },
      crosshair: {
        horzLine: {
          labelBackgroundColor: "#111827",
        },
        vertLine: {
          labelBackgroundColor: "#111827",
        },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      borderUpColor: "#ef4444",
      wickUpColor: "#ef4444",
      downColor: "#3b82f6",
      borderDownColor: "#3b82f6",
      wickDownColor: "#3b82f6",
    });

    series.setData(chartData);
    chart.timeScale().fitContent();
    chart.timeScale().setVisibleLogicalRange({
      from: -0.5,
      to: chartData.length - 0.5,
    });

    return () => {
      chart.remove();
    };
  }, [chartData, selectedPeriod]);

  return (
    <div className="relative h-64 w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
          <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      )}
      {!isLoading && chartData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {"차트 데이터를 불러올 수 없습니다."}
        </div>
      )}
      <div
        ref={chartContainerRef}
        className="h-full w-full"
        role="img"
        aria-label={`${stock.name} 캔들 차트`}
      />
    </div>
  );
}

function formatKoreanMarketTime(time: Time) {
  if (typeof time !== "number") {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(time * 1000));
}

function formatKoreanChartDate(time: Time) {
  if (typeof time !== "number") {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(time * 1000));
}

function toPendingStock(seed: StockQuoteSeed): StockQuote {
  return {
    ...seed,
    change: "-",
    changePrice: 0,
    changeRate: 0,
    currency: getTickerCurrency(seed.ticker),
    marketCap: null,
    per: null,
    price: "-",
    priceValue: 0,
    range52w: null,
    tone: "blue",
  };
}

function getStockMetrics(stock: StockQuote): StockMetric[] {
  return [
    { label: "\ud604\uc7ac\uac00", value: stock.price },
    {
      label: "\uc804\uc77c \ub300\ube44",
      value: `${formatSignedPrice(stock.changePrice, stock.currency)} (${formatSignedRate(stock.changeRate)})`,
      tone: stock.tone === "red" ? "positive" : undefined,
    },
    {
      label: "\uc2dc\uac00 \ucd1d\uc561",
      value: formatMarketCap(getDisplayMarketCap(stock), stock.currency),
    },
    { label: "PER", value: formatPer(getDisplayPer(stock)) },
    { label: "52\uc8fc \ubc94\uc704", value: getDisplayRange52w(stock) },
  ];
}

function formatSignedPrice(value: number, currency: "KRW" | "USD") {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  if (currency === "USD") {
    return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${sign}\u20a9${Math.abs(Math.round(value)).toLocaleString("ko-KR")}`;
}

function formatSignedRate(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function formatMarketCap(value: number | null, currency: "KRW" | "USD") {
  if (value === null) return "-";
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `\u20a9${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatPer(value: number | null) {
  return value === null ? "-" : `${value.toFixed(1)}\ubc30`;
}

function getDisplayMarketCap(stock: StockQuote) {
  if (stock.marketCap !== null && stock.marketCap > 0) {
    return stock.marketCap;
  }

  if (stock.priceValue <= 0) {
    return null;
  }

  const seed = getTickerSeed(stock.ticker);
  const estimatedShares = (40_000_000 + (seed % 960_000_000)) * (stock.ticker.length > 5 ? 1 : 8);

  return stock.priceValue * estimatedShares;
}

function getDisplayPer(stock: StockQuote) {
  if (stock.per !== null && stock.per > 0) {
    return stock.per;
  }

  if (stock.priceValue <= 0) {
    return null;
  }

  const seed = getTickerSeed(stock.ticker);

  return 8 + (seed % 270) / 10;
}

function getDisplayRange52w(stock: StockQuote) {
  if (stock.range52w) {
    return stock.range52w;
  }

  if (stock.priceValue <= 0) {
    return "-";
  }

  const seed = getTickerSeed(stock.ticker);
  const lowRate = 0.72 + (seed % 12) / 100;
  const highRate = 1.12 + (seed % 18) / 100;
  const lowPrice = stock.priceValue * lowRate;
  const highPrice = stock.priceValue * highRate;

  return `${formatPriceWithoutSign(lowPrice, stock.currency)} ~ ${formatPriceWithoutSign(highPrice, stock.currency)}`;
}

function getTickerSeed(ticker: string) {
  return Array.from(ticker).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function formatPriceWithoutSign(value: number, currency: "KRW" | "USD") {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `\u20a9${Math.round(value).toLocaleString("ko-KR")}`;
}

function StockInfoCard({ stock }: { stock: StockQuote }) {
  const stockMetrics = getStockMetrics(stock);

  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs font-normal text-blue-600">
            {stock.logo}
          </span>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">{stock.name}</h2>
            <span className="text-xs text-muted-foreground">
              {stock.ticker} · {"\ud575\uc2ec \uc885\ubaa9 \uc815\ubcf4"}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          {stockMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex h-12 items-center justify-between border-b border-border last:border-b-0"
            >
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <strong
                className={`text-sm font-semibold ${
                  metric.tone === "positive" ? "text-red-500" : "text-foreground"
                }`}
              >
                {metric.value}
              </strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

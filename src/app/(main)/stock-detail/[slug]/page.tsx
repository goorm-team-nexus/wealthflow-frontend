"use client";

import { CircleDollarSign, Sparkles } from "lucide-react";
import {
  CandlestickSeries,
  createChart,
  type CandlestickData,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchStockQuoteByTicker,
  getStockQuoteSeed,
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
      <AiSummary />
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
          {formatSignedWon(stock.changePrice)} ({formatSignedRate(stock.changeRate)})
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
        <TradingViewCandlestickChart selectedPeriod={selectedPeriod} stock={stock} />
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
  const chartData = useMemo(
    () => toCandlestickData(selectedPeriod, stock),
    [selectedPeriod, stock],
  );

  useEffect(() => {
    if (!chartContainerRef.current) {
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
        tickMarkFormatter: formatKoreanMarketTime,
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        locale: "ko-KR",
        timeFormatter: formatKoreanMarketTime,
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
  }, [chartData]);

  return (
    <div
      ref={chartContainerRef}
      className="h-64 w-full"
      role="img"
      aria-label={`${stock.name} \uce94\ub4e4 \ucc28\ud2b8`}
    />
  );
}

function toCandlestickData(
  selectedPeriod: ChartPeriod,
  stock: StockQuote,
): CandlestickData<UTCTimestamp>[] {
  const marketOpenTime = Math.floor(Date.UTC(2026, 4, 18, 0, 0, 0) / 1000);
  const marketCloseTime = Math.floor(Date.UTC(2026, 4, 18, 6, 30, 0) / 1000);
  const thirtyMinutes = 30 * 60;
  const candleCount = 13;
  const currentPrice = Math.max(stock.priceValue, 1);
  const previousClose = Math.max(currentPrice - stock.changePrice, 1);
  const volatility = getChartVolatility(selectedPeriod);
  let previousCandleClose = previousClose;

  return Array.from({ length: candleCount }, (_, index) => {
    const progress = (index + 1) / candleCount;
    const wave = Math.sin(progress * Math.PI * 2) * currentPrice * volatility;
    const trendPrice = previousClose + (currentPrice - previousClose) * progress;
    const close = index === candleCount - 1 ? currentPrice : Math.max(trendPrice + wave, 1);
    const open = previousCandleClose;
    const wickSpread = Math.max(currentPrice * volatility * (0.8 + progress), 1);
    const candleData = {
      time: getKoreanMarketTimestamp({
        closeTime: marketCloseTime,
        index,
        interval: thirtyMinutes,
        openTime: marketOpenTime,
        totalCount: candleCount,
      }),
      open,
      high: Math.max(open, close) + wickSpread,
      low: Math.max(Math.min(open, close) - wickSpread, 1),
      close,
    };

    previousCandleClose = close;

    return candleData;
  });
}

function getKoreanMarketTimestamp({
  closeTime,
  index,
  interval,
  openTime,
  totalCount,
}: {
  closeTime: number;
  index: number;
  interval: number;
  openTime: number;
  totalCount: number;
}) {
  if (index === totalCount - 1) {
    return closeTime as UTCTimestamp;
  }

  return (openTime + index * interval) as UTCTimestamp;
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

function getChartVolatility(selectedPeriod: ChartPeriod) {
  return (
    {
      "1d": 0.006,
      "1w": 0.014,
      "1m": 0.028,
      "3m": 0.06,
      "1y": 0.12,
    } satisfies Record<ChartPeriod, number>
  )[selectedPeriod];
}

function toPendingStock(seed: StockQuoteSeed): StockQuote {
  return {
    ...seed,
    change: "-",
    changePrice: 0,
    changeRate: 0,
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
      value: `${formatSignedWon(stock.changePrice)} (${formatSignedRate(stock.changeRate)})`,
      tone: stock.tone === "red" ? "positive" : undefined,
    },
    { label: "\uc2dc\uac00 \ucd1d\uc561", value: formatNullableNumber(stock.marketCap) },
    { label: "PER", value: stock.per === null ? "-" : `${stock.per.toFixed(1)}\ubc30` },
  ];
}

function formatSignedWon(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}\u20a9${Math.abs(Math.round(value)).toLocaleString("ko-KR")}`;
}

function formatSignedRate(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function formatNullableNumber(value: number | null) {
  return value === null ? "-" : value.toLocaleString("ko-KR");
}

function AiSummary() {
  return (
    <Card className="rounded-md border-blue-200 bg-blue-50 py-4">
      <CardContent className="flex h-24 flex-col gap-2 px-4">
        <div className="flex items-center gap-2 text-blue-600">
          <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <Sparkles className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold">AI {"\uc694\uc57d"}</h2>
        </div>
        <p className="pl-7 text-xs font-medium text-muted-foreground">
          {"AI \uc694\uc57d \ub0b4\uc6a9 \uc900\ube44\uc911"}
        </p>
      </CardContent>
    </Card>
  );
}

function StockInfoCard({ stock }: { stock: StockQuote }) {
  const stockMetrics = getStockMetrics(stock);

  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start gap-2">
          <CircleDollarSign className="mt-0.5 size-5" aria-hidden="true" />
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
        <div className="flex h-8 items-center justify-between">
          <span className="text-xs text-muted-foreground">52{"\uc8fc \ubc94\uc704"}</span>
          <div className="flex items-end gap-0.5">
            <span className="text-sm text-muted-foreground">{stock.range52w ?? "-"}</span>
            <strong className="text-sm font-semibold text-foreground">{stock.price}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

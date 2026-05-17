"use client";

import { ArrowLeft, CircleDollarSign, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ChartBar = {
  bodyHeight: number;
  bodyTop: number;
  wickBottom: number;
  wickTop: number;
  x: number;
  tone: "red" | "blue";
};

type StockMetric = {
  label: string;
  value: string;
  tone?: "positive";
};

type ChartPeriod = "1일" | "1주" | "1달" | "3달" | "1년";

const chartPeriods: ChartPeriod[] = ["1일", "1주", "1달", "3달", "1년"];

const chartBarsByPeriod: Record<ChartPeriod, ChartBar[]> = {
  "1일": [
    { x: 14, bodyTop: 104, bodyHeight: 16, wickTop: 98, wickBottom: 126, tone: "red" },
    { x: 28, bodyTop: 120, bodyHeight: 18, wickTop: 110, wickBottom: 144, tone: "blue" },
    { x: 42, bodyTop: 94, bodyHeight: 20, wickTop: 86, wickBottom: 122, tone: "red" },
    { x: 56, bodyTop: 78, bodyHeight: 14, wickTop: 72, wickBottom: 100, tone: "red" },
    { x: 70, bodyTop: 82, bodyHeight: 12, wickTop: 76, wickBottom: 100, tone: "blue" },
    { x: 84, bodyTop: 88, bodyHeight: 10, wickTop: 82, wickBottom: 104, tone: "blue" },
    { x: 98, bodyTop: 78, bodyHeight: 12, wickTop: 70, wickBottom: 98, tone: "red" },
    { x: 112, bodyTop: 66, bodyHeight: 14, wickTop: 58, wickBottom: 88, tone: "red" },
    { x: 126, bodyTop: 80, bodyHeight: 12, wickTop: 72, wickBottom: 98, tone: "blue" },
    { x: 140, bodyTop: 86, bodyHeight: 12, wickTop: 78, wickBottom: 104, tone: "blue" },
    { x: 154, bodyTop: 76, bodyHeight: 14, wickTop: 68, wickBottom: 98, tone: "red" },
    { x: 168, bodyTop: 64, bodyHeight: 16, wickTop: 56, wickBottom: 88, tone: "red" },
    { x: 182, bodyTop: 54, bodyHeight: 14, wickTop: 46, wickBottom: 76, tone: "red" },
  ],
  "1주": [
    { x: 14, bodyTop: 92, bodyHeight: 18, wickTop: 82, wickBottom: 118, tone: "blue" },
    { x: 28, bodyTop: 100, bodyHeight: 16, wickTop: 90, wickBottom: 126, tone: "red" },
    { x: 42, bodyTop: 86, bodyHeight: 18, wickTop: 76, wickBottom: 112, tone: "red" },
    { x: 56, bodyTop: 72, bodyHeight: 20, wickTop: 64, wickBottom: 102, tone: "red" },
    { x: 70, bodyTop: 82, bodyHeight: 14, wickTop: 74, wickBottom: 106, tone: "blue" },
    { x: 84, bodyTop: 74, bodyHeight: 16, wickTop: 66, wickBottom: 98, tone: "red" },
    { x: 98, bodyTop: 62, bodyHeight: 18, wickTop: 54, wickBottom: 90, tone: "red" },
    { x: 112, bodyTop: 70, bodyHeight: 14, wickTop: 60, wickBottom: 94, tone: "blue" },
    { x: 126, bodyTop: 64, bodyHeight: 16, wickTop: 56, wickBottom: 88, tone: "red" },
    { x: 140, bodyTop: 54, bodyHeight: 18, wickTop: 46, wickBottom: 80, tone: "red" },
    { x: 154, bodyTop: 60, bodyHeight: 14, wickTop: 50, wickBottom: 84, tone: "blue" },
    { x: 168, bodyTop: 52, bodyHeight: 16, wickTop: 44, wickBottom: 78, tone: "red" },
    { x: 182, bodyTop: 42, bodyHeight: 18, wickTop: 34, wickBottom: 68, tone: "red" },
  ],
  "1달": [
    { x: 14, bodyTop: 62, bodyHeight: 16, wickTop: 54, wickBottom: 88, tone: "red" },
    { x: 28, bodyTop: 76, bodyHeight: 16, wickTop: 66, wickBottom: 102, tone: "blue" },
    { x: 42, bodyTop: 84, bodyHeight: 18, wickTop: 74, wickBottom: 112, tone: "blue" },
    { x: 56, bodyTop: 70, bodyHeight: 16, wickTop: 62, wickBottom: 96, tone: "red" },
    { x: 70, bodyTop: 82, bodyHeight: 18, wickTop: 72, wickBottom: 108, tone: "blue" },
    { x: 84, bodyTop: 94, bodyHeight: 16, wickTop: 84, wickBottom: 120, tone: "blue" },
    { x: 98, bodyTop: 88, bodyHeight: 14, wickTop: 80, wickBottom: 112, tone: "red" },
    { x: 112, bodyTop: 78, bodyHeight: 16, wickTop: 70, wickBottom: 104, tone: "red" },
    { x: 126, bodyTop: 66, bodyHeight: 18, wickTop: 58, wickBottom: 92, tone: "red" },
    { x: 140, bodyTop: 72, bodyHeight: 14, wickTop: 64, wickBottom: 96, tone: "blue" },
    { x: 154, bodyTop: 60, bodyHeight: 16, wickTop: 52, wickBottom: 86, tone: "red" },
    { x: 168, bodyTop: 52, bodyHeight: 18, wickTop: 44, wickBottom: 78, tone: "red" },
    { x: 182, bodyTop: 46, bodyHeight: 14, wickTop: 38, wickBottom: 70, tone: "red" },
  ],
  "3달": [
    { x: 14, bodyTop: 112, bodyHeight: 16, wickTop: 102, wickBottom: 138, tone: "blue" },
    { x: 28, bodyTop: 102, bodyHeight: 18, wickTop: 92, wickBottom: 130, tone: "red" },
    { x: 42, bodyTop: 90, bodyHeight: 16, wickTop: 82, wickBottom: 118, tone: "red" },
    { x: 56, bodyTop: 98, bodyHeight: 16, wickTop: 88, wickBottom: 124, tone: "blue" },
    { x: 70, bodyTop: 86, bodyHeight: 18, wickTop: 76, wickBottom: 114, tone: "red" },
    { x: 84, bodyTop: 76, bodyHeight: 18, wickTop: 66, wickBottom: 104, tone: "red" },
    { x: 98, bodyTop: 68, bodyHeight: 16, wickTop: 58, wickBottom: 94, tone: "red" },
    { x: 112, bodyTop: 78, bodyHeight: 16, wickTop: 68, wickBottom: 106, tone: "blue" },
    { x: 126, bodyTop: 70, bodyHeight: 14, wickTop: 60, wickBottom: 94, tone: "red" },
    { x: 140, bodyTop: 60, bodyHeight: 16, wickTop: 52, wickBottom: 86, tone: "red" },
    { x: 154, bodyTop: 54, bodyHeight: 18, wickTop: 46, wickBottom: 80, tone: "red" },
    { x: 168, bodyTop: 64, bodyHeight: 16, wickTop: 56, wickBottom: 90, tone: "blue" },
    { x: 182, bodyTop: 50, bodyHeight: 18, wickTop: 42, wickBottom: 76, tone: "red" },
  ],
  "1년": [
    { x: 14, bodyTop: 126, bodyHeight: 16, wickTop: 116, wickBottom: 150, tone: "blue" },
    { x: 28, bodyTop: 116, bodyHeight: 16, wickTop: 106, wickBottom: 142, tone: "red" },
    { x: 42, bodyTop: 106, bodyHeight: 18, wickTop: 96, wickBottom: 134, tone: "red" },
    { x: 56, bodyTop: 96, bodyHeight: 16, wickTop: 88, wickBottom: 124, tone: "red" },
    { x: 70, bodyTop: 88, bodyHeight: 16, wickTop: 78, wickBottom: 114, tone: "red" },
    { x: 84, bodyTop: 78, bodyHeight: 18, wickTop: 68, wickBottom: 106, tone: "red" },
    { x: 98, bodyTop: 68, bodyHeight: 16, wickTop: 60, wickBottom: 96, tone: "red" },
    { x: 112, bodyTop: 76, bodyHeight: 14, wickTop: 66, wickBottom: 100, tone: "blue" },
    { x: 126, bodyTop: 64, bodyHeight: 16, wickTop: 56, wickBottom: 92, tone: "red" },
    { x: 140, bodyTop: 56, bodyHeight: 16, wickTop: 48, wickBottom: 82, tone: "red" },
    { x: 154, bodyTop: 50, bodyHeight: 14, wickTop: 42, wickBottom: 74, tone: "red" },
    { x: 168, bodyTop: 42, bodyHeight: 16, wickTop: 34, wickBottom: 68, tone: "red" },
    { x: 182, bodyTop: 34, bodyHeight: 18, wickTop: 26, wickBottom: 60, tone: "red" },
  ],
};

const stockMetrics: StockMetric[] = [
  { label: "현재가", value: "219,500원" },
  { label: "전일 대비", value: "+1,500원(+0.68%)", tone: "positive" },
  { label: "시가 총액", value: "1,445조원" },
  { label: "PER", value: "32.7배" },
];

export default function StockDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>("1일");

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <StockDetailHeader
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite((currentIsFavorite) => !currentIsFavorite)}
      />
      <PriceSummary />
      <PriceChart
        chartBars={chartBarsByPeriod[selectedPeriod]}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      <AiSummary />
      <StockInfoCard />
      <Button asChild className="w-full bg-red-500 text-white hover:bg-red-600">
        <Link href="/stock-detail/samsung-electronics/purchase">구매하기</Link>
      </Button>
    </div>
  );
}

function StockDetailHeader({
  isFavorite,
  onFavoriteToggle,
}: {
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}) {
  return (
    <div className="grid h-8 grid-cols-[32px_minmax(0,1fr)_32px] items-center">
      <Button type="button" variant="ghost" size="icon" aria-label="뒤로가기">
        <ArrowLeft className="size-5 stroke-[2.2]" aria-hidden="true" />
      </Button>
      <h1 className="truncate text-center text-sm font-semibold">삼성전자 (005930)</h1>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="관심 종목"
        aria-pressed={isFavorite}
        onClick={onFavoriteToggle}
      >
        <Heart
          className={`size-5 stroke-[2.2] ${
            isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

function PriceSummary() {
  return (
    <section className="flex flex-col gap-1 px-2 pt-6">
      <h2 className="text-3xl font-bold tracking-normal">219,500원</h2>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-red-500">+1,200원 (+0.24%)</span>
        <span className="text-xs text-muted-foreground">오늘기준</span>
      </div>
    </section>
  );
}

function PriceChart({
  chartBars,
  selectedPeriod,
  onPeriodChange,
}: {
  chartBars: ChartBar[];
  selectedPeriod: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
}) {
  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex w-fit rounded-md bg-muted p-1">
          {chartPeriods.map((period) => (
            <Button
              key={period}
              type="button"
              variant={period === selectedPeriod ? "secondary" : "ghost"}
              size="sm"
              className="min-w-11"
              aria-pressed={period === selectedPeriod}
              onClick={() => onPeriodChange(period)}
            >
              {period}
            </Button>
          ))}
        </div>
        <div className="grid h-64 grid-cols-[minmax(0,1fr)_32px] gap-3">
          <div className="relative border-b border-border">
            {[0, 1, 2, 3, 4].map((line) => (
              <span
                key={line}
                className="absolute left-3 right-0 border-t border-border/60"
                style={{ top: `${line * 25}%` }}
              />
            ))}
            <svg
              className="absolute inset-x-4 bottom-8 top-6 h-[calc(100%-56px)] w-[calc(100%-32px)]"
              viewBox="0 0 208 160"
              role="img"
              aria-label="삼성전자 캔들 차트"
              preserveAspectRatio="none"
            >
              {chartBars.map((bar) => (
                <g key={`${bar.x}-${bar.tone}`}>
                  <line
                    x1={bar.x}
                    x2={bar.x}
                    y1={bar.wickTop}
                    y2={bar.wickBottom}
                    className="stroke-foreground"
                    strokeLinecap="round"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <rect
                    x={bar.x - 3}
                    y={bar.bodyTop}
                    width="6"
                    height={bar.bodyHeight}
                    className={bar.tone === "red" ? "fill-red-500" : "fill-blue-500"}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>
            <div className="absolute inset-x-4 bottom-3 flex justify-between text-xs text-muted-foreground">
              <span>9:00</span>
              <span>11:00</span>
              <span>13:00</span>
              <span>15:00</span>
              <span>15:30</span>
            </div>
          </div>
          <div className="relative text-xs font-semibold text-foreground">
            <span className="absolute right-0 top-5">220,000</span>
            <span className="absolute right-0 top-[42%]">210,000</span>
            <span className="absolute right-0 top-[62%]">190,000</span>
            <span className="absolute right-0 top-[82%]">170,000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiSummary() {
  return (
    <Card className="rounded-md border-blue-200 bg-blue-50 py-4">
      <CardContent className="flex h-24 flex-col gap-2 px-4">
        <div className="flex items-center gap-2 text-blue-600">
          <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <Sparkles className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold">AI 요약</h2>
        </div>
        <p className="pl-7 text-xs font-medium text-muted-foreground">
          AI 요약 내용 길게 어쩌구 저쩌구
        </p>
      </CardContent>
    </Card>
  );
}

function StockInfoCard() {
  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start gap-2">
          <CircleDollarSign className="mt-0.5 size-5" aria-hidden="true" />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">삼성전자</h2>
            <span className="text-xs text-muted-foreground">005930 · 핵심 종목 정보</span>
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
          <span className="text-xs text-muted-foreground">52주 범위</span>
          <div className="flex items-end gap-0.5">
            <span className="text-sm text-muted-foreground">57,300원~</span>
            <strong className="text-sm font-semibold text-foreground">223,000원</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

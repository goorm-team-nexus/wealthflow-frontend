"use client";

import { Card, CardContent } from "@/components/ui/card";

type HoldingRatio = {
  name: string;
  ratio: number;
  color: string;
};

const HOLDINGS_DATA: HoldingRatio[] = [
  { name: "네이버", ratio: 40, color: "#1e293b" }, // slate-800
  { name: "토스", ratio: 30, color: "#3b82f6" }, // blue-500
  { name: "카카오뱅크", ratio: 17, color: "#60a5fa" }, // blue-400
  { name: "신한은행", ratio: 6, color: "#93c5fd" }, // blue-300
  { name: "CJ", ratio: 5, color: "#bfdbfe" }, // blue-200
  { name: "기타", ratio: 3, color: "#e2e8f0" }, // slate-200
];

const TOP_5_TOTAL = 98;

export default function PortfolioHoldingsRatio() {
  // SVG Donut Chart Constants
  const size = 160;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const chartData = HOLDINGS_DATA.reduce(
    (acc, item) => {
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.ratio : 0;
      return [...acc, { ...item, offset }];
    },
    [] as (HoldingRatio & { offset: number })[],
  );

  return (
    <Card className="bg-card ring-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">보유 종목 비율</h3>
          <span className="text-xs text-muted-foreground">주요 종목 5개, 기타(%)</span>
        </div>

        <div className="flex items-center justify-center gap-8">
          {/* Left: Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {chartData.map((item, index) => {
                const strokeDasharray = `${(item.ratio / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((item.offset / 100) * circumference);

                return (
                  <circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-in-out"
                  />
                );
              })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
              <span className="text-sm text-muted-foreground font-medium">Top 5</span>
              <span className="text-2xl font-bold">{TOP_5_TOTAL}%</span>
            </div>
          </div>

          {/* Right: Legend */}
          <div className="shrink-0">
            <ul className="space-y-3">
              {HOLDINGS_DATA.map((item, index) => (
                <li key={index} className="flex items-center group cursor-pointer">
                  <div className="flex items-center gap-3 w-28">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm group-hover:scale-125 transition-transform shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold w-10 text-right">{item.ratio}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

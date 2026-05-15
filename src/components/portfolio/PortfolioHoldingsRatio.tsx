import { PieChart as ChartPie } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type HoldingRatio = {
  name: string;
  ratio: number;
  color: string;
};

const HOLDINGS_DATA: HoldingRatio[] = [
  { name: "네이버", ratio: 40, color: "#3b82f6" }, // blue-500
  { name: "토스", ratio: 30, color: "#10b981" }, // emerald-500
  { name: "카카오뱅크", ratio: 17, color: "#f59e0b" }, // amber-500
  { name: "신한은행", ratio: 6, color: "#6366f1" }, // indigo-500
  { name: "CJ", ratio: 5, color: "#ec4899" }, // pink-500
  { name: "기타", ratio: 2, color: "#94a3b8" }, // slate-400
];

export default function PortfolioHoldingsRatio() {
  const radius = 40;
  const strokeWidth = 10;

  const segments = HOLDINGS_DATA.reduce(
    (acc, item) => {
      const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].length : 0;
      return [...acc, { ...item, length: item.ratio, offset }];
    },
    [] as (HoldingRatio & { length: number; offset: number })[],
  );

  return (
    <Card className="bg-card ring-1 ring-border/50 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ChartPie className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-foreground">보유 종목 비율</h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">
            주요 종목 5개, 기타(%)
          </span>
        </div>

        <div className="flex flex-row items-center justify-between gap-4">
          {/* Left: Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0 ml-2">
            <svg width="160" height="160" className="transform -rotate-90">
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${(seg.length / 100) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`}
                  strokeDashoffset={-((seg.offset / 100) * (2 * Math.PI * radius))}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              ))}
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] text-muted-foreground font-medium">비중</span>
              <span className="text-xl font-bold tracking-tight">98%</span>
            </div>
          </div>

          {/* Right: Legend */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex flex-col gap-2.5">
              {HOLDINGS_DATA.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between min-w-[140px] group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground tabular-nums">
                    {item.ratio}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

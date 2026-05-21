import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { TotalAssetsData } from "@/services/portfolio";

interface PortfolioTotalAssetsProps {
  data: TotalAssetsData;
}

export default function PortfolioTotalAssets({ data }: PortfolioTotalAssetsProps) {
  const { totalAssets, totalProfit, totalProfitRate } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const isPositive = totalProfit >= 0;

  return (
    <Card className="w-full border border-border/80 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-5 flex flex-col gap-4">
        {/* 1. 상단: 타이틀 및 기준 설명 글 (회색 글씨 적용) */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground tracking-tight">총 모의 자산</span>
          <span className="text-xs text-muted-foreground/80 font-medium select-none bg-muted/60 px-2 py-0.5 rounded-md">
            투자 원금 1억 기준
          </span>
        </div>

        {/* 2. 중앙: 대형 자산 액수 */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-muted-foreground/60 mr-1 select-none">₩</span>
          <span className="text-3xl font-extrabold text-foreground tracking-tight leading-none">
            {formatCurrency(totalAssets)}
          </span>
        </div>

        {/* 구분용 수평선 */}
        <div className="border-t border-border/40 my-1" />

        {/* 3. 하단: 총 수익 및 수익률 지표 (공간 정돈 및 기호 겹침 해결) */}
        <div className="flex items-center justify-between w-full">
          {/* 총 수익 영역 (기호 간 띄어쓰기를 주어 폰트 충돌 방지) */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-muted-foreground font-semibold">총 수익</span>
            <span
              className={`text-sm font-extrabold tracking-tight ${isPositive ? "text-red-500" : "text-blue-500"} leading-none`}
            >
              {isPositive ? "+ ₩" : "- ₩"} {formatCurrency(Math.abs(totalProfit))}
            </span>
          </div>

          {/* 수익률 영역 (수평 배치 대칭성 확보) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-muted-foreground font-semibold">수익률</span>
            <Badge
              variant="outline"
              className={`h-auto font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border-none select-none text-xs ${
                isPositive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              }`}
            >
              {isPositive ? "▲" : "▼"} {Math.abs(totalProfitRate).toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

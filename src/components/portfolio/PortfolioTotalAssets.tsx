import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { TotalAssetsData } from "@/services/portfolio";

interface PortfolioTotalAssetsProps {
  data: TotalAssetsData;
  cashKrw: number;
  cashUsd: number;
  exchangeRate: number;
}

export default function PortfolioTotalAssets({
  data,
  cashKrw,
  cashUsd,
  exchangeRate,
}: PortfolioTotalAssetsProps) {
  const { totalAssets, totalProfit, totalProfitRate } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const formatUsd = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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

        {/* 구분용 수평선 */}
        <div className="border-t border-border/40 my-1" />

        {/* 4. 원화 & 달러 현금 구성 (2열 그리드) */}
        <div className="grid grid-cols-2 gap-3.5 mt-1">
          {/* 원화 현금 카드 */}
          <div className="bg-emerald-50/30 rounded-xl p-3.5 border border-emerald-100/50 flex flex-col gap-2 transition-all duration-300 hover:bg-emerald-50/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800/80 uppercase tracking-wider">
                원화 현금
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 font-bold select-none">
                KRW
              </span>
            </div>
            <div className="text-lg font-extrabold text-foreground tracking-tight leading-none mt-1">
              ₩ {formatCurrency(cashKrw)}
            </div>
          </div>

          {/* 달러 현금 카드 */}
          <div className="bg-blue-50/30 rounded-xl p-3.5 border border-blue-100/50 flex flex-col gap-2 transition-all duration-300 hover:bg-blue-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-blue-800/80 uppercase tracking-wider">
                  달러 현금
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100/70 text-blue-700 font-bold select-none">
                  USD
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground/50 font-medium select-none">
                환율: {formatCurrency(exchangeRate)}원
              </span>
            </div>
            <div className="flex flex-col mt-1 gap-1">
              <div className="text-lg font-extrabold text-foreground tracking-tight leading-none">
                $ {formatUsd(cashUsd)}
              </div>
              <div className="text-[9px] font-medium text-muted-foreground/60 leading-none">
                (₩ {formatCurrency(Math.round(cashUsd * exchangeRate))})
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

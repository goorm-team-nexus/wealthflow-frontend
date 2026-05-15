import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// TODO: 백엔드 연동 시 API 응답 타입으로 교체
interface TotalAssetsData {
  totalAssets: number;
  totalProfit: number;
  totalProfitRate: number;
}

// 더미 데이터 - 추후 백엔드 API 연동으로 대체 예정
const DUMMY_TOTAL_ASSETS: TotalAssetsData = {
  totalAssets: 112450000,
  totalProfit: 15200000,
  totalProfitRate: 12.4,
};

export default function PortfolioTotalAssets() {
  const { totalAssets, totalProfit, totalProfitRate } = DUMMY_TOTAL_ASSETS;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const isPositive = totalProfit >= 0;

  return (
    <Link href="#" className="block group">
      <Card className="bg-card ring-1 ring-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">총 모의 자산</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold tracking-tight">
              ₩{formatCurrency(totalAssets)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground font-medium">총 수익 / 수익률</span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isPositive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {isPositive ? "+" : "-"}₩{formatCurrency(Math.abs(totalProfit))} ({totalProfitRate}%)
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

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

  // 천 단위 콤마 포맷팅
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const isPositive = totalProfit >= 0;

  return (
    <Link href="#" className="block">
      <Card className="bg-card ring-0 shadow-md py-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-3">
            {/* 상단: 타이틀 */}
            <span className="text-lg font-semibold text-foreground">총 모의 자산</span>

            {/* 중단: 총액 */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">₩ {formatCurrency(totalAssets)}</span>
            </div>

            {/* 하단: 수익 정보 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                총 수익/ 총 수익률(%)
              </span>
              <div
                className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isPositive ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                }`}
              >
                {isPositive ? "+" : "-"}₩{formatCurrency(Math.abs(totalProfit))}(
                {isPositive ? "+" : "-"}
                {Math.abs(totalProfitRate)}%)
              </div>
            </div>
          </div>

          {/* 오른쪽: 이동 아이콘 */}
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}

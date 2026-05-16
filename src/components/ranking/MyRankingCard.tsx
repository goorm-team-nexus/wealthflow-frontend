import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import crownIcon from "@/assets/images/ranking/crown.gif";
import medalIcon from "@/assets/images/ranking/military-medal.gif";

export default function MyRankingCard() {
  // 가상의 더미 데이터
  const ranking = 152;
  const totalAssets = 12450000;
  const returnRate = "+24.52%";

  return (
    <Card className="w-full border border-border bg-card shadow-sm">
      <CardContent className="p-4 flex flex-col items-center">
        {/* 헤더: 아이콘 + 나의 랭킹 */}
        <div className="flex items-center gap-2 mb-2">
          <Image src={crownIcon} alt="Crown Icon" width={24} height={24} unoptimized />
          <h2 className="text-lg font-semibold text-foreground">나의 랭킹</h2>
        </div>

        {/* 중앙 메달 아이콘 */}
        <div className="mb-3">
          <Image src={medalIcon} alt="Medal Icon" width={114} height={114} unoptimized />
        </div>

        {/* 나의 현재 순위 뱃지 */}
        <div className="bg-red-500 text-white text-xs px-4 py-1.5 rounded-full font-medium mb-2">
          나의 현재 순위
        </div>

        {/* 순위 텍스트 */}
        <div className="text-5xl font-bold mb-3 text-foreground">{ranking}위</div>

        {/* 구분선 */}
        <hr className="mb-3 w-full border-border" />

        {/* 하단 통계 (총 자산 & 수익률) */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-muted px-5 py-1 text-xs font-medium">총 자산</span>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              ₩{totalAssets.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-muted px-5 py-1 text-xs font-medium">수익률</span>
            <span className="text-2xl font-bold text-red-500 tracking-tight">{returnRate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

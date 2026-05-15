import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function MyRankingCard() {
  // 가상의 더미 데이터
  const ranking = 152;
  const totalAssets = 12450000;
  const returnRate = "+24.52%";

  return (
    <Card className="w-full max-w-full mx-auto shadow-sm border border-border bg-card rounded-3xl overflow-hidden">
      <CardContent className="p-5 flex flex-col items-center">
        {/* 헤더: 아이콘 + 나의 랭킹 */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/assets/images/ranking/crown.gif"
            alt="Crown Icon"
            width={24}
            height={24}
            unoptimized
          />
          <h2 className="text-lg font-bold text-foreground tracking-tight">나의 랭킹</h2>
        </div>

        {/* 나의 현재 순위 뱃지 */}
        <div className="bg-red-500 text-white text-[10px] px-4 py-1 rounded-full font-black uppercase tracking-widest mb-4 shadow-sm">
          My Status
        </div>

        {/* 중앙 메달 아이콘 */}
        <div className="mb-6">
          <Image
            src="/assets/images/ranking/military-medal.gif"
            alt="Medal Icon"
            width={114}
            height={114}
            unoptimized
          />
        </div>

        {/* 순위 텍스트 */}
        <div className="text-5xl font-bold mb-3 text-foreground">{ranking}위</div>

        {/* 구분선 */}
        <hr className="w-full border-gray-300 mb-3" />

        {/* 하단 통계 (총 자산 & 수익률) */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-gray-500 text-white text-xs px-5 py-1 rounded-full font-medium">
              총 자산
            </span>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              ₩{totalAssets.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="bg-gray-500 text-white text-xs px-5 py-1 rounded-full font-medium">
              수익률
            </span>
            <span className="text-2xl font-bold text-red-500 tracking-tight">{returnRate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

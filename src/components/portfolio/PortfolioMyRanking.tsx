import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

// TODO: 백엔드 연동 시 API 응답 타입으로 교체
interface MyRankingData {
  rank: number;
  message: string;
}

// 더미 데이터 - 추후 백엔드 API 연동으로 대체 예정
const DUMMY_MY_RANKING: MyRankingData = {
  rank: 152,
  message: "Congratulations!",
};

export default function PortfolioMyRanking() {
  const { rank, message } = DUMMY_MY_RANKING;

  return (
    <Link href="/ranking" className="block">
      <Card className="bg-card ring-0 shadow-md py-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
        <CardContent className="flex items-center justify-between p-4">
          {/* 왼쪽: 트로피 아이콘 + 텍스트 */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-border shadow-md">
              <Image
                src="/assets/images/ranking/cup.gif"
                alt="trophy"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                unoptimized
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-tight">
                {message}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                현재 나의 랭킹 상태
              </span>
            </div>
          </div>

          {/* 오른쪽: 랭킹 숫자 */}
          <div className="text-right">
            <span className="text-3xl font-bold tracking-tighter">{rank}위</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

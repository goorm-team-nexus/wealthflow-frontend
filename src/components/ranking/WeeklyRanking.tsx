import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import crownIcon from "@/assets/images/ranking/crown.gif";
import cupIcon from "@/assets/images/ranking/cup.gif";
import medalIcon from "@/assets/images/ranking/military-medal.gif";

export default function WeeklyRanking() {
  // 더미 데이터 프로필 (임시)
  const users = {
    rank1: { name: "투자의 정석", rate: "+184.2%", img: "https://i.pravatar.cc/150?u=1" },
    rank2: { name: "이천만 이창길", rate: "+142.1%", img: "https://i.pravatar.cc/150?u=2" },
    rank3: { name: "데브디자이너", rate: "+24.52%", img: "https://i.pravatar.cc/150?u=3" },
  };

  return (
    <Card className="w-full border border-border bg-card shadow-sm">
      <CardContent className="p-4 flex flex-col items-center">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-4">
          <Image src={crownIcon} alt="Crown Icon" width={32} height={32} unoptimized priority />
          <h2 className="text-lg font-semibold text-foreground tracking-tight">주간 TOP 3</h2>
        </div>

        {/* 랭킹 뷰 */}
        <div className="flex items-end justify-center gap-3 w-full px-1">
          {/* 2위 (좌측) */}
          <div className="flex flex-col items-center flex-1">
            <span className="bg-muted-foreground text-white text-xs px-3 py-1 rounded-full mb-2 whitespace-nowrap">
              {users.rank2.name}
            </span>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm mb-2 relative">
              <Image src={users.rank2.img} alt="User 2" fill className="object-cover" unoptimized />
            </div>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-32">
              <div className="h-14 flex items-center justify-center">
                <Image
                  src={medalIcon}
                  alt="2nd place"
                  width={48}
                  height={48}
                  unoptimized
                  priority
                />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">2</span>
                <span className="text-red-500 text-xs font-bold leading-none mt-1">
                  {users.rank2.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 1위 (중앙) */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-2 relative">
              <Image src={users.rank1.img} alt="User 1" fill className="object-cover" unoptimized />
            </div>
            <span className="bg-muted-foreground text-white text-xs px-3 py-1 rounded-full mb-2 whitespace-nowrap">
              {users.rank1.name}
            </span>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-4 shadow-md h-40">
              <div className="h-20 flex items-center justify-center">
                <Image src={cupIcon} alt="1st place" width={80} height={80} unoptimized priority />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-3xl font-bold">1</span>
                <span className="text-red-500 text-sm font-bold leading-none mt-1">
                  {users.rank1.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 3위 (우측) */}
          <div className="flex flex-col items-center flex-1">
            <span className="bg-muted-foreground text-white text-xs px-3 py-1 rounded-full mb-2 whitespace-nowrap">
              {users.rank3.name}
            </span>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm mb-2 relative">
              <Image src={users.rank3.img} alt="User 3" fill className="object-cover" unoptimized />
            </div>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-32">
              <div className="h-14 flex items-center justify-center">
                <Image
                  src={medalIcon}
                  alt="3rd place"
                  width={48}
                  height={48}
                  unoptimized
                  priority
                />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">3</span>
                <span className="text-red-500 text-xs font-bold leading-none mt-1">
                  {users.rank3.rate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import crownIcon from "@/assets/images/ranking/crown.gif";
import cupIcon from "@/assets/images/ranking/cup.gif";
import vipIcon from "@/assets/images/ranking/vip.gif";
import medalIcon from "@/assets/images/ranking/military-medal.gif";

export default function WeeklyRanking() {
  const users = {
    rank1: { name: "투자의 정석", rate: "+184.2%", img: "https://i.pravatar.cc/150?u=1" },
    rank2: { name: "이천만 이창길", rate: "+142.1%", img: "https://i.pravatar.cc/150?u=2" },
    rank3: { name: "데브디자이너", rate: "+24.52%", img: "https://i.pravatar.cc/150?u=3" },
  };

  return (
    <Card className="w-full border border-border bg-card shadow-none">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">랭킹 TOP 3</h2>
        </div>

        <div className="flex items-end justify-center gap-3 w-full px-1">
          {/* 2위 (좌측) */}
          <div className="flex flex-col items-center flex-1">
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{users.rank2.name}</Badge>
            <Avatar className="w-16 h-16 mb-2 border-2 border-white shadow-sm">
              <AvatarImage src={users.rank2.img} alt="User 2" />
              <AvatarFallback>{users.rank2.name[0]}</AvatarFallback>
            </Avatar>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-32">
              <div className="h-14 flex items-center justify-center">
                <Image src={cupIcon} alt="2nd place" width={48} height={48} unoptimized priority />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">2</span>
                <span className="text-red-500 text-xs font-medium leading-none mt-1">
                  {users.rank2.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 1위 (중앙) */}
          <div className="flex flex-col items-center flex-1 z-10">
            <Avatar className="w-20 h-20 mb-2 border-2 border-white shadow-md">
              <AvatarImage src={users.rank1.img} alt="User 1" />
              <AvatarFallback>{users.rank1.name[0]}</AvatarFallback>
            </Avatar>
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{users.rank1.name}</Badge>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-4 shadow-md h-40">
              <div className="h-20 flex items-center justify-center">
                <Image
                  src={crownIcon}
                  alt="1st place"
                  width={80}
                  height={80}
                  unoptimized
                  priority
                />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-3xl font-bold">1</span>
                <span className="text-red-500 text-sm font-semibold leading-none mt-1">
                  {users.rank1.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 3위 (우측) */}
          <div className="flex flex-col items-center flex-1">
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{users.rank3.name}</Badge>
            <Avatar className="w-16 h-16 mb-2 border-2 border-white shadow-sm">
              <AvatarImage src={users.rank3.img} alt="User 3" />
              <AvatarFallback>{users.rank3.name[0]}</AvatarFallback>
            </Avatar>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-32">
              <div className="h-14 flex items-center justify-center">
                <Image src={vipIcon} alt="3rd place" width={48} height={48} unoptimized priority />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">3</span>
                <span className="text-red-500 text-xs font-medium leading-none mt-1">
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

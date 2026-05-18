import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import crownIcon from "@/assets/images/ranking/crown.gif";
import medalIcon from "@/assets/images/ranking/military-medal.gif";

export default function MyRankingCard() {
  const ranking = 152;
  const totalAssets = 12450000;
  const returnRate = "+24.52%";

  return (
    <Card className="w-full border border-border bg-card shadow-sm">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Image src={crownIcon} alt="Crown Icon" width={24} height={24} unoptimized />
          <h2 className="text-lg font-semibold text-foreground">나의 랭킹</h2>
        </div>

        <div className="mb-3">
          <Image src={medalIcon} alt="Medal Icon" width={114} height={114} unoptimized />
        </div>

        <Badge className="mb-2 h-auto bg-red-500 px-4 py-1.5">나의 현재 순위</Badge>

        <div className="text-3xl font-bold mb-3 text-foreground">{ranking}위</div>

        <hr className="mb-3 w-full border-border" />

        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary" className="h-auto px-5 py-1">
              총 자산
            </Badge>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              ₩{totalAssets.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary" className="h-auto px-5 py-1">
              수익률
            </Badge>
            <span className="text-2xl font-bold text-red-500 tracking-tight">{returnRate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

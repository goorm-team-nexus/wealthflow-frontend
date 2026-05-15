"use client";

import { useState, useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 가상의 전체 랭킹 더미 데이터
const GENERATED_RANKING_DATA = Array.from({ length: 30 }, (_, i) => ({
  rank: i + 1,
  name: `투자자 ${i + 1}`,
  rate: `+${(Math.abs(Math.sin(i)) * 200).toFixed(1)}%`,
  stocks: (i % 20) + 1,
}));

// 초기 4명 시안 데이터
const INITIAL_VIEW_DATA = [
  { rank: 1, name: "투자의 정석", rate: "+184.2%", stocks: 9 },
  { rank: 2, name: "이천만 이창길", rate: "+142.1%", stocks: 5 },
  { rank: 3, name: "데브디자이너", rate: "+24.52%", stocks: 4 },
  { rank: 4, name: "투자의 안내", rate: "+19.2%", stocks: 2 },
];

export default function OverallRanking() {
  const [visibleCount, setVisibleCount] = useState(4);

  const finalData = useMemo(() => {
    return [...INITIAL_VIEW_DATA, ...GENERATED_RANKING_DATA.slice(4)].slice(0, visibleCount);
  }, [visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, 30));
  };

  const handleCollapse = () => {
    setVisibleCount(4);
  };

  return (
    <Card className="w-full max-w-full mx-auto shadow-sm border border-border bg-card rounded-3xl overflow-hidden transition-all duration-500">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">전체 랭킹</h2>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              UPDATE: 26.05.06 14:00
            </span>
            <span className="text-[10px] text-blue-500 font-bold">TOP {visibleCount} 표시 중</span>
          </div>
        </div>

        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted/40 border-y border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px] text-center text-[10px] font-bold text-muted-foreground uppercase px-0">
                순위
              </TableHead>
              <TableHead className="text-left text-[10px] font-bold text-muted-foreground uppercase pl-3">
                닉네임
              </TableHead>
              <TableHead className="w-[85px] text-center text-[10px] font-bold text-muted-foreground uppercase px-0">
                수익률
              </TableHead>
              <TableHead className="w-[45px] text-center text-[10px] font-bold text-muted-foreground uppercase px-0">
                종목
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finalData.map((item) => (
              <TableRow
                key={item.rank}
                className="border-b border-border/40 last:border-0 hover:bg-accent/40 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-1 cursor-default"
              >
                <TableCell className="text-center font-bold text-foreground text-xs px-0 tabular-nums">
                  {item.rank}
                </TableCell>
                <TableCell className="text-left pl-3 overflow-hidden">
                  <div className="flex items-center gap-2 max-w-full">
                    <Avatar className="w-6 h-6 border border-border/50 shadow-sm shrink-0">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${item.rank}`}
                        alt={item.name}
                      />
                      <AvatarFallback className="text-[8px] bg-muted font-bold">
                        {item.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground/90 text-xs truncate">
                      {item.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-red-500 text-xs px-0 tabular-nums">
                  {item.rate}
                </TableCell>
                <TableCell className="text-center text-muted-foreground font-medium text-xs px-0">
                  {item.stocks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex border-t border-border/60">
          {visibleCount < 30 ? (
            <button
              onClick={handleLoadMore}
              className="flex-1 py-4 text-xs text-muted-foreground font-bold hover:bg-accent/20 hover:text-foreground active:scale-[0.98] transition-all duration-200 uppercase tracking-widest bg-muted/5 cursor-pointer"
            >
              10개 더보기
            </button>
          ) : (
            <div className="flex-1 py-4 text-xs text-center text-muted-foreground font-medium bg-muted/5 uppercase tracking-widest">
              모든 랭킹을 확인했습니다
            </div>
          )}

          {visibleCount > 4 && (
            <button
              onClick={handleCollapse}
              className="w-20 py-4 text-[10px] text-red-400 font-bold hover:bg-red-50 hover:text-red-600 active:scale-[0.95] transition-all duration-200 border-l border-border/60 uppercase cursor-pointer bg-muted/5"
            >
              접기
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

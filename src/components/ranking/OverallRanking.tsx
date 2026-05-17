"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 가상의 전체 랭킹 더미 데이터 (컴포넌트 외부에 두어 렌더링 시마다 재생성되는 것을 방지하고 퓨리티 에러 해결)
const GENERATED_RANKING_DATA = Array.from({ length: 30 }, (_, i) => ({
  rank: i + 1,
  name: `투자자 ${i + 1}`,
  rate: `+${(Math.abs(Math.sin(i)) * 200).toFixed(1)}%`, // 결정론적인 더미 데이터 생성을 위해 sin 사용
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

  // 실제 렌더링할 데이터 조합 (useMemo로 메모이제이션)
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
    <Card className="w-full border border-border bg-card shadow-sm transition-all duration-500">
      <CardContent className="p-0">
        {/* 헤더 섹션 */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">전체 랭킹</h2>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Update: 26.05.06 14:00
            </span>
            <span className="text-xs font-medium text-blue-500">TOP {visibleCount} 표시 중</span>
          </div>
        </div>

        {/* 테이블 구조 */}
        <div className="w-full">
          {/* 테이블 헤더 */}
          <div className="bg-muted/40 grid grid-cols-[40px_1fr_100px_50px] py-3 px-4 border-y border-border/60">
            <span className="text-xs text-muted-foreground text-center uppercase">순위</span>
            <span className="text-xs text-muted-foreground text-left uppercase pl-4">닉네임</span>
            <span className="text-xs text-muted-foreground text-center uppercase">수익률</span>
            <span className="text-xs text-muted-foreground text-center uppercase">종목</span>
          </div>

          {/* 리스트 아이템 */}
          <div className="flex flex-col">
            {finalData.map((item) => (
              <div
                key={item.rank}
                className="grid grid-cols-[40px_1fr_100px_50px] py-3 px-4 items-center border-b border-border/40 last:border-0 hover:bg-accent/40 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-1 relative overflow-hidden cursor-default"
              >
                <span className="text-base font-bold text-center text-foreground group-hover:scale-110 group-hover:text-red-500 transition-all duration-300 tabular-nums">
                  {item.rank}
                </span>
                <span className="text-sm font-semibold text-foreground/90 truncate text-left pl-4 group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-red-500 text-center tabular-nums group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] transition-all duration-300">
                  {item.rate}
                </span>
                <span className="text-sm text-center text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                  {item.stocks}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex border-t border-border/60">
          {visibleCount < 30 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleLoadMore}
              className="flex-1 text-xs font-medium text-muted-foreground"
            >
              10개 더보기
            </Button>
          ) : (
            <div className="flex-1 py-4 text-xs text-center text-muted-foreground font-medium bg-muted/5 uppercase tracking-widest">
              모든 랭킹을 확인했습니다
            </div>
          )}

          {visibleCount > 4 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCollapse}
              className="w-20 border-l border-border/60 text-xs font-medium text-destructive"
            >
              접기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

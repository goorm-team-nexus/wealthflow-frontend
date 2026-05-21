"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getRanking, mapToOverallRankingUI, type OverallRankingUIModel } from "@/services/ranking";
import { useAuth } from "@/components/providers/AuthProvider";

// 날짜 포맷 변환 함수 (YY.MM.DD HH:mm - 컴포넌트 외부로 분리하여 성능 최적화 및 호이스팅 린트 경고 방지)
const formatUpdateDate = (dateStr: string) => {
  try {
    // 타임존 정보 없는 naive 문자열은 UTC로 강제 처리 (브라우저별 로컬 파싱 방지)
    const normalized = /Z$|[+-]\d{2}:?\d{2}$/.test(dateStr) ? dateStr : dateStr + "Z";
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return "26.05.19 18:00 KST";
    // UTC → KST (UTC+9) 명시적 변환
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const yy = String(kst.getUTCFullYear()).slice(-2);
    const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(kst.getUTCDate()).padStart(2, "0");
    const hh = String(kst.getUTCHours()).padStart(2, "0");
    const min = String(kst.getUTCMinutes()).padStart(2, "0");
    return `${yy}.${mm}.${dd} ${hh}:${min} KST`;
  } catch {
    return "26.05.19 18:00 KST";
  }
};

export default function OverallRanking() {
  const [rankings, setRankings] = useState<OverallRankingUIModel[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userProfile } = useAuth();

  const pageSize = 10;

  // 데이터 불러오기 함수
  const fetchRankings = useCallback(async (targetPage: number, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getRanking(targetPage, pageSize);

      if (response.success && response.data) {
        const { rankings: rawList, totalCount: total, updatedAt: updateTime } = response.data;
        const mappedList = mapToOverallRankingUI(rawList);

        if (append) {
          setRankings((prev) => [...prev, ...mappedList]);
        } else {
          setRankings(mappedList);
        }

        setTotalCount(total || 0);
        if (updateTime) {
          setUpdatedAt(formatUpdateDate(updateTime));
        }
      }
    } catch (err) {
      console.error("Failed to fetch overall rankings:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // 마운트 시 최초 0페이지 조회
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRankings(0, false);
  }, [fetchRankings]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRankings(nextPage, true);
  };

  const handleCollapse = () => {
    setPage(0);
    fetchRankings(0, false);
  };

  return (
    <Card className="w-full border border-border bg-card shadow-none transition-all duration-500">
      <CardContent className="p-0">
        {/* 헤더 섹션 */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">전체 랭킹</h2>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground select-none">
              Update: {updatedAt || "26.05.19 18:00"}
            </span>
            <span className="text-xs font-medium text-blue-500 select-none">
              {loading ? "불러오는 중..." : `TOP ${rankings.length} 표시 중`}
            </span>
          </div>
        </div>

        {/* 테이블 구조 */}
        <div className="w-full">
          {/* 테이블 헤더 */}
          <div className="bg-muted/40 grid grid-cols-[40px_1fr_50px_80px_96px] py-3 px-4 border-y border-border/60 text-[10px] font-semibold text-muted-foreground uppercase select-none">
            <span className="text-center">순위</span>
            <span className="text-left pl-4">닉네임</span>
            <span className="text-right pr-4">종목</span>
            <span className="text-right">수익률</span>
            <span className="text-right">총 자산</span>
          </div>

          {/* 리스트 아이템 및 스켈레톤 로더 */}
          <div className="flex flex-col min-h-[150px]">
            {loading && rankings.length === 0 ? (
              // 최초 진입 시 로딩 스켈레톤
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[40px_1fr_50px_80px_96px] py-3.5 px-4 items-center border-b border-border/40 last:border-0"
                >
                  <div className="h-6 w-6 bg-muted animate-pulse rounded-md mx-auto" />
                  <div className="flex items-center gap-3 ml-4">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded-full shrink-0" />
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
                  </div>
                  <div className="h-5 w-8 bg-muted animate-pulse rounded-md ml-auto mr-4" />
                  <div className="h-5 w-14 bg-muted animate-pulse rounded-md ml-auto" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-md ml-auto" />
                </div>
              ))
            ) : rankings.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground font-medium select-none">
                랭킹 데이터가 존재하지 않습니다.
              </div>
            ) : (
              rankings.map((item) => {
                const isPositive = !item.rate.startsWith("-");
                const cleanRate = item.rate.replace(/[+-]/g, "");
                const avatarToShow =
                  userProfile && item.name === userProfile.name
                    ? userProfile.avatarSrc || ""
                    : item.avatarUrl || "";

                return (
                  <div
                    key={item.rank}
                    className="grid grid-cols-[40px_1fr_50px_80px_96px] py-3.5 px-4 items-center border-b border-border/40 last:border-0 hover:bg-accent/40 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-1 relative overflow-hidden cursor-default"
                  >
                    <span className="text-base font-bold text-center text-foreground group-hover:scale-110 group-hover:text-red-500 transition-all duration-300 tabular-nums">
                      {item.rank}
                    </span>
                    <div className="flex items-center gap-3 pl-4 truncate group-hover:translate-x-1 transition-transform duration-300">
                      <Avatar className="size-6 border border-border/50 shrink-0">
                        {avatarToShow ? <AvatarImage src={avatarToShow} alt={item.name} /> : null}
                        <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground">
                          {item.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-right pr-4 text-muted-foreground/80 font-normal group-hover:text-foreground transition-colors duration-300 tabular-nums">
                      {item.stocks}
                    </span>
                    <span
                      className={`text-xs font-normal text-right tabular-nums transition-all duration-300 ${
                        isPositive
                          ? "text-red-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                          : "text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                      }`}
                    >
                      {isPositive ? "▲" : "▼"} {cleanRate}
                    </span>
                    <span className="text-xs text-right text-foreground font-semibold tabular-nums group-hover:text-primary transition-colors duration-300">
                      {item.totalAsset}
                    </span>
                  </div>
                );
              })
            )}

            {/* 더보기 시 추가 스켈레톤 로더 */}
            {loadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`more-${i}`}
                  className="grid grid-cols-[40px_1fr_50px_80px_96px] py-3.5 px-4 items-center border-b border-border/40 last:border-0"
                >
                  <div className="h-6 w-6 bg-muted animate-pulse rounded-md mx-auto" />
                  <div className="flex items-center gap-3 ml-4">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded-full shrink-0" />
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
                  </div>
                  <div className="h-5 w-8 bg-muted animate-pulse rounded-md ml-auto mr-4" />
                  <div className="h-5 w-14 bg-muted animate-pulse rounded-md ml-auto" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-md ml-auto" />
                </div>
              ))}
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="border-t border-border/60">
          {rankings.length < totalCount ? (
            <Button
              type="button"
              variant="ghost"
              disabled={loading || loadingMore}
              onClick={handleLoadMore}
              className="w-full text-xs font-medium text-muted-foreground h-11 hover:bg-muted/10"
            >
              {loadingMore ? "불러오는 중..." : "10개 더보기"}
            </Button>
          ) : rankings.length > 0 ? (
            <div className="py-4 px-4 text-xs text-center text-muted-foreground font-semibold bg-muted/5 uppercase tracking-widest select-none flex items-center justify-center gap-3">
              <span>모든 랭킹을 확인했습니다</span>
              {rankings.length > pageSize && (
                <button
                  type="button"
                  onClick={handleCollapse}
                  className="bg-muted text-foreground rounded px-1.5 py-0.5 text-[11px] font-medium hover:bg-muted/70 transition-colors cursor-pointer normal-case tracking-normal"
                >
                  접기
                </button>
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

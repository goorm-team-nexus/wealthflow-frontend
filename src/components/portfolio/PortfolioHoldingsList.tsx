"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import naverLogo from "@/assets/images/logos/stocks/stock-naver.svg";
import tossLogo from "@/assets/images/logos/stocks/stock-toss.svg";
import kakaobankLogo from "@/assets/images/logos/stocks/stock-kakaobank.svg";
import shinhanLogo from "@/assets/images/logos/stocks/stock-sinhanbank.svg";
import cjLogo from "@/assets/images/logos/stocks/stock-CJ.svg";
import kbLogo from "@/assets/images/logos/stocks/stock-kb.svg";
import type { StaticImageData } from "next/image";

// TODO: 백엔드 연동 시 API 응답 타입으로 교체
type HoldingItem = {
  name: string;
  slug: string;
  initial?: string;
  shares: number;
  value: number;
  profitRate: number;
  logoSrc: string | StaticImageData;
  logoClassName?: string;
};

// 더미 데이터 - 추후 백엔드 API 연동으로 대체 예정
const HOLDINGS_DATA: HoldingItem[] = [
  {
    name: "네이버",
    slug: "naver",
    shares: 40,
    value: 7396000,
    profitRate: 12.4,
    logoSrc: naverLogo,
    logoClassName: "w-full h-full object-cover",
  },
  { name: "토스", slug: "toss", shares: 30, value: 1540000, profitRate: 5.8, logoSrc: tossLogo },
  {
    name: "카카오뱅크",
    slug: "kakaobank",
    shares: 17,
    value: 372300,
    profitRate: -3.2,
    logoSrc: kakaobankLogo,
  },
  {
    name: "신한은행",
    slug: "shinhan-bank",
    shares: 6,
    value: 254400,
    profitRate: 1.5,
    logoSrc: shinhanLogo,
    logoClassName: "w-full h-full object-cover",
  },
  {
    name: "CJ",
    slug: "cj",
    shares: 5,
    value: 485000,
    profitRate: -1.8,
    logoSrc: cjLogo,
    logoClassName: "w-8 h-8 object-contain",
  },
  {
    name: "KB",
    slug: "kb",
    shares: 3,
    value: 252600,
    profitRate: 4.2,
    logoSrc: kbLogo,
    logoClassName: "w-8 h-8 object-contain",
  },
  {
    name: "삼성전자",
    slug: "samsung-electronics",
    initial: "S",
    shares: 10,
    value: 784000,
    profitRate: 8.6,
    logoSrc: "",
  },
  {
    name: "LG에너지솔루션",
    slug: "lg-energy-solution",
    initial: "L",
    shares: 8,
    value: 2972000,
    profitRate: -5.4,
    logoSrc: "",
  },
  {
    name: "현대차",
    slug: "hyundai-motor",
    initial: "H",
    shares: 4,
    value: 992000,
    profitRate: 11.2,
    logoSrc: "",
  },
  {
    name: "SK하이닉스",
    slug: "sk-hynix",
    initial: "S",
    shares: 2,
    value: 463000,
    profitRate: -2.1,
    logoSrc: "",
  },
];

const DEFAULT_VISIBLE_COUNT = 5;
const LOAD_MORE_COUNT = 5;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export default function PortfolioHoldingsList() {
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT);

  const totalCount = HOLDINGS_DATA.length;
  const isAllVisible = visibleCount >= totalCount;
  const remainingCount = totalCount - visibleCount;
  const visibleItems = HOLDINGS_DATA.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, totalCount));
  };

  const handleCollapse = () => {
    setVisibleCount(DEFAULT_VISIBLE_COUNT);
  };

  return (
    <Card className="w-full border border-border/80 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* 1. 상단 타이틀 영역 (내부 패딩 부여, 4px 가로 패딩 싱크) */}
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground tracking-tight">보유 종목 리스트</h3>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-full select-none">
              {visibleCount}개 / {totalCount}개
            </span>
          </div>
        </div>

        {/* 2. 관심종목 테이블과 100% 동일한 5열 구조의 테이블 헤더 (업계 표준 정렬 적용) */}
        <div className="bg-muted/40 grid grid-cols-[20px_1fr_60px_105px_70px] py-3 px-4 border-y border-border/60 text-[10px] font-semibold text-muted-foreground uppercase select-none">
          <span></span>
          <span className="text-left pl-3">종목명</span>
          <span className="text-right pr-6">수량</span>
          <span className="text-right pr-4">평가금액</span>
          <span className="text-right">수익률</span>
        </div>

        {/* 3. 리스트 영역 (좌우 꽉 찬 5열 관심종목형 호버 테이블 제공) */}
        <ul className="flex flex-col">
          {visibleItems.map((item) => {
            const isPositive = item.profitRate >= 0;
            const logoSrc = typeof item.logoSrc === "string" ? item.logoSrc : item.logoSrc.src;

            return (
              <li key={item.name} className="border-b border-border/40 last:border-0">
                <Link
                  href={`/stock-detail/${item.slug}`}
                  className="grid grid-cols-[20px_1fr_60px_105px_70px] items-center py-3.5 px-4 hover:bg-accent/40 transition-all duration-300 group cursor-pointer"
                >
                  {/* Col 1: 로고 (관심종목처럼 size-5로 소형화 및 슬림 아웃라인 테두리 적용) */}
                  <div className="flex items-center justify-center shrink-0">
                    <Avatar className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full border border-border group-hover:scale-105 transition-transform duration-300 bg-transparent">
                      <AvatarImage
                        src={logoSrc}
                        alt={`${item.name} 로고`}
                        className={item.logoClassName ?? "w-4 h-4 object-contain rounded-full"}
                      />
                      <AvatarFallback
                        className={`bg-transparent text-[10px] font-normal select-none ${
                          isPositive ? "text-red-500" : "text-blue-600"
                        }`}
                      >
                        {item.initial ?? item.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Col 2: 종목명 */}
                  <div className="text-left pl-3 truncate group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </span>
                  </div>

                  {/* Col 3: 수량 (우측정렬 + 우측 여백 pr-6 확보) */}
                  <span className="text-sm font-normal text-right pr-6 text-muted-foreground/80 tabular-nums">
                    {item.shares}
                  </span>

                  {/* Col 4: 평가금액 (우측정렬 + 패딩간격) */}
                  <span className="text-sm font-semibold tracking-tight text-right pr-4 text-foreground tabular-nums">
                    ₩{formatCurrency(item.value)}
                  </span>

                  {/* Col 5: 수익률 (우측정렬) */}
                  <span
                    className={`text-sm font-normal text-right tabular-nums transition-all duration-300 ${
                      isPositive
                        ? "text-red-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                        : "text-blue-600 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                    }`}
                  >
                    {isPositive ? "▲" : "▼"} {Math.abs(item.profitRate).toFixed(1)}%
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 4. 하단 버튼 영역 (랭킹 테이블 하단바처럼 full-width 경계선 밀착) */}
        {totalCount > DEFAULT_VISIBLE_COUNT && (
          <div className="flex border-t border-border/60">
            {!isAllVisible ? (
              <Button
                type="button"
                onClick={handleLoadMore}
                variant="ghost"
                className="flex-1 py-4 text-xs font-semibold text-muted-foreground hover:bg-accent/40 rounded-none h-auto"
              >
                {remainingCount}개 더보기
              </Button>
            ) : (
              <div className="flex-1 py-4 text-xs text-center text-muted-foreground font-semibold bg-muted/5 select-none">
                모든 종목을 확인했습니다
              </div>
            )}

            {visibleCount > DEFAULT_VISIBLE_COUNT && (
              <Button
                type="button"
                onClick={handleCollapse}
                variant="ghost"
                className="w-20 border-l border-border/60 text-xs font-semibold text-destructive hover:bg-destructive/5 rounded-none h-auto"
              >
                접기
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    shares: 40,
    value: 300000,
    profitRate: 2.0,
    logoSrc: naverLogo,
    logoClassName: "w-full h-full object-cover",
  },
  {
    name: "토스",
    shares: 30,
    value: 300000,
    profitRate: 2.0,
    logoSrc: tossLogo,
  },
  {
    name: "카카오뱅크",
    shares: 17,
    value: 300000,
    profitRate: 2.0,
    logoSrc: kakaobankLogo,
  },
  {
    name: "신한은행",
    shares: 6,
    value: 300000,
    profitRate: 2.0,
    logoSrc: shinhanLogo,
    logoClassName: "w-full h-full object-cover",
  },
  {
    name: "CJ",
    shares: 5,
    value: 300000,
    profitRate: 2.0,
    logoSrc: cjLogo,
    logoClassName: "w-8 h-8 object-contain",
  },
  {
    name: "KB",
    shares: 3,
    value: 300000,
    profitRate: 2.0,
    logoSrc: kbLogo,
    logoClassName: "w-8 h-8 object-contain",
  },
  {
    name: "삼성전자",
    shares: 10,
    value: 720000,
    profitRate: 3.5,
    logoSrc: "/logos/default.svg",
  },
  {
    name: "LG에너지솔루션",
    shares: 8,
    value: 480000,
    profitRate: -1.2,
    logoSrc: "/logos/default.svg",
  },
  {
    name: "현대차",
    shares: 4,
    value: 960000,
    profitRate: 5.3,
    logoSrc: "/logos/default.svg",
  },
  {
    name: "SK하이닉스",
    shares: 2,
    value: 320000,
    profitRate: -0.8,
    logoSrc: "/logos/default.svg",
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
    <Card className="bg-card ring-0 shadow-md">
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">보유 종목 리스트</h3>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">보유 종목 금액/수익률(%)</span>
            <span className="text-xs font-bold text-blue-500">
              {visibleCount}개 / {totalCount}개 표시 중
            </span>
          </div>
        </div>

        {/* 종목 리스트 */}
        <ul>
          {visibleItems.map((item, index) => {
            const isPositive = item.profitRate >= 0;
            const isLast = index === visibleItems.length - 1;

            return (
              <li key={item.name} className={!isLast ? "border-b border-border" : ""}>
                <Link
                  href="/stock-detail/samsung-electronics"
                  className="flex items-center justify-between py-3 -mx-2 px-2 rounded-lg hover:bg-accent/40 transition-all duration-300 group cursor-pointer"
                >
                  {/* 왼쪽: 로고 + 종목 정보 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={item.logoSrc}
                        alt={`${item.name} 로고`}
                        width={40}
                        height={40}
                        className={item.logoClassName ?? "w-8 h-8 object-contain"}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.shares}주</span>
                    </div>
                  </div>

                  {/* 오른쪽: 평가금액 + 수익률 */}
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm font-bold text-foreground">
                      ₩{formatCurrency(item.value)}
                    </span>
                    <span
                      className={`text-xs font-medium transition-all duration-300 ${
                        isPositive
                          ? "text-red-500 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                          : "text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {item.profitRate.toFixed(1)}%
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 더보기 / 접기 버튼 */}
        {totalCount > DEFAULT_VISIBLE_COUNT && (
          <div className="mt-2 flex border-t border-border">
            {!isAllVisible ? (
              <Button
                type="button"
                onClick={handleLoadMore}
                variant="ghost"
                className="flex-1 text-sm font-semibold text-muted-foreground"
              >
                {remainingCount}개 더보기
              </Button>
            ) : (
              <div className="flex-1 pt-3 pb-1 text-sm text-center text-muted-foreground font-medium">
                모든 종목을 확인했습니다
              </div>
            )}

            {visibleCount > DEFAULT_VISIBLE_COUNT && (
              <Button
                type="button"
                onClick={handleCollapse}
                variant="ghost"
                className="w-16 border-l border-border text-xs font-semibold text-destructive"
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

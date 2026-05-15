"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
    <Card className="bg-card ring-1 ring-border/50 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">보유 종목 리스트</h3>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-muted-foreground font-medium">
              보유 종목 금액/수익률(%)
            </span>
            <span className="text-[10px] text-blue-500 font-bold">
              {visibleCount} / {totalCount} 종목 표시 중
            </span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/40">
              <TableHead className="h-10 px-5 text-xs font-bold text-muted-foreground">
                종목 정보
              </TableHead>
              <TableHead className="h-10 px-5 text-xs font-bold text-muted-foreground text-right">
                평가금액/수익률
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item) => {
              const isPositive = item.profitRate >= 0;

              return (
                <TableRow
                  key={item.name}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <TableCell className="py-4 px-5" colSpan={2}>
                    <Link href="#" className="flex items-center justify-between w-full">
                      {/* 왼쪽: 로고/이니셜 + 종목 정보 */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-full border border-border/50 bg-white shadow-sm shrink-0">
                          <AvatarImage
                            src={typeof item.logoSrc === "string" ? item.logoSrc : item.logoSrc.src}
                            alt={item.name}
                            className={item.logoClassName ?? "p-1.5 object-contain"}
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                            {item.name.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.shares}주 보유
                          </span>
                        </div>
                      </div>

                      {/* 오른쪽: 평가금액 + 수익률 */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-foreground">
                          ₩{formatCurrency(item.value)}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isPositive ? "text-red-500" : "text-blue-500"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {item.profitRate.toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* 더보기 / 접기 버튼 */}
        {totalCount > DEFAULT_VISIBLE_COUNT && (
          <div className="flex border-t border-border/40">
            {!isAllVisible ? (
              <button
                type="button"
                onClick={handleLoadMore}
                className="flex-1 py-4 text-sm text-muted-foreground font-semibold hover:bg-muted/50 hover:text-foreground transition-all cursor-pointer"
              >
                +{remainingCount}개 종목 더보기
              </button>
            ) : (
              <div className="flex-1 py-4 text-sm text-center text-muted-foreground font-medium">
                모든 종목을 불러왔습니다
              </div>
            )}

            {visibleCount > DEFAULT_VISIBLE_COUNT && (
              <button
                type="button"
                onClick={handleCollapse}
                className="w-20 py-4 text-xs text-red-400 font-bold hover:bg-red-50 hover:text-red-600 transition-all border-l border-border/40 cursor-pointer"
              >
                접기
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

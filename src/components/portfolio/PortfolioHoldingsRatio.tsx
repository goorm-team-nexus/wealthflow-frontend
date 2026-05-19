"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { HoldingItem } from "@/services/portfolio";

const COLORS = ["#03C75A", "#0064FF", "#FACC15", "#0046FF", "#E52528"];
const OTHER_COLOR = "#94A3B8";

interface PortfolioHoldingsRatioProps {
  holdings: HoldingItem[];
}

type HoldingRatio = {
  name: string;
  ratio: number;
  color: string;
};

export default function PortfolioHoldingsRatio({ holdings }: PortfolioHoldingsRatioProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ratioData = useMemo(() => {
    if (!holdings || holdings.length === 0) return { data: [], top5Total: 0 };

    const totalValue = holdings.reduce((sum, item) => sum + item.value, 0);
    if (totalValue === 0) return { data: [], top5Total: 0 };

    const sorted = [...holdings].sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);

    let top5Total = 0;
    const data: HoldingRatio[] = top5.map((item, index) => {
      const ratio = Math.round((item.value / totalValue) * 100);
      top5Total += ratio;
      return {
        name: item.name,
        ratio,
        color: COLORS[index % COLORS.length],
      };
    });

    if (others.length > 0) {
      const othersRatio = 100 - top5Total;
      data.push({
        name: "기타",
        ratio: othersRatio,
        color: OTHER_COLOR,
      });
    } else {
      // 보정: 소수점 반올림 오차로 인해 100%가 안 될 경우 마지막 요소에 합산
      const diff = 100 - top5Total;
      if (diff !== 0 && data.length > 0) {
        data[data.length - 1].ratio += diff;
        top5Total += diff;
      }
    }

    return { data, top5Total };
  }, [holdings]);

  const { data: HOLDINGS_DATA, top5Total: TOP_5_TOTAL } = ratioData;

  const isEmpty = HOLDINGS_DATA.length === 0;

  // SVG Donut Chart Constants (호버 시 선 두께 증가로 인한 SVG 외곽선 잘림을 원천 차단하기 위해 radius 미세 축소)
  const size = 130;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = (size - strokeWidth - 8) / 2; // 8px의 안전 마진을 두어 선 확장 시 절대 잘리지 않음
  const circumference = 2 * Math.PI * radius;

  const chartData = HOLDINGS_DATA.reduce(
    (acc, item) => {
      const prev = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.ratio : 0;
      return [...acc, { ...item, offset }];
    },
    [] as (HoldingRatio & { offset: number })[],
  );

  return (
    <Card className="w-full border border-border/80 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-5 flex flex-col">
        {/* 1. 상단 타이틀 영역 (다른 카드 디자인과 100% 동일한 패딩 및 폰트 핏) */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground tracking-tight">보유 종목 비율</h3>
          <span className="text-xs text-muted-foreground/80 font-medium select-none bg-muted/60 px-2 py-0.5 rounded-md">
            주요 종목 5개, 기타(%)
          </span>
        </div>

        {/* 2. 메인 차트 및 레전드 영역 (중앙 정렬 및 글자-숫자 밀착을 위한 가로폭 한정) */}
        <div className="flex items-center justify-center gap-10 my-2 w-full">
          {/* Left: Donut Chart (마이크로 호버 인터랙션 적용) */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {isEmpty ? (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#E2E8F0"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  className="origin-center"
                />
              ) : (
                chartData.map((item, index) => {
                  const strokeDasharray = `${(item.ratio / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((item.offset / 100) * circumference);
                  const isHovered = hoveredIndex === index;
                  const isAnyHovered = hoveredIndex !== null;

                  return (
                    <circle
                      key={index}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 ease-in-out cursor-pointer origin-center"
                      style={{
                        opacity: isAnyHovered && !isHovered ? 0.35 : 1,
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })
              )}
            </svg>

            {/* Center Text (호버 시 해당 항목명 및 수치 동적 업데이트로 고급감 극대화) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0 select-none pointer-events-none">
              {isEmpty ? (
                <>
                  <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider">
                    보유
                  </span>
                  <span className="text-xl font-extrabold text-muted-foreground/50 leading-none mt-0.5 tabular-nums">
                    0%
                  </span>
                </>
              ) : hoveredIndex !== null ? (
                <>
                  <span className="text-[10px] text-muted-foreground/80 font-semibold tracking-tight truncate max-w-[70px]">
                    {HOLDINGS_DATA[hoveredIndex].name}
                  </span>
                  <span className="text-xl font-extrabold text-foreground leading-none mt-0.5 tabular-nums">
                    {HOLDINGS_DATA[hoveredIndex].ratio}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider">
                    {holdings.length <= 5 ? "보유 종목" : "Top 5"}
                  </span>
                  <span className="text-2xl font-extrabold text-foreground leading-none mt-0.5 tabular-nums">
                    {holdings.length <= 5 ? "100%" : `${TOP_5_TOTAL}%`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Legend */}
          <div className="shrink-0 w-[130px] flex items-center justify-center">
            {isEmpty ? (
              <span className="text-xs text-muted-foreground/50 font-medium text-center py-4 select-none">
                보유 종목 없음
              </span>
            ) : (
              <ul className="space-y-2.5 w-full">
                {HOLDINGS_DATA.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  const isAnyHovered = hoveredIndex !== null;

                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between group cursor-pointer py-0.5 transition-all duration-200"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        opacity: isAnyHovered && !isHovered ? 0.4 : 1,
                      }}
                    >
                      {/* 좌측: 로고 닷 + 브랜드명 (호버 시 원형 확대가 잘리지 않도록 overflow 차단 및 shrink-0 부여) */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="w-2 h-2 rounded-full shadow-sm group-hover:scale-125 transition-transform shrink-0"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: isHovered ? `0 0 8px ${item.color}` : "none",
                          }}
                        />
                        <span
                          className={`text-xs font-medium transition-colors duration-300 truncate max-w-[75px] ${
                            isHovered ? "text-foreground font-semibold" : "text-muted-foreground"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {/* 우측: 비율 (소수점 자릿수 정렬을 위한 tabular-nums) */}
                      <span
                        className={`text-xs tracking-tight transition-colors duration-300 tabular-nums shrink-0 ${
                          isHovered ? "text-foreground font-bold" : "text-foreground font-semibold"
                        }`}
                      >
                        {item.ratio}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

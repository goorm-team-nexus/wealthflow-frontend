"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PortfolioAiAnalysis() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card className="border border-border shadow-none">
      <CardContent className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">AI 포트폴리오 분석</h2>
          <p className="text-sm text-muted-foreground mt-1">
            기술주 비중이 매우 높습니다. 리스크 관리를 위해 자산 재배분을 권장합니다.
          </p>
        </div>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-4 text-sm text-muted-foreground border-t border-border mt-2 space-y-3">
              <p>
                현재 포트폴리오의 70% 이상이 IT 및 기술 섹터에 집중되어 있어, 특정 산업군의 변동성에
                매우 취약한 구조입니다.
              </p>
              <p>
                안정적인 수익률 방어를 위해 고배당주나 저변동성 가치주 위주의 분산 투자를 통해
                포트폴리오의 변동성을 낮추는 것이 필요합니다.
              </p>
              <p>
                AI 분석 결과, 금융 및 필수소비재 섹터의 비중을 현재보다 15% 이상 확대하여 섹터 간
                균형을 맞추는 전략을 추천드립니다.
              </p>
              <p>
                최근 1개월 수익률은 시장 지수 대비 우수하지만, 금리 인상 등 대외 경제 변수에 따른
                기술주 조정 리스크를 반드시 고려해야 합니다.
              </p>
              <p>
                장기적인 자산 보호를 위해 현금 비중을 10% 정도 확보하거나, 안정적인 채권형
                상장지수펀드(ETF)를 포트폴리오에 추가하는 것을 검토해 보시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <>
              접기 <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              상세 진단 보기 <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

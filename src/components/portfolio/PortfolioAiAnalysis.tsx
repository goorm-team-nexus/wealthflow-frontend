"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export default function PortfolioAiAnalysis() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-card shadow-md border-none ring-1 ring-border/50">
      <CardHeader className="pb-4 pt-5 px-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-foreground">AI 포트폴리오 분석</h3>
          <p className="text-sm text-muted-foreground leading-snug">
            기술주 비중이 매우 높습니다. 리스크 관리를 위해 자산 재배분을 권장합니다.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        {isExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-[15px] font-bold text-gray-900">포트폴리오 정밀 진단</span>
            </div>

            <div className="space-y-4 px-1">
              <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                <p className="text-[14px] leading-relaxed text-gray-700">
                  현재 포트폴리오의 <span className="font-bold text-blue-600">70% 이상</span>이 IT
                  및 기술 섹터에 집중되어 있어, 특정 산업군의 변동성에 매우 취약한 구조입니다.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  • 안정적인 수익률 방어를 위해 고배당주나 저변동성 가치주 위주의 분산 투자를 통해
                  포트폴리오의 변동성을 낮추는 것이 필요합니다.
                </p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  • AI 분석 결과, 금융 및 필수소비재 섹터의 비중을 현재보다{" "}
                  <span className="font-bold">15% 이상 확대</span>하여 섹터 간 균형을 맞추는 전략을
                  추천드립니다.
                </p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  • 최근 1개월 수익률은 우수하지만, 금리 인상 등 대외 경제 변수에 따른 기술주 조정
                  리스크를 반드시 고려해야 합니다.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-[13px] font-bold text-gray-900 bg-zinc-100/80 p-3 rounded-xl border border-zinc-200">
                  💡 제언: 현금 비중 10% 확보 또는 안정적인 채권형 ETF 추가 검토
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-[#808080] hover:bg-[#666666] text-white font-bold h-12 rounded-xl border-none shadow-sm"
        >
          {isExpanded ? "진단 결과 접기" : "상세 진단 보기"}
        </Button>
      </CardContent>
    </Card>
  );
}

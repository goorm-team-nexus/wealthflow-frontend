"use client";

import { useEffect, useState } from "react";
import PortfolioHoldingsList from "@/components/portfolio/PortfolioHoldingsList";
import PortfolioHoldingsRatio from "@/components/portfolio/PortfolioHoldingsRatio";
import PortfolioMyRanking from "@/components/portfolio/PortfolioMyRanking";
import PortfolioTotalAssets from "@/components/portfolio/PortfolioTotalAssets";
import PortfolioAiAnalysis from "@/components/portfolio/PortfolioAiAnalysis";
import { getPortfolio, mapToTotalAssetsData, mapToHoldingItems } from "@/services/portfolio";
import type { TotalAssetsData, HoldingItem } from "@/services/portfolio";

export default function PortfolioPage() {
  const [totalAssets, setTotalAssets] = useState<TotalAssetsData | null>(null);
  const [holdings, setHoldings] = useState<HoldingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getPortfolio();

        if (response.success && response.data) {
          setTotalAssets(mapToTotalAssetsData(response.data));
          setHoldings(mapToHoldingItems(response.data.items));
        } else {
          setError("포트폴리오 데이터를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center p-10">데이터를 불러오는 중...</div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-destructive">{error}</div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <PortfolioMyRanking />
      {totalAssets && <PortfolioTotalAssets data={totalAssets} />}
      <PortfolioHoldingsRatio holdings={holdings} />
      <PortfolioHoldingsList holdings={holdings} />
      <PortfolioAiAnalysis />
    </div>
  );
}

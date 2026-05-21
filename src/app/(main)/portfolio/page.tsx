"use client";

import { useEffect, useState } from "react";
import PortfolioHoldingsList from "@/components/portfolio/PortfolioHoldingsList";
import PortfolioHoldingsRatio from "@/components/portfolio/PortfolioHoldingsRatio";
import PortfolioMyRanking from "@/components/portfolio/PortfolioMyRanking";
import PortfolioTotalAssets from "@/components/portfolio/PortfolioTotalAssets";
import {
  getPortfolio,
  mapToTotalAssetsData,
  mapToHoldingItems,
  INITIAL_SEED_MONEY,
} from "@/services/portfolio";
import type { TotalAssetsData, HoldingItem } from "@/services/portfolio";

const DEFAULT_TOTAL_ASSETS: TotalAssetsData = {
  totalAssets: INITIAL_SEED_MONEY,
  totalProfit: 0,
  totalProfitRate: 0,
};

export default function PortfolioPage() {
  const [totalAssets, setTotalAssets] = useState<TotalAssetsData>(DEFAULT_TOTAL_ASSETS);
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

  const hasHoldings = holdings.length > 0;

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <PortfolioTotalAssets data={totalAssets} />
      {hasHoldings ? (
        <>
          <PortfolioHoldingsRatio holdings={holdings} />
          <PortfolioHoldingsList holdings={holdings} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-8 shadow-sm text-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            보유 중인 종목이 없습니다.
          </span>
          <span className="text-xs text-muted-foreground/60">
            시장/거래 탭에서 종목을 눌러 모의 투자를 시작해 보세요.
          </span>
        </div>
      )}
      <PortfolioMyRanking />
    </div>
  );
}

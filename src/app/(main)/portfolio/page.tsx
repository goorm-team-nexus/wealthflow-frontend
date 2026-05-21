"use client";

import { useEffect, useState } from "react";
import PortfolioHoldingsList from "@/components/portfolio/PortfolioHoldingsList";
import PortfolioHoldingsRatio from "@/components/portfolio/PortfolioHoldingsRatio";
import PortfolioMyRanking from "@/components/portfolio/PortfolioMyRanking";
import PortfolioTotalAssets from "@/components/portfolio/PortfolioTotalAssets";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    return <PortfolioPageSkeleton />;
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

function PortfolioPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <Card className="w-full overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="my-1 border-t border-border/40" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <CardContent className="flex flex-col p-5">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="my-2 flex w-full items-center justify-center gap-10">
            <Skeleton className="size-[130px] shrink-0 rounded-full" />
            <div className="flex w-[130px] flex-col gap-2.5">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center justify-between gap-3 py-0.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-2 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-7" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="grid grid-cols-[20px_1fr_60px_105px_70px] border-y border-border/60 bg-muted/40 px-4 py-3">
            <span />
            <Skeleton className="ml-3 h-3 w-10" />
            <Skeleton className="ml-auto mr-6 h-3 w-8" />
            <Skeleton className="ml-auto mr-4 h-3 w-12" />
            <Skeleton className="ml-auto h-3 w-10" />
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[20px_1fr_60px_105px_70px] items-center border-b border-border/40 px-4 py-3.5 last:border-0"
              >
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="ml-3 h-4 w-24" />
                <Skeleton className="ml-auto mr-6 h-4 w-7" />
                <Skeleton className="ml-auto mr-4 h-4 w-20" />
                <Skeleton className="ml-auto h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="size-7 rounded-full" />
          </div>
          <div className="flex w-full items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="ml-auto h-8 w-20" />
          </div>
          <div className="my-1 border-t border-border/40" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

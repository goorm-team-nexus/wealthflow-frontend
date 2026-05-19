"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchMainStockQuotes,
  MAIN_STOCK_SEEDS,
  type StockQuote,
  type StockQuoteSeed,
} from "@/services/marketService";

type FavoriteStock = StockQuote;

const copy = {
  title: "관심 종목",
  sectionTitle: "내 관심 종목",
  total: "전체 종목",
  rising: "상승 종목",
  falling: "하락 종목",
  unit: "종목",
  favorite: "관심 종목",
  emptyTitle: "관심 종목이 없습니다",
  emptyDescription: "시장/거래에서 관심 있는 종목을 추가해보세요.",
  loadingStocks: "시세 불러오는 중",
  stockLoadFailed: "시세 연동 실패",
};

const favoriteSeeds = MAIN_STOCK_SEEDS.slice(0, 6);

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    () => new Set(favoriteSeeds.map((stock) => stock.id)),
  );
  const [favoriteStocks, setFavoriteStocks] = useState<FavoriteStock[]>(() =>
    favoriteSeeds.map(toPendingStock),
  );
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [hasStockError, setHasStockError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFavoriteStocks = async () => {
      setIsStockLoading(true);
      setHasStockError(false);

      try {
        const stockQuotes = await fetchMainStockQuotes(favoriteSeeds);

        if (isMounted) {
          setFavoriteStocks(stockQuotes);
        }
      } catch {
        if (isMounted) {
          setHasStockError(true);
        }
      } finally {
        if (isMounted) {
          setIsStockLoading(false);
        }
      }
    };

    void loadFavoriteStocks();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleFavoriteStocks = useMemo(() => {
    return favoriteStocks.filter((stock) => favoriteIds.has(stock.id));
  }, [favoriteStocks, favoriteIds]);

  const favoriteSummary = visibleFavoriteStocks.reduce(
    (summary, stock) => {
      return {
        total: summary.total + 1,
        rising: summary.rising + (stock.tone === "red" ? 1 : 0),
        falling: summary.falling + (stock.tone === "blue" ? 1 : 0),
      };
    },
    { falling: 0, rising: 0, total: 0 },
  );

  const handleFavoriteToggle = (stockId: number) => {
    setFavoriteIds((currentFavoriteIds) => {
      const nextFavoriteIds = new Set(currentFavoriteIds);

      nextFavoriteIds.delete(stockId);

      return nextFavoriteIds;
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{copy.sectionTitle}</h2>
          {isStockLoading || hasStockError ? (
            <span className="text-xs font-medium text-muted-foreground">
              {isStockLoading ? copy.loadingStocks : copy.stockLoadFailed}
            </span>
          ) : null}
        </div>

        <FavoriteSummary summary={favoriteSummary} />

        {visibleFavoriteStocks.length > 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              {visibleFavoriteStocks.map((stock) => (
                <FavoriteStockRow
                  key={stock.id}
                  isFavorite={favoriteIds.has(stock.id)}
                  stock={stock}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </CardContent>
          </Card>
        ) : (
          <FavoriteEmptyState />
        )}
      </section>
    </div>
  );
}

function toPendingStock(stock: StockQuoteSeed): FavoriteStock {
  return {
    ...stock,
    change: "-",
    changePrice: 0,
    changeRate: 0,
    marketCap: null,
    per: null,
    price: "-",
    priceValue: 0,
    range52w: null,
    tone: "blue",
  };
}

function FavoriteEmptyState() {
  return (
    <Card className="border-dashed py-6 shadow-sm">
      <CardContent className="flex flex-col items-center gap-3 px-4 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Heart className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <strong className="text-sm font-semibold">{copy.emptyTitle}</strong>
          <p className="text-xs leading-5 text-muted-foreground">{copy.emptyDescription}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FavoriteSummary({
  summary,
}: {
  summary: {
    total: number;
    rising: number;
    falling: number;
  };
}) {
  return (
    <Card className="py-4 shadow-sm">
      <CardContent className="grid grid-cols-3 divide-x divide-border px-0">
        <SummaryMetric label={copy.total} value={`${summary.total}개`} unit={copy.unit} />
        <SummaryMetric label={copy.rising} value={`${summary.rising}개`} tone="red" />
        <SummaryMetric label={copy.falling} value={`${summary.falling}개`} tone="blue" />
      </CardContent>
    </Card>
  );
}

function SummaryMetric({
  label,
  value,
  tone,
  unit,
}: {
  label: string;
  value: string;
  tone?: "blue" | "red";
  unit?: string;
}) {
  const valueToneClass =
    tone === "blue" ? "text-blue-600" : tone === "red" ? "text-red-500" : "text-foreground";

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex h-8 items-end justify-center gap-1">
        <strong className={`text-2xl font-bold leading-none tracking-normal ${valueToneClass}`}>
          {value}
        </strong>
        {unit ? <span className="pb-0.5 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
    </div>
  );
}

function FavoriteStockRow({
  isFavorite,
  stock,
  onFavoriteToggle,
}: {
  isFavorite: boolean;
  stock: FavoriteStock;
  onFavoriteToggle: (stockId: number) => void;
}) {
  const toneClass = stock.tone === "blue" ? "text-blue-600" : "text-red-500";

  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_84px_60px_20px] items-center gap-3 border-b border-border/40 px-4 py-3 transition-colors duration-200 last:border-0 hover:bg-accent/40">
      <Link
        href={`/stock-detail/${stock.ticker}`}
        className="contents"
        aria-label={`${stock.name} 종목 상세로 이동`}
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs font-normal ${toneClass}`}
        >
          {stock.logo}
        </span>

        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">{stock.name}</span>
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {stock.ticker}
          </span>
        </span>

        <strong className="text-right text-sm font-semibold tracking-tight text-foreground">
          {stock.price}
        </strong>

        <span className={`text-sm font-normal ${toneClass}`}>{stock.change}</span>
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copy.favorite}
        aria-pressed={isFavorite}
        onClick={() => onFavoriteToggle(stock.id)}
      >
        <Heart
          className={`size-5 stroke-[2] ${
            isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

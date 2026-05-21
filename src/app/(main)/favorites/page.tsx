"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  fetchFavoriteStocks,
  removeFavoriteStock,
  type FavoriteStockSummary,
  type StockQuote,
} from "@/services/marketService";

type FavoriteStock = StockQuote;

const copy = {
  sectionTitle: "내 관심 종목",
  total: "전체 종목",
  rising: "상승 종목",
  falling: "하락 종목",
  unit: "종목",
  favorite: "관심 종목",
  emptyTitle: "관심 종목이 없습니다",
  emptyDescription: "시장/거래에서 관심 있는 종목을 추가해보세요.",
  loadingStocks: "관심 종목 불러오는 중",
  stockLoadFailed: "관심 종목 연동 실패",
  favoriteUpdateFailed: "관심 종목 변경 실패",
};

export default function FavoritesPage() {
  const [favoriteTickers, setFavoriteTickers] = useState<Set<string>>(new Set());
  const [updatingFavoriteTickers, setUpdatingFavoriteTickers] = useState<Set<string>>(new Set());
  const [favoriteStocks, setFavoriteStocks] = useState<FavoriteStock[]>([]);
  const [favoriteSummary, setFavoriteSummary] = useState<FavoriteStockSummary>({
    falling: 0,
    rising: 0,
    total: 0,
  });
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [hasFavoriteError, setHasFavoriteError] = useState(false);
  const [hasStockError, setHasStockError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFavoriteStocks = async () => {
      setIsStockLoading(true);
      setHasStockError(false);

      try {
        const favorites = await fetchFavoriteStocks();

        if (isMounted) {
          setFavoriteStocks(favorites.items);
          setFavoriteSummary(favorites.summary);
          setFavoriteTickers(new Set(favorites.items.map((stock) => stock.ticker)));
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
    return favoriteStocks.filter((stock) => favoriteTickers.has(stock.ticker));
  }, [favoriteStocks, favoriteTickers]);

  const handleFavoriteToggle = async (stock: FavoriteStock) => {
    setHasFavoriteError(false);
    setUpdatingFavoriteTickers((currentTickers) => new Set(currentTickers).add(stock.ticker));
    setFavoriteTickers((currentTickers) => {
      const nextTickers = new Set(currentTickers);

      nextTickers.delete(stock.ticker);

      return nextTickers;
    });
    setFavoriteSummary((currentSummary) => getSummaryAfterRemoval(currentSummary, stock));

    try {
      const result = await removeFavoriteStock(stock.ticker);

      if (result.favorite) {
        setFavoriteTickers((currentTickers) =>
          new Set(currentTickers).add(result.ticker ?? stock.ticker),
        );
        setFavoriteSummary((currentSummary) => getSummaryAfterRestore(currentSummary, stock));
      }
    } catch {
      setHasFavoriteError(true);
      setFavoriteTickers((currentTickers) => new Set(currentTickers).add(stock.ticker));
      setFavoriteSummary((currentSummary) => getSummaryAfterRestore(currentSummary, stock));
    } finally {
      setUpdatingFavoriteTickers((currentTickers) => {
        const nextTickers = new Set(currentTickers);

        nextTickers.delete(stock.ticker);

        return nextTickers;
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{copy.sectionTitle}</h2>
          {isStockLoading || hasStockError || hasFavoriteError ? (
            <span className="text-xs font-medium text-muted-foreground">
              {isStockLoading
                ? copy.loadingStocks
                : hasStockError
                  ? copy.stockLoadFailed
                  : copy.favoriteUpdateFailed}
            </span>
          ) : null}
        </div>

        <FavoriteSummary summary={favoriteSummary} />

        {visibleFavoriteStocks.length > 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              {visibleFavoriteStocks.map((stock) => (
                <FavoriteStockRow
                  key={stock.ticker}
                  isFavorite={favoriteTickers.has(stock.ticker)}
                  isFavoriteUpdating={updatingFavoriteTickers.has(stock.ticker)}
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

function getSummaryAfterRemoval(summary: FavoriteStockSummary, stock: FavoriteStock) {
  return {
    falling: Math.max(0, summary.falling - (stock.tone === "blue" ? 1 : 0)),
    rising: Math.max(0, summary.rising - (stock.tone === "red" ? 1 : 0)),
    total: Math.max(0, summary.total - 1),
  };
}

function getSummaryAfterRestore(summary: FavoriteStockSummary, stock: FavoriteStock) {
  return {
    falling: summary.falling + (stock.tone === "blue" ? 1 : 0),
    rising: summary.rising + (stock.tone === "red" ? 1 : 0),
    total: summary.total + 1,
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
        <SummaryMetric label={copy.total} value={`${summary.total}`} unit={copy.unit} />
        <SummaryMetric label={copy.rising} value={`${summary.rising}`} tone="red" />
        <SummaryMetric label={copy.falling} value={`${summary.falling}`} tone="blue" />
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
  isFavoriteUpdating,
  stock,
  onFavoriteToggle,
}: {
  isFavorite: boolean;
  isFavoriteUpdating: boolean;
  stock: FavoriteStock;
  onFavoriteToggle: (stock: FavoriteStock) => void;
}) {
  const toneClass = stock.tone === "blue" ? "text-blue-600" : "text-red-500";

  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_72px_88px_20px] items-center gap-2 border-b border-border/40 px-4 py-3 transition-colors duration-200 last:border-0 hover:bg-accent/40">
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

        <strong className="text-right text-sm font-semibold tracking-tight whitespace-nowrap tabular-nums text-foreground">
          {stock.price}
        </strong>

        <span
          className={`min-w-0 text-right text-sm leading-none font-normal whitespace-nowrap tabular-nums ${toneClass}`}
        >
          {stock.change}
        </span>
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copy.favorite}
        aria-pressed={isFavorite}
        disabled={isFavoriteUpdating}
        onClick={() => onFavoriteToggle(stock)}
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

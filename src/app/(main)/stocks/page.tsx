"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addFavoriteStock,
  fetchFavoriteStocks,
  fetchMarketIndices,
  fetchMainStockQuotes,
  getTickerCurrency,
  MAIN_STOCK_SEEDS,
  removeFavoriteStock,
  type MarketIndexQuote,
  type StockQuote,
  type StockQuoteSeed,
} from "@/services/marketService";

type MarketIndex = MarketIndexQuote;

type Stock = StockQuote;

type SortField = "name" | "price" | "change";
type SortOrder = "asc" | "desc";
type MarketFilter = "all" | "krw" | "usd";
type SlideDirection = "next" | "previous";

const copy = {
  kospi: "\ucf54\uc2a4\ud53c",
  kosdaq: "\ucf54\uc2a4\ub2e5",
  nasdaq: "\ub098\uc2a4\ub2e5",
  sp500: "S&P 500",
  dow: "\ub2e4\uc6b0",
  nikkei: "\ub2c8\ucf00\uc774",
  mainStocks: "\uc8fc\uc694 \uc885\ubaa9",
  sortLabel: "\uc815\ub82c\uae30\uc900",
  volumeSort: "\uac70\ub798\ub7c9\uc21c",
  priceSort: "\uac00\uaca9\uc21c",
  nameSort: "\uc885\ubaa9\uba85",
  priceSortLabel: "\uac00\uaca9",
  changeSort: "\ub4f1\ub77d\ub960",
  samsung: "\uc0bc\uc131\uc804\uc790",
  skHynix: "SK\ud558\uc774\ub2c9\uc2a4",
  naver: "\ub124\uc774\ubc84",
  kakao: "\uce74\uce74\uc624",
  hyundai: "\ud604\ub300\ucc28",
  lgEnergy: "LG\uc5d0\ub108\uc9c0\uc194\ub8e8\uc158",
  posco: "POSCO\ud640\ub529\uc2a4",
  celltrion: "\uc140\ud2b8\ub9ac\uc628",
  kbFinance: "KB\uae08\uc735",
  shinhan: "\uc2e0\ud55c\uc9c0\uc8fc",
  hanwha: "\ud55c\ud654\uc624\uc158",
  krafton: "\ud06c\ub798\ud504\ud1a4",
  moreStocks: "\ub354\ubcf4\uae30",
  foldStocks: "\uc811\uae30",
  menu: "\uba54\ub274",
  marketTrade: "\uc2dc\uc7a5/\uac70\ub798",
  favorites: "\uad00\uc2ec \uc885\ubaa9",
  portfolio: "\ud3ec\ud2b8\ud3f4\ub9ac\uc624",
  ranking: "\ub7ad\ud0b9",
  chart: "\ucc28\ud2b8",
  favoriteStock: "\uad00\uc2ec \uc885\ubaa9",
  loadingStocks: "\uc2dc\uc138 \ubd88\ub7ec\uc624\ub294 \uc911",
  stockLoadFailed: "\uc2dc\uc138 \uc5f0\ub3d9 \uc2e4\ud328",
  favoriteLoadFailed: "\uad00\uc2ec \uc885\ubaa9 \uc5f0\ub3d9 \uc2e4\ud328",
};

const fallbackMarketIndexes: MarketIndex[] = [
  {
    id: 1,
    name: copy.kospi,
    change: "-24.78 (0.39%)",
    price: "\u20a96,413.25",
    tone: "blue",
    points:
      "1,50 7,32 13,43 20,18 26,36 33,27 40,15 47,24 54,17 61,39 68,20 75,31 82,23 89,18 95,12",
  },
  {
    id: 2,
    name: copy.kosdaq,
    change: "+0.47 (0.04%)",
    price: "\u20a91,179.57",
    tone: "red",
    points:
      "1,49 7,31 14,45 21,35 28,48 35,17 42,27 49,20 56,26 63,15 70,43 77,29 84,22 91,17 95,14",
  },
  {
    id: 3,
    name: copy.nasdaq,
    change: "+18.42 (0.12%)",
    price: "\u20a918,204.10",
    tone: "red",
    points: "1,42 8,35 15,29 22,37 29,21 36,25 43,16 50,31 57,24 64,19 71,26 78,14 86,20 95,11",
  },
  {
    id: 4,
    name: copy.sp500,
    change: "-6.14 (0.08%)",
    price: "\u20a95,921.44",
    tone: "blue",
    points: "1,18 8,28 15,20 22,35 29,27 36,38 43,22 50,30 57,24 64,42 71,35 78,31 86,28 95,36",
  },
  {
    id: 5,
    name: copy.dow,
    change: "+42.10 (0.10%)",
    price: "\u20a942,611.72",
    tone: "red",
    points: "1,41 8,36 15,30 22,33 29,20 36,26 43,16 50,21 57,14 64,25 71,19 78,15 86,18 95,10",
  },
  {
    id: 6,
    name: copy.nikkei,
    change: "-112.35 (0.28%)",
    price: "\u20a939,872.50",
    tone: "blue",
    points: "1,15 8,19 15,30 22,22 29,35 36,28 43,42 50,33 57,45 64,37 71,40 78,34 86,46 95,39",
  },
];

const stocks = MAIN_STOCK_SEEDS;

export default function Home() {
  const [marketPage, setMarketPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("change");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all");
  const [favoriteTickers, setFavoriteTickers] = useState<Set<string>>(new Set());
  const [updatingFavoriteTickers, setUpdatingFavoriteTickers] = useState<Set<string>>(new Set());
  const [isMoreStocksOpen, setIsMoreStocksOpen] = useState(false);
  const [isMarketSliding, setIsMarketSliding] = useState(false);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [isMarketIndexLoading, setIsMarketIndexLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);
  const [hasFavoriteError, setHasFavoriteError] = useState(false);
  const [hasStockError, setHasStockError] = useState(false);
  const [marketIndexes, setMarketIndexes] = useState<MarketIndex[]>([]);
  const [mainStocks, setMainStocks] = useState<Stock[]>(() => stocks.map(toPendingStock));
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("next");
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalMarketPages = Math.ceil(marketIndexes.length / 2);
  const visibleMarketIndexes = marketIndexes.slice(marketPage * 2, marketPage * 2 + 2);
  const filteredStocks = useMemo(() => {
    if (marketFilter === "all") return mainStocks;
    return mainStocks.filter((stock) =>
      marketFilter === "krw" ? stock.currency === "KRW" : stock.currency === "USD",
    );
  }, [mainStocks, marketFilter]);

  const sortedStocks = useMemo(() => {
    return [...filteredStocks].sort((firstStock, secondStock) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = firstStock.name.localeCompare(secondStock.name, "ko");
      } else if (sortField === "price") {
        comparison = firstStock.priceValue - secondStock.priceValue;
      } else if (sortField === "change") {
        comparison = firstStock.changeRate - secondStock.changeRate;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredStocks, sortField, sortOrder]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMarketIndices = async () => {
      try {
        const indices = await fetchMarketIndices();

        if (isMounted) {
          setMarketIndexes(indices);
        }
      } catch {
        if (isMounted) {
          setMarketIndexes(fallbackMarketIndexes);
        }
      } finally {
        if (isMounted) {
          setIsMarketIndexLoading(false);
        }
      }
    };

    void loadMarketIndices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      setIsFavoriteLoading(true);
      setHasFavoriteError(false);

      try {
        const favorites = await fetchFavoriteStocks();

        if (isMounted) {
          setFavoriteTickers(new Set(favorites.items.map((stock) => stock.ticker)));
        }
      } catch {
        if (isMounted) {
          setHasFavoriteError(true);
        }
      } finally {
        if (isMounted) {
          setIsFavoriteLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStocks = async () => {
      setIsStockLoading(true);
      setHasStockError(false);

      try {
        const stockQuotes = await fetchMainStockQuotes(stocks);

        if (isMounted) {
          setMainStocks(stockQuotes);
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

    void loadStocks();

    return () => {
      isMounted = false;
    };
  }, []);

  const moveMarketPage = (nextPage: number, direction: SlideDirection) => {
    setSlideDirection(direction);
    setIsMarketSliding(true);
    setMarketPage(nextPage);

    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    slideTimerRef.current = setTimeout(() => {
      setIsMarketSliding(false);
    }, 260);
  };

  const handlePreviousMarketPage = () => {
    const nextPage = (marketPage - 1 + totalMarketPages) % totalMarketPages;

    moveMarketPage(nextPage, "previous");
  };

  const handleNextMarketPage = () => {
    const nextPage = (marketPage + 1) % totalMarketPages;

    moveMarketPage(nextPage, "next");
  };

  const handleSelectMarketPage = (nextPage: number) => {
    if (nextPage === marketPage) {
      return;
    }

    moveMarketPage(nextPage, nextPage > marketPage ? "next" : "previous");
  };

  const handleFavoriteStock = async (stock: Stock) => {
    const wasFavorite = favoriteTickers.has(stock.ticker);

    setHasFavoriteError(false);
    setUpdatingFavoriteTickers((currentTickers) => new Set(currentTickers).add(stock.ticker));
    setFavoriteTickers((currentTickers) => {
      const nextTickers = new Set(currentTickers);

      if (wasFavorite) {
        nextTickers.delete(stock.ticker);
      } else {
        nextTickers.add(stock.ticker);
      }

      return nextTickers;
    });

    try {
      const result = wasFavorite
        ? await removeFavoriteStock(stock.ticker)
        : await addFavoriteStock(stock.ticker);

      setFavoriteTickers((currentTickers) => {
        const nextTickers = new Set(currentTickers);
        const resultTicker = result.ticker ?? stock.ticker;

        if (result.favorite) {
          nextTickers.add(resultTicker);
        } else {
          nextTickers.delete(resultTicker);
        }

        return nextTickers;
      });
    } catch {
      setHasFavoriteError(true);
      setFavoriteTickers((currentTickers) => {
        const nextTickers = new Set(currentTickers);

        if (wasFavorite) {
          nextTickers.add(stock.ticker);
        } else {
          nextTickers.delete(stock.ticker);
        }

        return nextTickers;
      });
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
      <MarketIndexSection
        isLoading={isMarketIndexLoading}
        marketPage={marketPage}
        marketPages={totalMarketPages}
        marketIndexes={visibleMarketIndexes}
        isSliding={isMarketSliding}
        onNext={handleNextMarketPage}
        onPrevious={handlePreviousMarketPage}
        onSelectPage={handleSelectMarketPage}
        slideDirection={slideDirection}
      />
      <MainStockSection
        favoriteTickers={favoriteTickers}
        hasFavoriteError={hasFavoriteError}
        hasStockError={hasStockError}
        isFavoriteLoading={isFavoriteLoading}
        isMoreStocksOpen={isMoreStocksOpen}
        isStockLoading={isStockLoading}
        marketFilter={marketFilter}
        sortField={sortField}
        sortOrder={sortOrder}
        stocks={sortedStocks}
        updatingFavoriteTickers={updatingFavoriteTickers}
        onFavoriteStock={handleFavoriteStock}
        onMarketFilterChange={setMarketFilter}
        onMoreStocksClose={() => setIsMoreStocksOpen(false)}
        onMoreStocksOpen={() => setIsMoreStocksOpen(true)}
        onSortFieldChange={setSortField}
        onSortOrderChange={setSortOrder}
      />
    </div>
  );
}

function MarketIndexCardSkeleton() {
  return (
    <Card className="h-[112px] rounded-lg py-2 shadow-md shadow-zinc-200/80 ring-0">
      <CardContent className="flex h-full flex-col gap-1.5 px-2.5">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="min-h-0 w-full flex-1 rounded" />
        <div className="flex items-center justify-between gap-1">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function MarketIndexSection({
  isLoading,
  marketIndexes,
  marketPage,
  marketPages,
  isSliding,
  onNext,
  onPrevious,
  onSelectPage,
  slideDirection,
}: {
  isLoading: boolean;
  marketIndexes: MarketIndex[];
  marketPage: number;
  marketPages: number;
  isSliding: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelectPage: (page: number) => void;
  slideDirection: SlideDirection;
}) {
  const slideClass = isSliding
    ? slideDirection === "next"
      ? "translate-x-2 opacity-80"
      : "-translate-x-2 opacity-80"
    : "translate-x-0 opacity-100";

  return (
    <section className="flex flex-col gap-4 pt-6">
      <div className="grid grid-cols-[24px_minmax(0,1fr)_24px] items-stretch gap-2">
        {!isLoading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-full"
            aria-label="Previous market cards"
            onClick={onPrevious}
          >
            <ChevronLeft className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        ) : (
          <div />
        )}
        <div
          className={`grid flex-1 grid-cols-2 gap-4 transition-all duration-300 ease-out ${slideClass}`}
        >
          {isLoading
            ? [0, 1].map((i) => <MarketIndexCardSkeleton key={i} />)
            : marketIndexes.map((marketIndex) => (
                <MarketIndexCard key={marketIndex.id} marketIndex={marketIndex} />
              ))}
        </div>
        {!isLoading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-full"
            aria-label="Next market cards"
            onClick={onNext}
          >
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        ) : (
          <div />
        )}
      </div>
      {!isLoading && (
        <div className="flex h-3 items-center justify-center gap-3">
          {Array.from({ length: marketPages }, (_, page) => (
            <Button
              key={page}
              type="button"
              variant="ghost"
              size="icon-xs"
              className={`size-3 rounded-full p-0 ${marketPage === page ? "bg-blue-600" : "bg-muted"}`}
              aria-label={`Market page ${page + 1}`}
              aria-pressed={marketPage === page}
              onClick={() => onSelectPage(page)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function MarketIndexCard({ marketIndex }: { marketIndex: MarketIndex }) {
  const isBlue = marketIndex.tone === "blue";
  const cardToneClass = isBlue ? "bg-blue-50/80" : "bg-red-50/80";
  const chartToneClass = isBlue ? "text-blue-500" : "text-red-500";
  const changeToneClass = isBlue ? "text-blue-600" : "text-red-500";

  return (
    <Card
      className={`${cardToneClass} h-[112px] rounded-lg py-2 shadow-md shadow-zinc-200/80 ring-0`}
    >
      <CardContent className="flex h-full flex-col gap-1.5 px-2.5">
        <span className="text-xs font-medium leading-none text-foreground">{marketIndex.name}</span>
        <svg
          className={`min-h-0 w-full flex-1 ${chartToneClass}`}
          viewBox="0 0 120 56"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${marketIndex.name} ${copy.chart}`}
        >
          <path d="M0 48 H120" className="stroke-current opacity-10" strokeWidth="1" />
          <path d="M0 36 H120" className="stroke-current opacity-10" strokeWidth="1" />
          <path d="M0 24 H120" className="stroke-current opacity-10" strokeWidth="1" />
          <path
            d={`M ${marketIndex.points} L 119 54 L 1 54 Z`}
            className="fill-current opacity-10"
          />
          <polyline
            points={marketIndex.points}
            className="fill-none stroke-current"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
        <div className="flex items-baseline justify-between gap-1">
          <strong className="text-sm font-bold leading-none tracking-tight text-foreground">
            {marketIndex.price}
          </strong>
          <span className={`text-[11px] font-medium leading-none ${changeToneClass}`}>
            {marketIndex.change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function MainStockSection({
  favoriteTickers,
  hasFavoriteError,
  hasStockError,
  isFavoriteLoading,
  isMoreStocksOpen,
  isStockLoading,
  marketFilter,
  sortField,
  sortOrder,
  stocks,
  updatingFavoriteTickers,
  onFavoriteStock,
  onMarketFilterChange,
  onMoreStocksClose,
  onMoreStocksOpen,
  onSortFieldChange,
  onSortOrderChange,
}: {
  favoriteTickers: Set<string>;
  hasFavoriteError: boolean;
  hasStockError: boolean;
  isFavoriteLoading: boolean;
  isMoreStocksOpen: boolean;
  isStockLoading: boolean;
  marketFilter: MarketFilter;
  sortField: SortField;
  sortOrder: SortOrder;
  stocks: Stock[];
  updatingFavoriteTickers: Set<string>;
  onFavoriteStock: (stock: Stock) => void;
  onMarketFilterChange: (filter: MarketFilter) => void;
  onMoreStocksClose: () => void;
  onMoreStocksOpen: () => void;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}) {
  const stockListRef = useRef<HTMLDivElement | null>(null);
  const visibleStocks = isMoreStocksOpen ? stocks : stocks.slice(0, 10);

  useEffect(() => {
    if (isMoreStocksOpen && stockListRef.current) {
      stockListRef.current.scrollTop = 0;
    }
  }, [isMoreStocksOpen]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortFieldChange(field);
      onSortOrderChange(field === "name" ? "asc" : "desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold leading-none">{copy.mainStocks}</h2>
            {hasStockError || hasFavoriteError ? (
              <span className="text-xs font-medium leading-none text-muted-foreground">
                {hasStockError ? copy.stockLoadFailed : copy.favoriteLoadFailed}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex gap-1.5 px-4 pb-3">
          {(["all", "krw", "usd"] as const).map((filter) => {
            const label = filter === "all" ? "전체" : filter === "krw" ? "한국 주식" : "미국 주식";
            const isActive = marketFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onMarketFilterChange(filter)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end border-t border-border/40 bg-zinc-50/50 px-4 py-2.5 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="link"
              size="xs"
              className={`h-auto p-0 hover:no-underline ${
                sortField === "name" ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => handleSort("name")}
            >
              {copy.nameSort}
              {getSortIcon("name")}
            </Button>
            <span className="text-muted-foreground/30">|</span>
            <Button
              type="button"
              variant="link"
              size="xs"
              className={`h-auto p-0 hover:no-underline ${
                sortField === "price" ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => handleSort("price")}
            >
              {copy.priceSortLabel}
              {getSortIcon("price")}
            </Button>
            <span className="text-muted-foreground/30">|</span>
            <Button
              type="button"
              variant="link"
              size="xs"
              className={`h-auto p-0 hover:no-underline ${
                sortField === "change" ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => handleSort("change")}
            >
              {copy.changeSort}
              {getSortIcon("change")}
            </Button>
          </div>
        </div>
        <div ref={stockListRef}>
          {isStockLoading
            ? Array.from({ length: 10 }, (_, i) => <StockRowSkeleton key={i} />)
            : visibleStocks.map((stock) => (
                <StockRow
                  key={stock.id}
                  isFavorite={favoriteTickers.has(stock.ticker)}
                  isFavoriteLoading={isFavoriteLoading}
                  isFavoriteUpdating={updatingFavoriteTickers.has(stock.ticker)}
                  stock={stock}
                  onFavoriteStock={onFavoriteStock}
                />
              ))}
        </div>
        <div className="border-t border-border">
          {!isMoreStocksOpen ? (
            <MoreStocksButton label={copy.moreStocks} onClick={onMoreStocksOpen} />
          ) : (
            <MoreStocksButton label={copy.foldStocks} onClick={onMoreStocksClose} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MoreStocksButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full text-xs font-medium text-muted-foreground"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function toPendingStock(stock: StockQuoteSeed): Stock {
  return {
    ...stock,
    change: "-",
    changePrice: 0,
    changeRate: 0,
    currency: getTickerCurrency(stock.ticker),
    marketCap: null,
    per: null,
    price: "-",
    priceValue: 0,
    range52w: null,
    tone: "blue",
  };
}

function StockRowSkeleton() {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_72px_88px_20px] items-center gap-2 border-b border-border/40 px-4 py-3 last:border-0">
      <Skeleton className="size-5 shrink-0 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-2.5 w-12 rounded" />
      </div>
      <Skeleton className="ml-auto h-3.5 w-14 rounded" />
      <Skeleton className="ml-auto h-3.5 w-16 rounded" />
      <Skeleton className="size-5 shrink-0 rounded" />
    </div>
  );
}

function StockRow({
  isFavorite,
  isFavoriteLoading,
  isFavoriteUpdating,
  stock,
  onFavoriteStock,
}: {
  isFavorite: boolean;
  isFavoriteLoading: boolean;
  isFavoriteUpdating: boolean;
  stock: Stock;
  onFavoriteStock: (stock: Stock) => void;
}) {
  const changeToneClass = stock.tone === "red" ? "text-red-500" : "text-blue-600";

  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_72px_88px_20px] items-center gap-2 border-b border-border/40 px-4 py-3 transition-colors duration-200 last:border-0 hover:bg-accent/40 group">
      <Link
        href={`/stock-detail/${stock.ticker}`}
        className="contents"
        aria-label={`${stock.name} 종목 상세로 이동`}
      >
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs font-normal text-blue-600">
          {stock.logo}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground inline-block origin-left group-hover:scale-105">
            {stock.name}
          </span>
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {stock.ticker}
          </span>
        </span>
        <strong className="text-right text-sm font-semibold tracking-tight whitespace-nowrap tabular-nums text-foreground">
          {stock.price}
        </strong>
        <span
          className={`min-w-0 text-right text-sm leading-none font-normal whitespace-nowrap tabular-nums ${changeToneClass}`}
        >
          {stock.change}
        </span>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copy.favoriteStock}
        aria-pressed={isFavorite}
        disabled={isFavoriteLoading || isFavoriteUpdating}
        onClick={() => onFavoriteStock(stock)}
      >
        <Heart
          className={`size-5 stroke-[2] ${
            isFavoriteLoading
              ? "text-muted-foreground/40"
              : isFavorite
                ? "fill-red-500 text-red-500"
                : "text-foreground"
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

"use client";

import {
  Bell,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Menu,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from "react";

import { Card, CardContent } from "@/components/ui/card";

type MarketIndex = {
  name: string;
  change: string;
  price: string;
  tone: "blue" | "red";
  points: string;
};

type Stock = {
  id: number;
  logo: string;
  name: string;
  price: string;
  priceValue: number;
  change: string;
  volumeRank: number;
};

type SortType = "volume" | "price";
type SlideDirection = "next" | "previous";

type NavigationItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

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
  samsung: "\uc0bc\uc131\uc804\uc790",
  skHynix: "SK\ud558\uc774\ub2c9\uc2a4",
  naver: "\ub124\uc774\ubc84",
  kakao: "\uce74\uce74\uc624",
  hyundai: "\ud604\ub300\ucc28",
  aiNews: "AI \ub274\uc2a4",
  aiNewsBody: "\uc624\ub298\uc758 \uc2dc\uc7a5 \uc694\uc57d\uacfc \uc8fc\uc694 \uc885\ubaa9 \ud750\ub984\uc744 \ub354\ubbf8 \ub370\uc774\ud130\ub85c \ud45c\uc2dc\ud569\ub2c8\ub2e4.",
  menu: "\uba54\ub274",
  marketTrade: "\uc2dc\uc7a5/\uac70\ub798",
  favorites: "\uad00\uc2ec \uc885\ubaa9",
  portfolio: "\ud3ec\ud2b8\ud3f4\ub9ac\uc624",
  ranking: "\ub7ad\ud0b9",
  chart: "\ucc28\ud2b8",
  alarm: "\uc54c\ub9bc",
  close: "\ub2eb\uae30",
  noticeTitle: "\uc54c\ub9bc",
  noticeBody: "\uc0c8\ub85c\uc6b4 AI \ub274\uc2a4 \uc694\uc57d\uc774 \ub3c4\ucc29\ud588\uc2b5\ub2c8\ub2e4.",
  favoriteStock: "\uad00\uc2ec \uc885\ubaa9",
};

const marketIndexes: MarketIndex[] = [
  {
    name: copy.kospi,
    change: "-24.78 (0.39%)",
    price: "\u20a96,413.25",
    tone: "blue",
    points: "1,50 7,32 13,43 20,18 26,36 33,27 40,15 47,24 54,17 61,39 68,20 75,31 82,23 89,18 95,12",
  },
  {
    name: copy.kosdaq,
    change: "+0.47 (0.04%)",
    price: "\u20a91,179.57",
    tone: "red",
    points: "1,49 7,31 14,45 21,35 28,48 35,17 42,27 49,20 56,26 63,15 70,43 77,29 84,22 91,17 95,14",
  },
  {
    name: copy.nasdaq,
    change: "+18.42 (0.12%)",
    price: "\u20a918,204.10",
    tone: "red",
    points: "1,42 8,35 15,29 22,37 29,21 36,25 43,16 50,31 57,24 64,19 71,26 78,14 86,20 95,11",
  },
  {
    name: copy.sp500,
    change: "-6.14 (0.08%)",
    price: "\u20a95,921.44",
    tone: "blue",
    points: "1,18 8,28 15,20 22,35 29,27 36,38 43,22 50,30 57,24 64,42 71,35 78,31 86,28 95,36",
  },
  {
    name: copy.dow,
    change: "+42.10 (0.10%)",
    price: "\u20a942,611.72",
    tone: "red",
    points: "1,41 8,36 15,30 22,33 29,20 36,26 43,16 50,21 57,14 64,25 71,19 78,15 86,18 95,10",
  },
  {
    name: copy.nikkei,
    change: "-112.35 (0.28%)",
    price: "\u20a939,872.50",
    tone: "blue",
    points: "1,15 8,19 15,30 22,22 29,35 36,28 43,42 50,33 57,45 64,37 71,40 78,34 86,46 95,39",
  },
];

const stocks: Stock[] = [
  { id: 1, logo: "S", name: copy.samsung, price: "\u20a9217,000", priceValue: 217000, change: "\u25bc 1.42%", volumeRank: 1 },
  { id: 2, logo: "S", name: copy.skHynix, price: "\u20a9189,500", priceValue: 189500, change: "\u25bc 0.92%", volumeRank: 2 },
  { id: 3, logo: "N", name: copy.naver, price: "\u20a9212,000", priceValue: 212000, change: "\u25bc 1.15%", volumeRank: 5 },
  { id: 4, logo: "K", name: copy.kakao, price: "\u20a956,400", priceValue: 56400, change: "\u25bc 0.48%", volumeRank: 3 },
  { id: 5, logo: "H", name: copy.hyundai, price: "\u20a9241,000", priceValue: 241000, change: "\u25bc 1.02%", volumeRank: 4 },
  { id: 6, logo: "S", name: copy.samsung, price: "\u20a9217,000", priceValue: 217000, change: "\u25bc 1.42%", volumeRank: 6 },
  { id: 7, logo: "N", name: copy.naver, price: "\u20a9212,000", priceValue: 212000, change: "\u25bc 1.15%", volumeRank: 8 },
  { id: 8, logo: "K", name: copy.kakao, price: "\u20a956,400", priceValue: 56400, change: "\u25bc 0.48%", volumeRank: 7 },
];

const navigationItems: NavigationItem[] = [
  { label: copy.menu, icon: Menu },
  { label: copy.marketTrade, icon: ChartNoAxesColumnIncreasing },
  { label: copy.favorites, icon: Heart },
  { label: copy.portfolio, icon: Clock3 },
  { label: copy.ranking, icon: Trophy },
];

export default function Home() {
  const [marketPage, setMarketPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState(copy.menu);
  const [sortType, setSortType] = useState<SortType>("volume");
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isAiNewsOpen, setIsAiNewsOpen] = useState(false);
  const [isMarketSliding, setIsMarketSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("next");
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalMarketPages = Math.ceil(marketIndexes.length / 2);
  const visibleMarketIndexes = marketIndexes.slice(marketPage * 2, marketPage * 2 + 2);
  const sortedStocks = useMemo(() => {
    if (sortType === "price") {
      return [...stocks].sort((firstStock, secondStock) => secondStock.priceValue - firstStock.priceValue);
    }

    return [...stocks].sort((firstStock, secondStock) => firstStock.volumeRank - secondStock.volumeRank);
  }, [sortType]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
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

  const handleFavoriteStock = (stockId: number) => {
    setFavoriteIds((currentFavoriteIds) => {
      const nextFavoriteIds = new Set(currentFavoriteIds);

      if (nextFavoriteIds.has(stockId)) {
        nextFavoriteIds.delete(stockId);
      } else {
        nextFavoriteIds.add(stockId);
      }

      return nextFavoriteIds;
    });
  };

  return (
    <main className="min-h-screen bg-zinc-100 font-sans text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] justify-center bg-white">
        <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white px-8 pb-4 pt-6 [font-family:var(--font-noto-sans-kr),var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]">
          <Header isNoticeOpen={isNoticeOpen} onToggleNotice={() => setIsNoticeOpen((isOpen) => !isOpen)} />
          {isNoticeOpen ? <NoticePanel onClose={() => setIsNoticeOpen(false)} /> : null}
          <MarketIndexSection
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
            favoriteIds={favoriteIds}
            sortType={sortType}
            stocks={sortedStocks}
            onFavoriteStock={handleFavoriteStock}
            onSortChange={setSortType}
          />
          <AiNewsSection isOpen={isAiNewsOpen} onToggle={() => setIsAiNewsOpen((isOpen) => !isOpen)} />
          <BottomNavigation selectedTab={selectedTab} onSelectTab={setSelectedTab} />
        </section>
      </div>
    </main>
  );
}

function Header({
  isNoticeOpen,
  onToggleNotice,
}: {
  isNoticeOpen: boolean;
  onToggleNotice: () => void;
}) {
  return (
    <header className="flex h-8 items-center justify-between">
      <h1 className="text-xl font-bold tracking-normal">Wealth Flow</h1>
      <button
        type="button"
        className="relative flex size-8 items-center justify-center"
        aria-label={copy.alarm}
        aria-pressed={isNoticeOpen}
        onClick={onToggleNotice}
      >
        <Bell className="size-6 stroke-[2.4]" aria-hidden="true" />
        <span className="absolute right-1 top-0 size-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}

function NoticePanel({ onClose }: { onClose: () => void }) {
  return (
    <Card className="absolute right-8 top-14 z-10 w-56 rounded-lg bg-white py-3 shadow-lg shadow-zinc-300/70 ring-1 ring-zinc-200">
      <CardContent className="flex flex-col gap-2 px-3">
        <div className="flex items-center justify-between">
          <strong className="text-sm font-semibold">{copy.noticeTitle}</strong>
          <button type="button" aria-label={copy.close} onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-xs leading-5 text-zinc-600">{copy.noticeBody}</p>
      </CardContent>
    </Card>
  );
}

function MarketIndexSection({
  marketIndexes,
  marketPage,
  marketPages,
  isSliding,
  onNext,
  onPrevious,
  onSelectPage,
  slideDirection,
}: {
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
      <div className="grid grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-2">
        <button type="button" aria-label="Previous market cards" onClick={onPrevious}>
          <ChevronLeft className="size-6 shrink-0 text-zinc-300" aria-hidden="true" />
        </button>
        <div
          className={`grid flex-1 grid-cols-2 gap-4 transition-all duration-300 ease-out ${slideClass}`}
        >
          {marketIndexes.map((marketIndex) => (
            <MarketIndexCard key={marketIndex.name} marketIndex={marketIndex} />
          ))}
        </div>
        <button type="button" aria-label="Next market cards" onClick={onNext}>
          <ChevronRight className="size-6 shrink-0 text-zinc-300" aria-hidden="true" />
        </button>
      </div>
      <div className="flex h-3 items-center justify-center gap-3">
        {Array.from({ length: marketPages }, (_, page) => (
          <button
            key={page}
            type="button"
            className={`size-2 rounded-full ${marketPage === page ? "bg-blue-600" : "bg-zinc-200"}`}
            aria-label={`Market page ${page + 1}`}
            aria-pressed={marketPage === page}
            onClick={() => onSelectPage(page)}
          />
        ))}
      </div>
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
      className={`${cardToneClass} h-[92px] rounded-lg py-2 shadow-md shadow-zinc-200/80 ring-0`}
    >
      <CardContent className="flex h-full flex-col gap-1 px-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-semibold leading-none text-zinc-950">
            {marketIndex.name}
          </span>
          <span className={`text-[7px] leading-none ${changeToneClass}`}>
            {marketIndex.change}
          </span>
        </div>
        <svg
          className={`h-12 w-full ${chartToneClass}`}
          viewBox="0 0 96 56"
          role="img"
          aria-label={`${marketIndex.name} ${copy.chart}`}
        >
          <path d="M0 48 H96" className="stroke-current opacity-10" strokeWidth="1" />
          <path d="M0 36 H96" className="stroke-current opacity-10" strokeWidth="1" />
          <path d="M0 24 H96" className="stroke-current opacity-10" strokeWidth="1" />
          <path
            d={`M ${marketIndex.points} L 95 54 L 1 54 Z`}
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
        <strong className="text-base leading-none font-bold tracking-tight text-zinc-950">
          {marketIndex.price}
        </strong>
      </CardContent>
    </Card>
  );
}

function MainStockSection({
  favoriteIds,
  sortType,
  stocks,
  onFavoriteStock,
  onSortChange,
}: {
  favoriteIds: Set<number>;
  sortType: SortType;
  stocks: Stock[];
  onFavoriteStock: (stockId: number) => void;
  onSortChange: (sortType: SortType) => void;
}) {
  return (
    <section className="flex flex-col gap-4 pt-8">
      <div className="flex h-6 items-end justify-between">
        <h2 className="text-lg font-semibold">{copy.mainStocks}</h2>
        <div className="flex items-center gap-2 text-[8px] font-semibold text-zinc-950">
          <span>{copy.sortLabel}</span>
          <button
            type="button"
            className={sortType === "volume" ? "text-zinc-950 underline underline-offset-2" : "text-zinc-500"}
            onClick={() => onSortChange("volume")}
          >
            {copy.volumeSort}
          </button>
          <button
            type="button"
            className={sortType === "price" ? "text-zinc-950 underline underline-offset-2" : "text-zinc-500"}
            onClick={() => onSortChange("price")}
          >
            {copy.priceSort}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {stocks.map((stock) => (
          <StockRow
            key={stock.id}
            isFavorite={favoriteIds.has(stock.id)}
            stock={stock}
            onFavoriteStock={onFavoriteStock}
          />
        ))}
      </div>
    </section>
  );
}

function StockRow({
  isFavorite,
  stock,
  onFavoriteStock,
}: {
  isFavorite: boolean;
  stock: Stock;
  onFavoriteStock: (stockId: number) => void;
}) {
  return (
    <div className="grid h-9 grid-cols-[20px_minmax(0,1fr)_76px_42px_20px] items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 shadow-sm shadow-zinc-200/70">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-[11px] font-normal text-blue-600">
        {stock.logo}
      </span>
      <span className="truncate text-xs font-normal text-zinc-950">{stock.name}</span>
      <strong className="text-right text-xs font-semibold tracking-tight text-zinc-950">
        {stock.price}
      </strong>
      <span className="text-[8px] font-normal text-blue-600">{stock.change}</span>
      <button
        type="button"
        aria-label={copy.favoriteStock}
        aria-pressed={isFavorite}
        onClick={() => onFavoriteStock(stock.id)}
      >
        <Heart
          className={`size-5 stroke-[2] ${isFavorite ? "fill-red-500 text-red-500" : "text-zinc-950"}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

function AiNewsSection({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <section className="pt-4">
      <button type="button" className="w-full text-left" aria-expanded={isOpen} onClick={onToggle}>
        <Card
          className={`${isOpen ? "h-28" : "h-20"} rounded-lg border border-blue-100 bg-blue-50 py-2 shadow-sm shadow-zinc-200/80`}
        >
          <CardContent className="flex flex-col gap-2 px-3">
            <div className="flex items-start gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                <Star className="size-3 fill-white" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-semibold leading-5 text-indigo-500">{copy.aiNews}</h2>
            </div>
            {isOpen ? <p className="text-xs leading-5 text-zinc-600">{copy.aiNewsBody}</p> : null}
          </CardContent>
        </Card>
      </button>
    </section>
  );
}

function BottomNavigation({
  selectedTab,
  onSelectTab,
}: {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}) {
  return (
    <nav className="mt-auto grid h-[58px] grid-cols-5 items-end" aria-label="Bottom navigation">
      {navigationItems.map((navigationItem) => (
        <BottomNavigationItem
          key={navigationItem.label}
          isSelected={selectedTab === navigationItem.label}
          icon={navigationItem.icon}
          label={navigationItem.label}
          onSelectTab={onSelectTab}
        />
      ))}
    </nav>
  );
}

function BottomNavigationItem({
  icon: Icon,
  isSelected,
  label,
  onSelectTab,
}: NavigationItem & {
  isSelected: boolean;
  onSelectTab: (tab: string) => void;
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-2 text-[10px] font-semibold ${
        isSelected ? "text-zinc-950" : "text-zinc-600"
      }`}
      aria-pressed={isSelected}
      onClick={() => onSelectTab(label)}
    >
      <Icon className="size-6 stroke-[2] text-current" aria-hidden="true" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

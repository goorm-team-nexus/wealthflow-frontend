"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FavoriteStock = {
  id: number;
  logo: string;
  name: string;
  price: string;
  change: string;
  tone: "blue" | "red";
  points: string;
};

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
};

const favoriteStocks: FavoriteStock[] = [
  {
    id: 1,
    logo: "S",
    name: "삼성전자",
    price: "₩ 78,400",
    change: "▼ 0.84%",
    tone: "blue",
    points:
      "2,45 8,34 14,16 20,31 26,24 32,38 38,28 44,35 50,18 56,10 62,20 68,15 74,26 80,13 86,32 92,25 98,20 104,30 110,24 116,18 122,14",
  },
  {
    id: 2,
    logo: "H",
    name: "SK하이닉스",
    price: "₩ 231,500",
    change: "▲ 2.18%",
    tone: "red",
    points:
      "2,38 8,20 14,34 20,26 26,40 32,14 38,24 44,21 50,10 56,13 62,8 68,30 74,18 80,28 86,15 92,24 98,18 104,13 110,10 116,6 122,8",
  },
  {
    id: 3,
    logo: "N",
    name: "NAVER",
    price: "₩ 184,900",
    change: "▲ 0.76%",
    tone: "red",
    points:
      "2,36 8,31 14,35 20,27 26,30 32,20 38,24 44,16 50,21 56,14 62,19 68,12 74,17 80,11 86,15 92,9 98,14 104,10 110,8 116,7 122,5",
  },
  {
    id: 4,
    logo: "K",
    name: "카카오",
    price: "₩ 52,700",
    change: "▼ 1.11%",
    tone: "blue",
    points:
      "2,18 8,24 14,20 20,29 26,26 32,35 38,31 44,38 50,34 56,41 62,37 68,43 74,40 80,45 86,39 92,42 98,36 104,44 110,39 116,46 122,43",
  },
  {
    id: 5,
    logo: "H",
    name: "현대차",
    price: "₩ 248,000",
    change: "▲ 1.05%",
    tone: "red",
    points:
      "2,34 8,32 14,28 20,31 26,26 32,22 38,25 44,20 50,17 56,19 62,15 68,11 74,16 80,12 86,10 92,13 98,9 104,7 110,10 116,6 122,4",
  },
  {
    id: 6,
    logo: "L",
    name: "LG에너지솔루션",
    price: "₩ 371,500",
    change: "▼ 0.58%",
    tone: "blue",
    points:
      "2,12 8,18 14,15 20,23 26,20 32,28 38,24 44,32 50,29 56,35 62,31 68,39 74,36 80,41 86,38 92,43 98,40 104,45 110,42 116,46 122,44",
  },
  {
    id: 7,
    logo: "P",
    name: "POSCO홀딩스",
    price: "₩ 325,000",
    change: "▲ 0.63%",
    tone: "red",
    points:
      "2,40 8,35 14,38 20,29 26,31 32,27 38,21 44,24 50,18 56,20 62,15 68,17 74,11 80,13 86,9 92,12 98,8 104,10 110,6 116,8 122,5",
  },
  {
    id: 8,
    logo: "C",
    name: "셀트리온",
    price: "₩ 176,300",
    change: "▼ 0.36%",
    tone: "blue",
    points:
      "2,22 8,20 14,26 20,24 26,31 32,29 38,34 44,32 50,39 56,35 62,42 68,38 74,44 80,41 86,46 92,43 98,45 104,40 110,47 116,42 122,45",
  },
  {
    id: 9,
    logo: "K",
    name: "KB금융",
    price: "₩ 84,200",
    change: "▲ 1.34%",
    tone: "red",
    points:
      "2,33 8,30 14,28 20,24 26,26 32,21 38,19 44,16 50,18 56,13 62,15 68,10 74,12 80,8 86,11 92,7 98,9 104,6 110,8 116,5 122,4",
  },
  {
    id: 10,
    logo: "S",
    name: "신한지주",
    price: "₩ 57,900",
    change: "▼ 0.58%",
    tone: "blue",
    points:
      "2,14 8,19 14,17 20,24 26,22 32,30 38,27 44,34 50,31 56,37 62,35 68,40 74,38 80,43 86,41 92,45 98,42 104,46 110,44 116,47 122,45",
  },
  {
    id: 11,
    logo: "K",
    name: "크래프톤",
    price: "₩ 295,500",
    change: "▲ 0.41%",
    tone: "red",
    points:
      "2,42 8,36 14,39 20,34 26,30 32,33 38,28 44,24 50,27 56,21 62,18 68,22 74,16 80,19 86,13 92,15 98,10 104,12 110,8 116,9 122,6",
  },
  {
    id: 12,
    logo: "A",
    name: "한화오션",
    price: "₩ 63,100",
    change: "▼ 1.33%",
    tone: "blue",
    points:
      "2,20 8,25 14,21 20,30 26,26 32,33 38,29 44,36 50,32 56,39 62,35 68,41 74,37 80,44 86,40 92,46 98,42 104,47 110,43 116,45 122,48",
  },
];

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    () => new Set(favoriteStocks.slice(0, 6).map((stock) => stock.id)),
  );
  const visibleFavoriteStocks = favoriteStocks.filter((stock) => favoriteIds.has(stock.id));

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
        <h2 className="text-lg font-semibold">{copy.sectionTitle}</h2>
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
    <div className="grid py-3 grid-cols-[20px_minmax(0,1fr)_84px_60px_20px] items-center gap-3 px-4 border-b border-border/40 last:border-0 hover:bg-accent/40 transition-colors duration-200">
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs font-normal ${toneClass}`}
      >
        {stock.logo}
      </span>
      <span className="truncate text-sm font-medium text-foreground">{stock.name}</span>
      <strong className="text-right text-sm font-semibold tracking-tight text-foreground">
        {stock.price}
      </strong>
      <span className={`text-sm font-normal ${toneClass}`}>{stock.change}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copy.favorite}
        aria-pressed={isFavorite}
        onClick={() => onFavoriteToggle(stock.id)}
      >
        <Heart
          className={`size-5 stroke-[2] ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

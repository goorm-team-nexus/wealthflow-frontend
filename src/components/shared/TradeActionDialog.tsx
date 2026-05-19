"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getStockPrice } from "@/services/investment";

interface TradeActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StockItem {
  id: string;
  name: string;
  ticker: string;
  initial: string;
}

// 기본 표시용 종목 카탈로그 (전체 종목 리스트 API 추가 시 교체 예정)
const defaultStocks: StockItem[] = [
  { id: "samsung-electronics", name: "삼성전자", ticker: "005930", initial: "S" },
  { id: "sk-hynix", name: "SK하이닉스", ticker: "000660", initial: "S" },
  { id: "apple", name: "Apple", ticker: "AAPL", initial: "A" },
  { id: "tesla", name: "Tesla", ticker: "TSLA", initial: "T" },
];

export function TradeActionDialog({ isOpen, onClose }: TradeActionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<StockItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  // API 검색
  const searchByTicker = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchError(false);
    setSearchResult(null);
    try {
      const response = await getStockPrice(query.trim());
      if (response.success && response.data?.ticker) {
        const ticker = response.data.ticker;
        // 카탈로그에서 이름 매칭 시도
        const catalogMatch = defaultStocks.find(
          (s) => s.ticker.toLowerCase() === ticker.toLowerCase(),
        );
        setSearchResult({
          id: catalogMatch?.id ?? ticker.toLowerCase(),
          name: catalogMatch?.name ?? ticker,
          ticker: ticker,
          initial: catalogMatch?.initial ?? ticker[0],
        });
      } else {
        setSearchError(true);
      }
    } catch {
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 디바운스 API 호출
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      searchByTicker(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchByTicker]);

  // 검색어 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResult(null);
      setSearchError(false);
    }
  };

  // 다이얼로그 닫힘 + 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchQuery("");
      setSearchResult(null);
      setSearchError(false);
      onClose();
    }
  };

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-5 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold mb-4 text-left">빠른 종목 거래</DialogTitle>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="종목명 또는 티커를 입력해보세요"
              className="pl-9 bg-muted/50 border-none rounded-xl h-11"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {hasSearch ? (
            <>
              {/* 검색 중 */}
              {isSearching && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  종목을 검색하고 있습니다...
                </div>
              )}

              {/* 검색 결과 */}
              {searchResult && !isSearching && <StockRow stock={searchResult} onClose={onClose} />}

              {/* 검색 실패 */}
              {searchError && !isSearching && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  해당 티커의 종목을 찾을 수 없습니다.
                </div>
              )}
            </>
          ) : (
            /* 기본 종목 리스트 */
            defaultStocks.map((stock) => (
              <StockRow key={stock.id} stock={stock} onClose={onClose} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StockRow({ stock, onClose }: { stock: StockItem; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors group">
      <Link
        href={`/stock-detail/${stock.id}`}
        onClick={onClose}
        className="flex items-center gap-3 min-w-0 flex-1"
      >
        <Avatar className="w-10 h-10 shrink-0 border border-border bg-transparent">
          <AvatarFallback className="bg-transparent text-sm font-medium text-blue-500">
            {stock.initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm truncate">{stock.name}</span>
          <span className="text-xs text-muted-foreground">{stock.ticker}</span>
        </div>
      </Link>
      <div className="flex items-center gap-1.5">
        <Link
          href={`/stock-detail/${stock.id}/purchase`}
          onClick={onClose}
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
        >
          매수
        </Link>
        <Link
          href={`/stock-detail/${stock.id}/sell`}
          onClick={onClose}
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
        >
          매도
        </Link>
      </div>
    </div>
  );
}

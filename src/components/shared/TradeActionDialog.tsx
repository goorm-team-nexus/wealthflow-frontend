"use client";

import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStockSearch } from "@/hooks/useStockSearch";
import type { StockItem } from "@/lib/stock-catalog";

interface TradeActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TradeActionDialog({ isOpen, onClose }: TradeActionDialogProps) {
  const {
    searchQuery,
    handleSearchChange,
    reset,
    hasSearch,
    catalogMatches,
    apiResult,
    isSearchPending,
    searchError,
    defaultStocks,
  } = useStockSearch();

  // 다이얼로그 닫힘 + 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden flex flex-col h-[450px]">
        <DialogHeader className="px-5 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold mb-4 text-left">간편 종목 검색</DialogTitle>

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
              {/* 로컬 카탈로그 매치 결과 */}
              {catalogMatches.map((stock) => (
                <StockRow key={stock.id} stock={stock} onClose={onClose} />
              ))}

              {/* 카탈로그 매치 없을 때: API 검색 중 */}
              {catalogMatches.length === 0 && isSearchPending && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="p-3 bg-blue-50 rounded-2xl dark:bg-blue-950/20">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    종목을 빠르게 찾고 있습니다...
                  </p>
                </div>
              )}

              {/* 카탈로그 매치 없을 때: API 검색 결과 */}
              {catalogMatches.length === 0 && apiResult && (
                <StockRow stock={apiResult} onClose={onClose} />
              )}

              {/* 카탈로그·API 모두 실패 */}
              {catalogMatches.length === 0 && !isSearchPending && searchError && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="mb-4 p-3 bg-muted rounded-2xl">
                    <Search className="w-6 h-6 text-muted-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">
                    일치하는 종목을 찾지 못했어요
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                    종목명 또는 영어 티커(예: TSLA)가 정확한지 다시 한 번 확인해 보세요.
                  </p>
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
        href={`/stock-detail/${stock.ticker}`}
        onClick={onClose}
        className="flex items-center gap-3 min-w-0 flex-1"
      >
        <Avatar className="w-5 h-5 shrink-0 border border-border bg-transparent">
          <AvatarFallback className="bg-transparent text-[10px] font-normal text-blue-600 select-none">
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
          href={`/stock-detail/${stock.ticker}/purchase`}
          onClick={onClose}
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
        >
          매수
        </Link>
        <Link
          href={`/stock-detail/${stock.ticker}/sell`}
          onClick={onClose}
          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
        >
          매도
        </Link>
      </div>
    </div>
  );
}

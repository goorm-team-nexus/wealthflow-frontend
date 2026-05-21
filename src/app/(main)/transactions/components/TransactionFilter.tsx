"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAIN_STOCK_SEEDS } from "@/services/marketService";

import { StockSearchList } from "./StockSearchList";
import { DatePickerPopover } from "./DatePickerPopover";

interface TransactionFilterProps {
  selectedCodes: string[];
  onToggleStock: (code: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const ALL_STOCKS = MAIN_STOCK_SEEDS.map((stock) => ({
  name: stock.name,
  code: stock.ticker,
}));

export function TransactionFilter({
  selectedCodes,
  onToggleStock,
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onSearch,
  isLoading,
}: TransactionFilterProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isStockOpen, setIsStockOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Popover 닫힐 때 인풋 포커스를 명시적으로 해제하여 "포커스 잔존 + 입력 불가" 버그 방지
  const handleStockOpenChange = React.useCallback((open: boolean) => {
    setIsStockOpen(open);
    if (!open) {
      setSearchQuery("");
      // 다음 프레임에서 blur 처리 (Radix 내부 이벤트와 충돌 방지)
      requestAnimationFrame(() => {
        inputRef.current?.blur();
      });
    }
  }, []);

  // Format comma-separated display of selected stocks
  const selectedStocksDisplay = React.useMemo(() => {
    if (selectedCodes.length === 0) return "";
    return selectedCodes
      .map((code) => ALL_STOCKS.find((s) => s.code === code)?.name || code)
      .join(", ");
  }, [selectedCodes]);

  return (
    <Card className="bg-neutral-900 border-none rounded-3xl p-5 shadow-xl text-white">
      <CardContent className="p-0 flex flex-col gap-4">
        {/* 종목 검색 */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pl-1">
            종목 검색
          </span>
          <Popover modal={false} open={isStockOpen} onOpenChange={handleStockOpenChange}>
            <PopoverAnchor asChild>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="종목명 또는 코드 입력"
                  readOnly={!isStockOpen}
                  value={isStockOpen ? searchQuery : selectedStocksDisplay}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsStockOpen(true);
                    setSearchQuery("");
                  }}
                  className="!h-11 w-full pl-10 pr-4 text-sm rounded-xl border-none bg-white text-black placeholder:text-neutral-400 cursor-pointer focus-visible:ring-1 focus-visible:ring-neutral-400"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="w-[var(--radix-popover-trigger-width)] p-4 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50"
              align="start"
            >
              <StockSearchList
                selectedCodes={selectedCodes}
                onToggleStock={onToggleStock}
                searchQuery={searchQuery}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 거래 종류 */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pl-1">
            거래 종류
          </span>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="flex !h-11 w-full items-center justify-between rounded-xl border-none bg-white text-black text-sm font-medium pl-3.5 pr-4 hover:bg-neutral-50 focus-visible:ring-1 focus-visible:ring-neutral-400 data-[placeholder]:text-neutral-400">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-white border border-neutral-200 rounded-2xl shadow-xl text-neutral-900 p-1.5 w-[var(--radix-select-trigger-width)]"
            >
              <SelectItem
                value="ALL"
                className="pl-4 py-2 rounded-xl focus:bg-neutral-50 cursor-pointer text-sm font-medium"
              >
                전체
              </SelectItem>
              <SelectItem
                value="BUY"
                className="pl-4 py-2 rounded-xl focus:bg-neutral-50 cursor-pointer text-sm font-medium"
              >
                매수
              </SelectItem>
              <SelectItem
                value="SELL"
                className="pl-4 py-2 rounded-xl focus:bg-neutral-50 cursor-pointer text-sm font-medium"
              >
                매도
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 조회 기간 */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pl-1">
            조회 기간
          </span>
          <DatePickerPopover selectedRange={dateRange} onChange={onDateRangeChange} />
        </div>

        {/* 조회하기 버튼 */}
        <Button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full h-11 mt-2 bg-[#008DFF] hover:bg-[#008DFF]/90 active:bg-[#008DFF]/80 text-white font-bold rounded-xl border-none transition-colors shadow-md"
        >
          {isLoading ? "조회 중" : "조회하기"}
        </Button>
      </CardContent>
    </Card>
  );
}

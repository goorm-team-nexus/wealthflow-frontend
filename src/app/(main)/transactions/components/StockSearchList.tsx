"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAIN_STOCK_SEEDS } from "@/services/marketService";

interface Stock {
  name: string;
  code: string;
}

const ALL_STOCKS: Stock[] = MAIN_STOCK_SEEDS.map((stock) => ({
  name: stock.name,
  code: stock.ticker,
}));

interface StockSearchListProps {
  selectedCodes: string[];
  onToggleStock: (code: string) => void;
  searchQuery: string;
}

export function StockSearchList({
  selectedCodes,
  onToggleStock,
  searchQuery,
}: StockSearchListProps) {
  const filteredStocks = ALL_STOCKS.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.code.includes(searchQuery),
  );

  return (
    <div className="flex flex-col gap-4 text-neutral-900">
      {filteredStocks.length === 0 ? (
        <div className="py-6 text-center text-sm text-neutral-400">검색 결과가 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
          {/* 종목명 Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-neutral-400">종목명</span>
            <div className="flex flex-col gap-1">
              {filteredStocks.map((stock) => {
                const isSelected = selectedCodes.includes(stock.code);
                return (
                  <button
                    key={`name-${stock.code}`}
                    type="button"
                    onClick={() => onToggleStock(stock.code)}
                    className="flex items-center gap-3 w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                  >
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 bg-white",
                      )}
                    >
                      {isSelected ? (
                        <Check className="size-3" />
                      ) : (
                        <div className="size-1.5 rounded-full bg-neutral-400" />
                      )}
                    </div>
                    <span>{stock.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 코드 입력 Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-neutral-400">코드 입력</span>
            <div className="flex flex-col gap-1">
              {filteredStocks.map((stock) => {
                const isSelected = selectedCodes.includes(stock.code);
                return (
                  <button
                    key={`code-${stock.code}`}
                    type="button"
                    onClick={() => onToggleStock(stock.code)}
                    className="flex items-center gap-3 w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                  >
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 bg-white",
                      )}
                    >
                      {isSelected ? (
                        <Check className="size-3" />
                      ) : (
                        <div className="size-1.5 rounded-full bg-neutral-400" />
                      )}
                    </div>
                    <span>{stock.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

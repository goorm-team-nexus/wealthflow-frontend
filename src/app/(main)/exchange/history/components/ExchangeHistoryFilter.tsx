"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DatePickerPopover } from "./DatePickerPopover";

export type ExchangeDirectionFilter = "ALL" | "KRW_TO_USD" | "USD_TO_KRW";

interface ExchangeHistoryFilterProps {
  selectedDirection: ExchangeDirectionFilter;
  onDirectionChange: (direction: ExchangeDirectionFilter) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function ExchangeHistoryFilter({
  selectedDirection,
  onDirectionChange,
  dateRange,
  onDateRangeChange,
  onSearch,
  isLoading,
}: ExchangeHistoryFilterProps) {
  const handleDirectionChange = React.useCallback(
    (value: string) => {
      onDirectionChange(toDirectionFilter(value));
    },
    [onDirectionChange],
  );

  return (
    <Card className="bg-neutral-900 border-none rounded-3xl p-5 shadow-xl text-white">
      <CardContent className="p-0 flex flex-col gap-4">
        {/* 환전 방향 */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pl-1">
            환전 방향
          </span>
          <Select value={selectedDirection} onValueChange={handleDirectionChange}>
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
                value="KRW_TO_USD"
                className="pl-4 py-2 rounded-xl focus:bg-neutral-50 cursor-pointer text-sm font-medium"
              >
                KRW → USD
              </SelectItem>
              <SelectItem
                value="USD_TO_KRW"
                className="pl-4 py-2 rounded-xl focus:bg-neutral-50 cursor-pointer text-sm font-medium"
              >
                USD → KRW
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

function toDirectionFilter(value: string): ExchangeDirectionFilter {
  if (value === "KRW_TO_USD" || value === "USD_TO_KRW") return value;
  return "ALL";
}

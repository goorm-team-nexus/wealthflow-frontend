"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { getExchangeHistory, type ExchangeHistoryItem } from "@/services/investment";

import { ExchangeHistoryFilter, type ExchangeDirectionFilter } from "./ExchangeHistoryFilter";
import { ExchangeHistoryTable } from "./ExchangeHistoryTable";

interface ExchangeFilters {
  direction: ExchangeDirectionFilter;
  dateRange: DateRange | undefined;
}

export function ExchangeHistoryContent() {
  const [selectedDirection, setSelectedDirection] = React.useState<ExchangeDirectionFilter>("ALL");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [items, setItems] = React.useState<ExchangeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadHistory = React.useCallback(async (filters: ExchangeFilters) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const normalizedRange = normalizeDateRange(filters.dateRange);
      const { fromCurrency, toCurrency } = directionToParams(filters.direction);

      const history = await getExchangeHistory({
        fromCurrency,
        toCurrency,
        startDate: normalizedRange?.from,
        endDate: normalizedRange?.to,
      });

      setItems(history);
    } catch (error) {
      setItems([]);
      setErrorMessage(toErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void Promise.resolve().then(() => {
      void loadHistory({ direction: "ALL", dateRange: undefined });
    });
  }, [loadHistory]);

  const handleDirectionChange = React.useCallback((direction: ExchangeDirectionFilter) => {
    setSelectedDirection(direction);
  }, []);

  const handleDateRangeChange = React.useCallback((range: DateRange | undefined) => {
    setDateRange(normalizeDateRange(range));
  }, []);

  const handleSearch = React.useCallback(() => {
    void loadHistory({ direction: selectedDirection, dateRange });
  }, [loadHistory, selectedDirection, dateRange]);

  const handleRetry = React.useCallback(() => {
    void loadHistory({ direction: selectedDirection, dateRange });
  }, [loadHistory, selectedDirection, dateRange]);

  return (
    <div className="flex flex-col gap-6 text-foreground">
      <ExchangeHistoryFilter
        selectedDirection={selectedDirection}
        onDirectionChange={handleDirectionChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-3">
        <span className="px-1 text-lg font-bold text-neutral-900">상세 내역</span>
        {errorMessage ? (
          <ExchangeHistoryErrorState message={errorMessage} onRetry={handleRetry} />
        ) : (
          <ExchangeHistoryTable items={items} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

function ExchangeHistoryErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-neutral-800">
          환전 내역을 불러오지 못했습니다
        </span>
        <span className="text-xs text-neutral-400">{message}</span>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        다시 조회
      </Button>
    </div>
  );
}

function directionToParams(direction: ExchangeDirectionFilter): {
  fromCurrency?: "KRW" | "USD";
  toCurrency?: "KRW" | "USD";
} {
  if (direction === "KRW_TO_USD") return { fromCurrency: "KRW", toCurrency: "USD" };
  if (direction === "USD_TO_KRW") return { fromCurrency: "USD", toCurrency: "KRW" };
  return {};
}

function normalizeDateRange(range: DateRange | undefined): DateRange | undefined {
  if (!range?.from || !range.to) {
    return range;
  }

  return range.from <= range.to ? range : { from: range.to, to: range.from };
}

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    return "로그인이 필요합니다. 다시 로그인한 뒤 조회해 주세요.";
  }

  return "잠시 후 다시 시도해 주세요.";
}

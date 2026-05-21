"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import {
  getTransactions,
  type TradeType,
  type TransactionHistoryItem,
} from "@/services/investment";

import { TransactionFilter } from "./TransactionFilter";
import { TransactionTable } from "./TransactionTable";

type TransactionTypeFilter = TradeType | "ALL";

interface TransactionFilters {
  selectedCodes: string[];
  dateRange: DateRange | undefined;
}

export function TransactionContent() {
  const [selectedCodes, setSelectedCodes] = React.useState<string[]>([]);
  const [selectedType, setSelectedType] = React.useState<TransactionTypeFilter>("ALL");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [filteredItems, setFilteredItems] = React.useState<TransactionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loadTransactions = React.useCallback(
    async (tradeType: TransactionTypeFilter, filters: TransactionFilters) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const transactions = await getTransactions({
          tradeType: tradeType === "ALL" ? undefined : tradeType,
        });

        setFilteredItems(filterTransactions(transactions, filters));
      } catch (error) {
        setFilteredItems([]);
        setErrorMessage(toErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    let isActive = true;

    async function loadInitialTransactions() {
      try {
        const transactions = await getTransactions();

        if (!isActive) {
          return;
        }

        setFilteredItems(transactions);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setFilteredItems([]);
        setErrorMessage(toErrorMessage(error));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialTransactions();

    return () => {
      isActive = false;
    };
  }, []);

  const handleToggleStock = React.useCallback((code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const handleTypeChange = React.useCallback((type: string) => {
    setSelectedType(toTransactionTypeFilter(type));
  }, []);

  const handleDateRangeChange = React.useCallback((range: DateRange | undefined) => {
    setDateRange(normalizeDateRange(range));
  }, []);

  const handleSearch = React.useCallback(() => {
    void loadTransactions(selectedType, {
      selectedCodes,
      dateRange,
    });
  }, [dateRange, loadTransactions, selectedCodes, selectedType]);

  const handleRetry = React.useCallback(() => {
    void loadTransactions(selectedType, {
      selectedCodes,
      dateRange,
    });
  }, [dateRange, loadTransactions, selectedCodes, selectedType]);

  return (
    <div className="flex flex-col gap-6 text-foreground">
      <TransactionFilter
        selectedCodes={selectedCodes}
        onToggleStock={handleToggleStock}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-3">
        <span className="px-1 text-lg font-bold text-neutral-900">상세 내역</span>
        {errorMessage ? (
          <TransactionErrorState message={errorMessage} onRetry={handleRetry} />
        ) : (
          <TransactionTable items={filteredItems} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

function TransactionErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-neutral-800">
          거래 내역을 불러오지 못했습니다
        </span>
        <span className="text-xs text-neutral-400">{message}</span>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        다시 조회
      </Button>
    </div>
  );
}

function filterTransactions(
  transactions: TransactionHistoryItem[],
  { selectedCodes, dateRange }: TransactionFilters,
) {
  const normalizedRange = normalizeDateRange(dateRange);

  return transactions.filter((item) => {
    if (selectedCodes.length > 0 && !selectedCodes.includes(item.stockCode)) {
      return false;
    }

    if (!normalizedRange?.from) {
      return true;
    }

    const itemDate = startOfDay(item.date);
    const startDate = startOfDay(normalizedRange.from);

    if (itemDate < startDate) {
      return false;
    }

    if (!normalizedRange.to) {
      return true;
    }

    const endDate = endOfDay(normalizedRange.to);
    return item.date <= endDate;
  });
}

function normalizeDateRange(range: DateRange | undefined): DateRange | undefined {
  if (!range?.from || !range.to) {
    return range;
  }

  return range.from <= range.to ? range : { from: range.to, to: range.from };
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function endOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(23, 59, 59, 999);
  return normalizedDate;
}

function toTransactionTypeFilter(type: string): TransactionTypeFilter {
  return type === "BUY" || type === "SELL" ? type : "ALL";
}

function toErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    return "로그인이 필요합니다. 다시 로그인한 뒤 조회해 주세요.";
  }

  return "잠시 후 다시 시도해 주세요.";
}

"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import { TransactionFilter } from "./TransactionFilter";
import { TransactionTable, TransactionItem } from "./TransactionTable";

// Mock data matching the mockup layout and dates
const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "982341",
    stockName: "삼성전자",
    stockCode: "005930",
    type: "BUY",
    price: 72400,
    date: new Date(2025, 5, 20), // June 20, 2025
  },
  {
    id: "982339",
    stockName: "SK하이닉스",
    stockCode: "000660",
    type: "SELL",
    price: 128500,
    date: new Date(2025, 5, 15), // June 15, 2025
  },
  {
    id: "982335",
    stockName: "NAVER",
    stockCode: "035420",
    type: "BUY",
    price: 189200,
    date: new Date(2025, 5, 5), // June 5, 2025
  },
  {
    id: "982330",
    stockName: "삼성전자",
    stockCode: "005930",
    type: "SELL",
    price: 73000,
    date: new Date(2025, 5, 2), // June 2, 2025
  },
  {
    id: "982320",
    stockName: "카카오",
    stockCode: "035720",
    type: "BUY",
    price: 48000,
    date: new Date(2025, 4, 28), // May 28, 2025 (Out of default date range)
  },
];

export function TransactionContent() {
  // State for search filters
  const [selectedCodes, setSelectedCodes] = React.useState<string[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>("ALL");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 1), // June 1, 2025
    to: new Date(2025, 5, 25), // June 25, 2025
  });

  // Filtered items state initialized with the initial filtered mock transactions
  const [filteredItems, setFilteredItems] = React.useState<TransactionItem[]>(() => {
    const defaultFrom = new Date(2025, 5, 1);
    defaultFrom.setHours(0, 0, 0, 0);
    const defaultTo = new Date(2025, 5, 25);
    defaultTo.setHours(23, 59, 59, 999);

    return MOCK_TRANSACTIONS.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= defaultFrom && itemDate <= defaultTo;
    });
  });

  // Toggle selected stock code
  const handleToggleStock = React.useCallback((code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  // Filter evaluation logic
  const performSearch = React.useCallback(() => {
    const results = MOCK_TRANSACTIONS.filter((item) => {
      // 1. Filter by Stock Code (if any are selected)
      if (selectedCodes.length > 0 && !selectedCodes.includes(item.stockCode)) {
        return false;
      }

      // 2. Filter by Transaction Type
      if (selectedType !== "ALL" && item.type !== selectedType) {
        return false;
      }

      // 3. Filter by Date Range
      if (dateRange?.from) {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);

        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);

        if (itemDate < startDate) {
          return false;
        }

        if (dateRange.to) {
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (itemDate > endDate) {
            return false;
          }
        }
      }

      return true;
    });

    setFilteredItems(results);
  }, [selectedCodes, selectedType, dateRange]);

  return (
    <div className="flex flex-col gap-6 text-foreground">
      {/* Search and Filters box */}
      <TransactionFilter
        selectedCodes={selectedCodes}
        onToggleStock={handleToggleStock}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSearch={performSearch}
      />

      {/* Transaction Records List */}
      <div className="flex flex-col gap-3">
        <span className="text-lg font-bold text-neutral-900 px-1">상세 내역</span>
        <TransactionTable items={filteredItems} />
      </div>
    </div>
  );
}

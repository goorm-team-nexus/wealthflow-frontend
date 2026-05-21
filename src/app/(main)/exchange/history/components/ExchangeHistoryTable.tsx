"use client";

import { Inbox } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExchangeHistoryItem } from "@/services/investment";

interface ExchangeHistoryTableProps {
  items: ExchangeHistoryItem[];
  isLoading: boolean;
}

export function ExchangeHistoryTable({ items, isLoading }: ExchangeHistoryTableProps) {
  if (isLoading) {
    return <ExchangeHistoryLoadingState />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
          <Inbox className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-neutral-800">조회된 내역이 없습니다</span>
          <span className="text-xs text-neutral-400">
            필터 조건을 다르게 설정하여 다시 조회해 보세요.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <div className="flex items-center px-4 py-3 bg-neutral-50 text-xs font-semibold text-neutral-400 border-b border-neutral-100">
        <div className="w-1/4 text-left">환전일시</div>
        <div className="w-1/4 text-right">보낸 금액</div>
        <div className="w-1/4 text-right">받은 금액</div>
        <div className="w-1/4 text-right">환율</div>
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center px-4 py-3.5 hover:bg-neutral-50/50 transition-colors">
              <div className="flex w-1/4 flex-col gap-0.5 text-left">
                <span className="text-[12px] font-semibold text-neutral-700">
                  {formatDateTime(item.date)}
                </span>
                <span className="text-[10px] font-normal text-neutral-400 select-all">
                  #{item.id}
                </span>
              </div>

              <div className="w-1/4 text-right flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-neutral-900 select-all">
                  {formatAmount(item.fromAmount, item.fromCurrency)}
                </span>
                <span className="text-[10px] font-normal text-neutral-400">
                  {item.fromCurrency}
                </span>
              </div>

              <div className="w-1/4 text-right flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-emerald-600 select-all">
                  {formatAmount(item.toAmount, item.toCurrency)}
                </span>
                <span className="text-[10px] font-normal text-neutral-400">{item.toCurrency}</span>
              </div>

              <div className="w-1/4 text-right">
                <span className="text-[11px] font-normal text-neutral-500">
                  {formatExchangeRate(item.exchangeRate, item.fromCurrency)}
                </span>
              </div>
            </div>
            {index < items.length - 1 && <Separator className="bg-neutral-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExchangeHistoryLoadingState() {
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <div className="flex items-center px-4 py-3 bg-neutral-50 text-xs font-semibold text-neutral-400 border-b border-neutral-100">
        <div className="w-1/4 text-left">환전일시</div>
        <div className="w-1/4 text-right">보낸 금액</div>
        <div className="w-1/4 text-right">받은 금액</div>
        <div className="w-1/4 text-right">환율</div>
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex flex-col">
          <div className="flex items-center px-4 py-4">
            <div className="w-1/4">
              <Skeleton className="h-4 w-16 bg-neutral-100" />
            </div>
            <div className="w-1/4 flex justify-end">
              <Skeleton className="h-4 w-20 bg-neutral-100" />
            </div>
            <div className="w-1/4 flex justify-end">
              <Skeleton className="h-4 w-20 bg-neutral-100" />
            </div>
            <div className="w-1/4 flex justify-end">
              <Skeleton className="h-4 w-16 bg-neutral-100" />
            </div>
          </div>
          {index < 3 && <Separator className="bg-neutral-100" />}
        </div>
      ))}
    </div>
  );
}

function formatDateTime(date: Date) {
  if (date.getTime() === 0) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(value: number, currency: "KRW" | "USD") {
  if (currency === "USD") {
    return `$${value.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatExchangeRate(rate: number, fromCurrency: "KRW" | "USD") {
  if (fromCurrency === "KRW") {
    return `1 USD = ₩${Math.round(rate).toLocaleString("ko-KR")}`;
  }
  return `1 USD = ₩${Math.round(rate).toLocaleString("ko-KR")}`;
}

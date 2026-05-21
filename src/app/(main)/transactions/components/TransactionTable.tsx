"use client";

import { Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TransactionHistoryItem } from "@/services/investment";

interface TransactionTableProps {
  items: TransactionHistoryItem[];
  isLoading: boolean;
}

export function TransactionTable({ items, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return <TransactionLoadingState />;
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
        <div className="w-1/4 text-left">거래일시</div>
        <div className="w-1/3 text-left pl-2">종목명/코드</div>
        <div className="w-1/5 text-center">유형</div>
        <div className="w-1/4 text-right">체결단가</div>
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

              <div className="w-1/3 text-left pl-2 flex flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-neutral-800 leading-tight">
                  {item.stockName}
                </span>
                <span className="text-[11px] font-normal text-neutral-400 tracking-wide leading-none">
                  {item.stockCode}
                </span>
              </div>

              <div className="w-1/5 flex justify-center">
                {item.type === "BUY" ? (
                  <Badge className="bg-red-500 hover:bg-red-500 text-white font-semibold px-2 py-0.5 rounded-md border-none select-none text-[10px] tracking-wide">
                    매수
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500 hover:bg-blue-500 text-white font-semibold px-2 py-0.5 rounded-md border-none select-none text-[10px] tracking-wide">
                    매도
                  </Badge>
                )}
              </div>

              <div className="flex w-1/4 flex-col gap-0.5 text-right">
                <span className="text-[14px] font-semibold text-neutral-900 select-all">
                  {formatCurrency(item.price, item.currency)}
                </span>
                <span className="text-[10px] font-normal text-neutral-400">
                  {formatQuantity(item.quantity)}주
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

function TransactionLoadingState() {
  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <div className="flex items-center px-4 py-3 bg-neutral-50 text-xs font-semibold text-neutral-400 border-b border-neutral-100">
        <div className="w-1/4 text-left">거래일시</div>
        <div className="w-1/3 text-left pl-2">종목명/코드</div>
        <div className="w-1/5 text-center">유형</div>
        <div className="w-1/4 text-right">체결단가</div>
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex flex-col">
          <div className="flex items-center px-4 py-4">
            <div className="w-1/4">
              <div className="h-4 w-16 rounded-md bg-neutral-100" />
            </div>
            <div className="w-1/3 pl-2">
              <div className="h-4 w-20 rounded-md bg-neutral-100" />
            </div>
            <div className="flex w-1/5 justify-center">
              <div className="h-5 w-10 rounded-md bg-neutral-100" />
            </div>
            <div className="flex w-1/4 justify-end">
              <div className="h-4 w-16 rounded-md bg-neutral-100" />
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

function formatCurrency(value: number, currency: TransactionHistoryItem["currency"]) {
  if (currency === "USD") {
    return `$${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}`;
  }

  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatQuantity(value: number) {
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 6 });
}

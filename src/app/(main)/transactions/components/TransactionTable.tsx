"use client";

import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface TransactionItem {
  id: string;
  stockName: string;
  stockCode: string;
  type: "BUY" | "SELL";
  price: number;
  date: Date;
}

interface TransactionTableProps {
  items: TransactionItem[];
}

export function TransactionTable({ items }: TransactionTableProps) {
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
      {/* Table Headers */}
      <div className="flex items-center px-4 py-3 bg-neutral-50 text-xs font-semibold text-neutral-400 border-b border-neutral-100">
        <div className="w-1/6 text-left">거래번호</div>
        <div className="w-2/5 text-left pl-2">종목명/코드</div>
        <div className="w-1/5 text-center">유형</div>
        <div className="w-1/4 text-right">체결단가</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center px-4 py-3.5 hover:bg-neutral-50/50 transition-colors">
              {/* 거래번호 */}
              <div className="w-1/6 text-left text-[13px] text-neutral-400 font-medium select-all">
                {item.id}
              </div>

              {/* 종목명/코드 */}
              <div className="w-2/5 text-left pl-2 flex flex-col gap-0.5">
                <span className="text-[14px] font-semibold text-neutral-800 leading-tight">
                  {item.stockName}
                </span>
                <span className="text-[11px] font-normal text-neutral-400 tracking-wide leading-none">
                  {item.stockCode}
                </span>
              </div>

              {/* 유형 배지 */}
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

              {/* 체결단가 */}
              <div className="w-1/4 text-right text-[14px] font-semibold text-neutral-900 select-all">
                ₩{item.price.toLocaleString()}
              </div>
            </div>
            {index < items.length - 1 && <Separator className="bg-neutral-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}

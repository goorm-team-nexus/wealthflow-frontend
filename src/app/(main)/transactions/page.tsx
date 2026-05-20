import { Metadata } from "next";
import { TransactionContent } from "./components/TransactionContent";

export const metadata: Metadata = {
  title: "거래내역 | WealthFlow",
  description: "WealthFlow 거래 내역 조회 및 필터링 페이지입니다.",
};

export default function TransactionsPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 select-none">거래내역</h1>

      {/* Interactive content */}
      <TransactionContent />
    </div>
  );
}

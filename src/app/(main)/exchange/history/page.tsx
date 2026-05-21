import { Metadata } from "next";
import { ExchangeHistoryContent } from "./components/ExchangeHistoryContent";

export const metadata: Metadata = {
  title: "환전 내역 | WealthFlow",
  description: "WealthFlow 환전 내역 조회 및 필터링 페이지입니다.",
};

export default function ExchangeHistoryPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 select-none">환전 내역</h1>
      <ExchangeHistoryContent />
    </div>
  );
}

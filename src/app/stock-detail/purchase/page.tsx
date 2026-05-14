import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StockPurchasePage() {
  return (
    <main className="min-h-screen bg-zinc-100 font-sans text-zinc-950">
      <div className="mx-auto flex min-h-screen w-[390px] max-w-full bg-white">
        <section className="flex min-h-screen w-full flex-col gap-5 bg-white px-8 pt-6 [font-family:var(--font-noto-sans-kr),var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]">
          <header className="grid h-8 grid-cols-[32px_minmax(0,1fr)_32px] items-center">
            <Button asChild variant="ghost" size="icon" className="size-8">
              <Link href="/stock-detail" aria-label="종목 상세로 돌아가기">
                <ArrowLeft className="size-5 stroke-[2.2]" aria-hidden="true" />
              </Link>
            </Button>
            <h1 className="truncate text-center text-sm font-semibold">삼성전자 구매</h1>
          </header>

          <section className="flex flex-col gap-1 px-2 pt-6">
            <span className="text-xs font-semibold text-zinc-500">005930</span>
            <h2 className="text-3xl font-bold tracking-normal">삼성전자</h2>
            <p className="text-sm font-medium text-zinc-600">219,500원</p>
          </section>

          <Card className="rounded-md py-4">
            <CardContent className="flex flex-col gap-4 px-4">
              <div className="flex h-12 items-center justify-between border-b border-zinc-100">
                <span className="text-xs font-medium text-zinc-600">주문 유형</span>
                <strong className="text-sm font-bold text-zinc-950">매수</strong>
              </div>
              <div className="flex h-12 items-center justify-between border-b border-zinc-100">
                <span className="text-xs font-medium text-zinc-600">현재가</span>
                <strong className="text-sm font-bold text-zinc-950">219,500원</strong>
              </div>
              <div className="flex h-12 items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">주문 상태</span>
                <strong className="text-sm font-bold text-red-500">입력 대기</strong>
              </div>
            </CardContent>
          </Card>

          <Button className="mt-auto mb-8 h-11 w-full bg-red-400 text-base font-semibold text-white hover:bg-red-500">
            주문 준비
          </Button>
        </section>
      </div>
    </main>
  );
}

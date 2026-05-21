"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// 고정 환율 및 업데이트 시각 (스크린샷 기준)
const EXCHANGE_RATE = 1580.5;
const UPDATE_TIME = "26.04.30 12:12";

export default function ExchangePage() {
  // 통화 상태 ("KRW" | "USD")
  const [fromCurrency, setFromCurrency] = useState<"KRW" | "USD">("KRW");
  const [toCurrency, setToCurrency] = useState<"KRW" | "USD">("USD");

  // 금액 입력 상태
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");

  // 사용자 잔액 Mock (추후 API 연동)
  const [balances, setBalances] = useState({
    KRW: 1000000, // 100만 원
    USD: 1000, // 1,000 달러
  });

  // 환전 모달 오픈 상태
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [exchangeDetails, setExchangeDetails] = useState({
    from: "",
    to: "",
    rate: EXCHANGE_RATE,
  });

  // 보내는 통화 입력 시 받는 통화 자동 계산
  const handleFromAmountChange = (value: string) => {
    // 숫자와 소수점만 입력 허용
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setFromAmount(cleanValue);

    if (!cleanValue || isNaN(Number(cleanValue))) {
      setToAmount("");
      return;
    }

    const amount = Number(cleanValue);
    if (fromCurrency === "KRW") {
      // KRW -> USD (나누기)
      const calculated = amount / EXCHANGE_RATE;
      // 소수점 2자리까지 표시
      setToAmount(calculated.toFixed(2));
    } else {
      // USD -> KRW (곱하기)
      const calculated = amount * EXCHANGE_RATE;
      // 소수점 이하 버림 혹은 정수 처리
      setToAmount(Math.floor(calculated).toString());
    }
  };

  // 받는 통화 입력 시 보내는 통화 자동 계산
  const handleToAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setToAmount(cleanValue);

    if (!cleanValue || isNaN(Number(cleanValue))) {
      setFromAmount("");
      return;
    }

    const amount = Number(cleanValue);
    if (fromCurrency === "KRW") {
      // USD -> KRW 역산 (곱하기)
      const calculated = amount * EXCHANGE_RATE;
      setFromAmount(Math.floor(calculated).toString());
    } else {
      // KRW -> USD 역산 (나누기)
      const calculated = amount / EXCHANGE_RATE;
      setFromAmount(calculated.toFixed(2));
    }
  };

  // 보내는 통화 / 받는 통화 스왑(⇅)
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);

    // 금액도 함께 스왑하여 재계산
    const currentFromAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(currentFromAmount);
  };

  // 환전 실행 핸들러 (Mock)
  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(fromAmount);

    if (!fromAmount || amountNum <= 0) {
      alert("환전할 금액을 입력해주세요.");
      return;
    }

    // 잔액 부족 검증
    const currentBalance = balances[fromCurrency];
    if (amountNum > currentBalance) {
      alert(`${fromCurrency} 잔액이 부족합니다.`);
      return;
    }

    // 환전 정보 저장 및 모달 오픈
    setExchangeDetails({
      from: `${Number(fromAmount).toLocaleString()} ${fromCurrency}`,
      to: `${Number(toAmount).toLocaleString()} ${toCurrency}`,
      rate: EXCHANGE_RATE,
    });

    // 임시 잔액 차감 및 증가 반영
    setBalances((prev) => {
      const nextFromBalance = prev[fromCurrency] - amountNum;
      const nextToBalance = prev[toCurrency] + Number(toAmount);
      return {
        ...prev,
        [fromCurrency]: nextFromBalance,
        [toCurrency]: nextToBalance,
      };
    });

    setIsSuccessModalOpen(true);

    // 입력 필드 초기화
    setFromAmount("");
    setToAmount("");
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* 1. 타이틀 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">환전</h1>
        <Link
          href="/exchange/history"
          className="text-sm font-medium text-muted-foreground underline underline-offset-2"
        >
          내역
        </Link>
      </div>

      {/* 2. 현재 환율 카드 */}
      <Card className="flex flex-col gap-4 border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold text-foreground">현재 환율</span>
            <span className="text-sm font-medium text-muted-foreground">KRW / USD</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">업데이트:{UPDATE_TIME}</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-extrabold tracking-tight">
            {EXCHANGE_RATE.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-base font-semibold text-foreground">원</span>
        </div>
      </Card>

      {/* 3. 보내는 / 받는 통화 카드 */}
      <Card className="relative flex flex-col gap-6 border border-border bg-card p-6 shadow-sm">
        {/* 보내는 통화 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">보내는 통화</span>
            <span className="text-xs text-muted-foreground">
              잔액: {balances[fromCurrency].toLocaleString()}
              {fromCurrency === "KRW" ? "원" : "달러"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-secondary-foreground shadow-sm">
              {fromCurrency}
            </div>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="h-10 text-right text-base font-medium shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* 구분선 및 통화 스왑 버튼 */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwapCurrencies}
            className="relative z-10 size-9 rounded-xl border border-border bg-background shadow-sm hover:bg-secondary focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="통화 전환"
          >
            <ArrowUpDown className="size-4 text-muted-foreground" />
          </Button>
        </div>

        {/* 받는 통화 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">받는 통화</span>
            <span className="text-xs text-muted-foreground">
              잔액: {balances[toCurrency].toLocaleString()}
              {toCurrency === "KRW" ? "원" : "달러"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-secondary-foreground shadow-sm">
              {toCurrency}
            </div>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              className="h-10 text-right text-base font-medium shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      </Card>

      {/* 4. 환전하기 버튼 */}
      <Button
        type="button"
        onClick={handleExchangeSubmit}
        disabled={!fromAmount || Number(fromAmount) <= 0}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
      >
        <CheckCircle className="size-4" />
        <span>환전하기</span>
      </Button>

      {/* 환전 성공 결과 모달 */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-lg font-bold text-foreground">
                환전 신청 완료
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                환전 신청이 정상적으로 완료되었습니다.
              </DialogDescription>
            </div>

            <div className="w-full border-y border-border py-4 my-2 flex flex-col gap-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">신청 환율</span>
                <span className="font-semibold text-foreground">
                  1 USD = {exchangeDetails.rate.toLocaleString()} KRW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">보낸 금액</span>
                <span className="font-semibold text-foreground">{exchangeDetails.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">받은 금액</span>
                <span className="font-semibold text-foreground text-emerald-600">
                  {exchangeDetails.to}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full h-10 rounded-xl"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

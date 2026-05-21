"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpDown, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api-client";
import { exchangeCurrency } from "@/services/investment";
import { getExchangeRate, type ExchangeRate } from "@/services/marketService";
import { getPortfolio } from "@/services/portfolio";

type Currency = "KRW" | "USD";
type BalanceMap = Record<Currency, number>;
type EditedAmount = "from" | "to";

type ExchangeDetails = {
  from: string;
  rate: number;
  to: string;
};

export function ExchangeContent() {
  const [fromCurrency, setFromCurrency] = React.useState<Currency>("KRW");
  const [toCurrency, setToCurrency] = React.useState<Currency>("USD");
  const [fromAmount, setFromAmount] = React.useState("");
  const [toAmount, setToAmount] = React.useState("");
  const [editedAmount, setEditedAmount] = React.useState<EditedAmount>("from");

  const [exchangeRate, setExchangeRate] = React.useState<ExchangeRate | null>(null);
  const [isRateLoading, setIsRateLoading] = React.useState(true);
  const [rateErrorMessage, setRateErrorMessage] = React.useState<string | null>(null);

  const [balances, setBalances] = React.useState<BalanceMap | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = React.useState(true);
  const [balanceErrorMessage, setBalanceErrorMessage] = React.useState<string | null>(null);

  const [formMessage, setFormMessage] = React.useState<string | null>(null);
  const [isExchangePending, setIsExchangePending] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [exchangeDetails, setExchangeDetails] = React.useState<ExchangeDetails>({
    from: "",
    rate: 0,
    to: "",
  });
  const formStateRef = React.useRef({
    editedAmount,
    fromAmount,
    fromCurrency,
    toAmount,
  });

  React.useEffect(() => {
    formStateRef.current = {
      editedAmount,
      fromAmount,
      fromCurrency,
      toAmount,
    };
  }, [editedAmount, fromAmount, fromCurrency, toAmount]);

  const loadExchangeRate = React.useCallback(async () => {
    setIsRateLoading(true);
    setRateErrorMessage(null);

    try {
      const nextExchangeRate = await getExchangeRate("USD");
      const currentFormState = formStateRef.current;

      setExchangeRate(nextExchangeRate);

      if (currentFormState.editedAmount === "from") {
        setToAmount(
          calculateToAmount(
            currentFormState.fromAmount,
            currentFormState.fromCurrency,
            nextExchangeRate.rate,
          ),
        );
      } else {
        setFromAmount(
          calculateFromAmount(
            currentFormState.toAmount,
            currentFormState.fromCurrency,
            nextExchangeRate.rate,
          ),
        );
      }
    } catch (error) {
      setExchangeRate(null);
      setRateErrorMessage(toExchangeRateErrorMessage(error));
    } finally {
      setIsRateLoading(false);
    }
  }, []);

  const loadBalances = React.useCallback(async () => {
    setIsBalanceLoading(true);
    setBalanceErrorMessage(null);

    try {
      const response = await getPortfolio();

      if (!response.data) {
        throw new Error("Invalid portfolio response");
      }

      setBalances({
        KRW: response.data.cashKrw ?? 0,
        USD: response.data.cashUsd ?? 0,
      });
    } catch (error) {
      setBalances(null);
      setBalanceErrorMessage(toBalanceErrorMessage(error));
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void Promise.resolve().then(() => {
      void loadExchangeRate();
      void loadBalances();
    });
  }, [loadBalances, loadExchangeRate]);

  const currentBalance = balances?.[fromCurrency] ?? null;
  const amountNumber = Number(fromAmount);
  const hasValidAmount = fromAmount !== "" && Number.isFinite(amountNumber) && amountNumber > 0;
  const isExchangeDisabled =
    isExchangePending ||
    isRateLoading ||
    isBalanceLoading ||
    !exchangeRate ||
    !balances ||
    !hasValidAmount;

  const handleFromAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextAmount = normalizeAmountInput(event.target.value);
    setEditedAmount("from");
    setFromAmount(nextAmount);
    setFormMessage(null);
    setToAmount(exchangeRate ? calculateToAmount(nextAmount, fromCurrency, exchangeRate.rate) : "");
  };

  const handleToAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextAmount = normalizeAmountInput(event.target.value);
    setEditedAmount("to");
    setToAmount(nextAmount);
    setFormMessage(null);
    setFromAmount(
      exchangeRate ? calculateFromAmount(nextAmount, fromCurrency, exchangeRate.rate) : "",
    );
  };

  const handleSwapCurrenciesClick = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setFormMessage(null);
  };

  const handleExchangeClick = async () => {
    if (!exchangeRate) {
      setFormMessage("환율을 불러오지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    if (!balances || currentBalance === null) {
      setFormMessage("잔액을 확인할 수 없습니다. 다시 시도해 주세요.");
      return;
    }

    if (!hasValidAmount) {
      setFormMessage("환전할 금액을 입력해 주세요.");
      return;
    }

    if (amountNumber > currentBalance) {
      setFormMessage(`${fromCurrency} 잔액이 부족합니다.`);
      return;
    }

    setIsExchangePending(true);
    setFormMessage(null);

    try {
      const requestedFromAmount = fromAmount;
      const requestedToAmount = toAmount;

      await exchangeCurrency({
        amount: amountNumber,
        fromCurrency,
        toCurrency,
      });
      await loadBalances();

      setExchangeDetails({
        from: formatCurrency(Number(requestedFromAmount), fromCurrency),
        rate: exchangeRate.rate,
        to: formatCurrency(Number(requestedToAmount), toCurrency),
      });
      setIsSuccessModalOpen(true);
      setEditedAmount("from");
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      setFormMessage(toExchangeErrorMessage(error));
    } finally {
      setIsExchangePending(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">환전</h1>
        <Link
          href="/exchange/history"
          className="text-sm font-medium text-muted-foreground underline underline-offset-2"
        >
          내역
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>현재 환율</CardTitle>
          <CardDescription>KRW / USD</CardDescription>
          <CardAction className="text-xs text-muted-foreground">
            {exchangeRate ? `업데이트: ${formatRateDate(exchangeRate.rateDate)}` : null}
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isRateLoading ? (
            <Skeleton className="h-9 w-36" />
          ) : exchangeRate ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-normal">
                {exchangeRate.rate.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="text-base font-semibold text-foreground">원</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{rateErrorMessage}</span>
              <Button type="button" variant="outline" size="sm" onClick={loadExchangeRate}>
                다시 조회
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-6 pt-2">
          <CurrencyAmountField
            label="보내는 통화"
            currency={fromCurrency}
            amount={fromAmount}
            balance={currentBalance}
            isBalanceLoading={isBalanceLoading}
            balanceErrorMessage={balanceErrorMessage}
            onAmountChange={handleFromAmountChange}
          />

          <div className="flex items-center gap-3 py-2">
            <Separator className="flex-1" />
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={handleSwapCurrenciesClick}
              aria-label="통화 전환"
            >
              <ArrowUpDown aria-hidden="true" />
            </Button>
            <Separator className="flex-1" />
          </div>

          <CurrencyAmountField
            label="받는 통화"
            currency={toCurrency}
            amount={toAmount}
            balance={balances?.[toCurrency] ?? null}
            isBalanceLoading={isBalanceLoading}
            balanceErrorMessage={balanceErrorMessage}
            onAmountChange={handleToAmountChange}
          />
        </CardContent>
      </Card>

      {formMessage ? (
        <p className="text-center text-sm font-medium text-muted-foreground">{formMessage}</p>
      ) : null}

      <Button
        type="button"
        onClick={handleExchangeClick}
        disabled={isExchangeDisabled}
        className="mt-2 h-12 w-full rounded-xl font-bold shadow-md"
      >
        <CheckCircle data-icon="inline-start" aria-hidden="true" />
        <span>{isExchangePending ? "환전 요청 중" : "환전하기"}</span>
      </Button>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <CheckCircle className="size-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-lg font-bold text-foreground">
                환전 신청 완료
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                환전 신청이 정상적으로 완료되었습니다.
              </DialogDescription>
            </div>

            <div className="my-2 flex w-full flex-col gap-2 border-y border-border py-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">신청 환율</span>
                <span className="font-semibold text-foreground">
                  1 USD = {exchangeDetails.rate.toLocaleString("ko-KR")} KRW
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">보낸 금액</span>
                <span className="font-semibold text-foreground">{exchangeDetails.from}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">예상 수령 금액</span>
                <span className="font-semibold text-foreground">{exchangeDetails.to}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="h-10 w-full rounded-xl"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type CurrencyAmountFieldProps = {
  amount: string;
  balance: number | null;
  balanceErrorMessage: string | null;
  currency: Currency;
  isBalanceLoading: boolean;
  label: string;
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function CurrencyAmountField({
  amount,
  balance,
  balanceErrorMessage,
  currency,
  isBalanceLoading,
  label,
  onAmountChange,
}: CurrencyAmountFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-base font-bold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          잔액: {formatBalanceStatus(balance, currency, isBalanceLoading, balanceErrorMessage)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-secondary-foreground shadow-sm">
          {currency}
        </div>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={onAmountChange}
          className="h-10 text-right text-base font-medium shadow-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

function calculateToAmount(amount: string, fromCurrency: Currency, rate: number) {
  const numericAmount = Number(amount);

  if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0 || rate <= 0) {
    return "";
  }

  if (fromCurrency === "KRW") {
    return (numericAmount / rate).toFixed(2);
  }

  return String(Math.floor(numericAmount * rate));
}

function calculateFromAmount(amount: string, fromCurrency: Currency, rate: number) {
  const numericAmount = Number(amount);

  if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0 || rate <= 0) {
    return "";
  }

  if (fromCurrency === "KRW") {
    return String(Math.floor(numericAmount * rate));
  }

  return (numericAmount / rate).toFixed(2);
}

function normalizeAmountInput(value: string) {
  const numericValue = value.replace(/[^0-9.]/g, "");
  const [integerPart, ...fractionParts] = numericValue.split(".");
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, "") || "0";

  if (fractionParts.length === 0) {
    return integerPart === "" ? "" : normalizedInteger;
  }

  return `${normalizedInteger}.${fractionParts.join("")}`;
}

function formatBalanceStatus(
  balance: number | null,
  currency: Currency,
  isBalanceLoading: boolean,
  balanceErrorMessage: string | null,
) {
  if (isBalanceLoading) {
    return "조회 중...";
  }

  if (balance === null) {
    return balanceErrorMessage ?? "조회 실패";
  }

  return formatCurrency(balance, currency);
}

function formatCurrency(value: number, currency: Currency) {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  }

  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function formatRateDate(rateDate: string | null) {
  if (!rateDate) {
    return "-";
  }

  const date = new Date(rateDate);

  if (Number.isNaN(date.getTime())) {
    return rateDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

function toExchangeRateErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    return "로그인이 필요합니다. 다시 로그인한 뒤 조회해 주세요.";
  }

  if (error instanceof TypeError) {
    return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  return "환율을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

function toBalanceErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    return "로그인 필요";
  }

  if (error instanceof TypeError) {
    return "네트워크 오류";
  }

  return "조회 실패";
}

function toExchangeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return "로그인이 필요합니다. 다시 로그인한 뒤 환전해 주세요.";
  }

  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 422) {
      return "입력한 환전 정보를 확인해 주세요.";
    }

    if (error.status === 403) {
      return "환전 권한을 확인할 수 없습니다.";
    }
  }

  if (error instanceof TypeError) {
    return "네트워크 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  return "환전 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

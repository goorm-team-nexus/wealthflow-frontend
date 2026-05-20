"use client";

import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { placeOrder } from "@/services/investment";
import { fetchStockQuoteByTicker, getStockQuoteSeed } from "@/services/marketService";

type KeypadItem = {
  label: string;
  value: string;
};

type QuickQuantityItem =
  | {
      label: string;
      increment: number;
      type: "add";
    }
  | {
      label: string;
      type: "max";
    };

const maxSellQuantity = 27;
const defaultStockPrice = 219500;

const quickQuantityItems: QuickQuantityItem[] = [
  { label: "1주", increment: 1, type: "add" },
  { label: "5주", increment: 5, type: "add" },
  { label: "10주", increment: 10, type: "add" },
  { label: "최대", type: "max" },
];

const keypadItems: KeypadItem[] = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "0", value: "0" },
  { label: "00", value: "00" },
];

export default function StockSellPage() {
  const params = useParams<{ slug: string }>();
  const ticker = params.slug;
  const stockSeed = getStockQuoteSeed(ticker);
  const [quantity, setQuantity] = useState("0");
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [isOrderPending, setIsOrderPending] = useState(false);
  const [stockPrice, setStockPrice] = useState(defaultStockPrice);
  const sellControlsRef = useRef<HTMLDivElement>(null);
  const sellQuantity = Number(quantity);
  const sellPrice = stockPrice * sellQuantity;

  useEffect(() => {
    let isMounted = true;

    const loadStockPrice = async () => {
      try {
        const stockQuote = await fetchStockQuoteByTicker(ticker);

        if (isMounted) {
          setStockPrice(stockQuote.priceValue);
        }
      } catch {
        if (isMounted) {
          setStockPrice(defaultStockPrice);
        }
      }
    };

    void loadStockPrice();

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!sellControlsRef.current?.contains(event.target as Node)) {
        setIsKeypadOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, []);

  const handleQuantityFieldClick = () => {
    setIsKeypadOpen(true);
  };

  const handleNumberClick = (value: string) => {
    setQuantity((currentQuantity) => {
      if (currentQuantity === "0") {
        return value === "00" ? "0" : value;
      }

      return `${currentQuantity}${value}`;
    });
  };

  const handleDeleteClick = () => {
    setQuantity((currentQuantity) => {
      if (currentQuantity.length <= 1) {
        return "0";
      }

      return currentQuantity.slice(0, -1);
    });
  };

  const handleQuickQuantityClick = (quickQuantity: QuickQuantityItem) => {
    setIsKeypadOpen(true);

    if (quickQuantity.type === "max") {
      setQuantity(String(maxSellQuantity));
      return;
    }

    setQuantity((currentQuantity) => String(Number(currentQuantity) + quickQuantity.increment));
  };

  const handleSellClick = async () => {
    if (sellQuantity <= 0) {
      setOrderMessage("1주 이상 입력해주세요.");
      return;
    }

    setIsOrderPending(true);
    setOrderMessage("");

    try {
      const orderResult = await placeOrder({
        quantity: sellQuantity,
        ticker,
        tradeType: "SELL",
      });

      setOrderMessage(
        `${orderResult.ticker ?? ticker} ${orderResult.quantity ?? sellQuantity}주 판매가 완료되었습니다.`,
      );
    } catch (error) {
      setOrderMessage(getOrderErrorMessage(error));
    } finally {
      setIsOrderPending(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div className="grid h-8 grid-cols-[32px_minmax(0,1fr)_32px] items-center">
        <Button asChild variant="ghost" size="icon" className="size-8">
          <Link href={`/stock-detail/${ticker}`} aria-label="종목 상세로 돌아가기">
            <ArrowLeft className="size-5 stroke-[2.2]" aria-hidden="true" />
          </Link>
        </Button>
        <h1 className="truncate text-center text-sm font-semibold">
          {stockSeed.name} ({ticker})
        </h1>
      </div>

      <Card className="bg-muted/50 py-4 shadow-sm">
        <CardContent className="flex h-24 flex-col justify-center gap-3 px-4">
          <span className="text-xs text-muted-foreground">판매할 가격</span>
          <strong className="text-3xl font-bold tracking-normal">
            {formatCurrency(sellPrice)}
          </strong>
        </CardContent>
      </Card>

      <div ref={sellControlsRef} className="flex flex-col gap-6">
        <Card className="py-4 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">몇 주 판매할까요?</span>
              <div className="relative" onClick={handleQuantityFieldClick}>
                <Input
                  className="h-9 pr-9 text-base font-medium"
                  inputMode="numeric"
                  readOnly
                  value={quantity}
                  aria-label="판매 수량"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  주
                </span>
              </div>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {quickQuantityItems.map((quickQuantity) => (
                <Button
                  key={quickQuantity.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium"
                  onClick={() => handleQuickQuantityClick(quickQuantity)}
                >
                  {quickQuantity.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {isKeypadOpen ? (
          <section className="grid grid-cols-3 gap-1" aria-label="수량 입력 키패드">
            {keypadItems.map((keypadItem) => (
              <Button
                key={keypadItem.label}
                type="button"
                variant="outline"
                className="h-12 rounded-md text-xl font-semibold"
                onClick={() => handleNumberClick(keypadItem.value)}
              >
                {keypadItem.label}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-md"
              aria-label="한 글자 지우기"
              onClick={handleDeleteClick}
            >
              <CircleX className="size-4 stroke-[2.5]" aria-hidden="true" />
            </Button>
          </section>
        ) : null}
      </div>

      {orderMessage ? (
        <p className="text-center text-sm font-medium text-muted-foreground">{orderMessage}</p>
      ) : null}

      <Button
        type="button"
        className="w-full bg-blue-500 text-white hover:bg-blue-600"
        disabled={isOrderPending}
        onClick={handleSellClick}
      >
        {isOrderPending ? "판매 요청 중" : "판매하기"}
      </Button>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function getOrderErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return "로그인이 필요합니다.";
  }

  return "주문 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

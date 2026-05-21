"use client";

import { CircleX } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageBox } from "@/components/shared/message-box";
import { cn } from "@/lib/utils";
import { placeOrder } from "@/services/investment";
import { getPortfolio } from "@/services/portfolio";
import {
  fetchStockQuoteByTicker,
  getTickerCurrency,
  getStockQuoteSeed,
} from "@/services/marketService";

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
  const [quantity, setQuantity] = useState("0");
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });
  const [isOrderPending, setIsOrderPending] = useState(false);
  const [stockPrice, setStockPrice] = useState(defaultStockPrice);
  const [currency, setCurrency] = useState<"KRW" | "USD">(() => getTickerCurrency(ticker));
  const [holdingQuantity, setHoldingQuantity] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const sellControlsRef = useRef<HTMLDivElement>(null);
  const sellQuantity = Number(quantity);
  const sellPrice = stockPrice * sellQuantity;

  const maxSellQuantity = holdingQuantity ?? 0;
  const isSellDisabled =
    isOrderPending || isBalanceLoading || holdingQuantity === null || sellQuantity <= 0;

  useEffect(() => {
    let isMounted = true;

    const loadStockPrice = async () => {
      try {
        const stockQuote = await fetchStockQuoteByTicker(ticker);

        if (isMounted) {
          setStockPrice(stockQuote.priceValue);
          setCurrency(stockQuote.currency);
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
    let isMounted = true;

    const loadHolding = async () => {
      try {
        const response = await getPortfolio();

        if (isMounted && response.data) {
          const item = response.data.items.find((i) => i.ticker === ticker);
          setHoldingQuantity(item?.quantity ?? 0);
        }
      } catch {
        // 보유 수량 조회 실패 시 null 유지
      } finally {
        if (isMounted) setIsBalanceLoading(false);
      }
    };

    void loadHolding();

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  useEffect(() => {
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (sellControlsRef.current?.contains(target) || target.closest("button")) {
        return;
      }
      setIsKeypadOpen(false);
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, []);

  const clampToMax = (value: number) => {
    if (holdingQuantity !== null && value > maxSellQuantity) {
      return maxSellQuantity;
    }
    return value;
  };

  const handleQuantityFieldClick = () => {
    setIsKeypadOpen(true);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeQuantityInput(event.target.value);
    const clamped = clampToMax(Number(normalized));
    setQuantity(String(clamped));
  };

  const handleNumberClick = (value: string) => {
    setQuantity((currentQuantity) => {
      let next: string;

      if (currentQuantity === "0") {
        next = value === "00" ? "0" : value;
      } else {
        next = `${currentQuantity}${value}`;
      }

      const clamped = clampToMax(Number(next));
      return String(clamped);
    });
  };

  const handleClearQuantityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setQuantity("0");
  };

  const handleQuickQuantityClick = (quickQuantity: QuickQuantityItem) => {
    setIsKeypadOpen(true);

    if (quickQuantity.type === "max") {
      setQuantity(String(maxSellQuantity));
      return;
    }

    setQuantity((currentQuantity) => {
      const next = Number(currentQuantity) + quickQuantity.increment;
      return String(clampToMax(next));
    });
  };

  const handleSellClick = async () => {
    if (isBalanceLoading) {
      setModalContent({
        title: "판매 실패",
        description: "보유 수량을 조회 중입니다. 잠시 후 다시 시도해주세요.",
      });
      setIsModalOpen(true);
      return;
    }

    if (holdingQuantity === null) {
      setModalContent({
        title: "판매 실패",
        description: "보유 수량을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.",
      });
      setIsModalOpen(true);
      return;
    }

    if (maxSellQuantity <= 0) {
      setModalContent({
        title: "판매 실패",
        description: "보유 수량이 없습니다.",
      });
      setIsModalOpen(true);
      return;
    }

    if (sellQuantity <= 0) {
      setModalContent({
        title: "판매 실패",
        description: "1주 이상 입력해주세요.",
      });
      setIsModalOpen(true);
      return;
    }

    if (sellQuantity > maxSellQuantity) {
      setModalContent({
        title: "판매 실패",
        description: "보유 수량을 초과할 수 없습니다.",
      });
      setIsModalOpen(true);
      return;
    }

    setIsOrderPending(true);

    try {
      const orderResult = await placeOrder({
        quantity: sellQuantity,
        ticker,
        tradeType: "SELL",
      });

      const stockName = getStockQuoteSeed(ticker).name;
      const orderTicker = orderResult.ticker ?? ticker;
      const orderQty = orderResult.quantity ?? sellQuantity;

      setModalContent({
        title: "판매 완료",
        description: `${stockName} ${orderQty}주를 성공적으로 판매했습니다.`,
      });
      setIsModalOpen(true);
      setQuantity("0");

      // 보유 수량 최신화
      try {
        const response = await getPortfolio();
        if (response.data) {
          const item = response.data.items.find((i) => i.ticker === ticker);
          setHoldingQuantity(item?.quantity ?? 0);
        }
      } catch {
        // 무시
      }
    } catch (error) {
      setModalContent({
        title: "판매 실패",
        description: getOrderErrorMessage(error),
      });
      setIsModalOpen(true);
    } finally {
      setIsOrderPending(false);
    }
  };

  const remainingShares =
    holdingQuantity !== null && sellQuantity > 0 ? holdingQuantity - sellQuantity : null;

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <Card className="bg-muted/50 py-4 shadow-sm">
        <CardContent className="flex flex-col justify-center gap-3 px-4 py-1">
          <span className="text-xs text-muted-foreground">판매할 가격</span>
          <strong className="text-3xl font-bold tracking-normal">
            {formatCurrency(sellPrice, currency)}
          </strong>
          <div className="flex items-center justify-between border-t border-border/50 pt-2">
            <span className="text-xs text-muted-foreground">보유 수량</span>
            <span className="text-xs font-medium">
              {isBalanceLoading
                ? "조회 중..."
                : holdingQuantity !== null
                  ? `${holdingQuantity.toLocaleString("ko-KR")}주`
                  : "조회 실패"}
            </span>
          </div>
          {remainingShares !== null ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">거래 후 보유</span>
              <span className="text-xs font-medium">
                {remainingShares.toLocaleString("ko-KR")}주
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div ref={sellControlsRef} className="flex flex-col gap-6">
        <Card className="py-4 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-2">
              <span id="sell-quantity-label" className="text-xs text-muted-foreground">
                몇 주 판매할까요?
              </span>
              <div className="relative" onClick={handleQuantityFieldClick}>
                <Input
                  className="h-9 pr-16 text-base font-medium"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  aria-labelledby="sell-quantity-label"
                  onChange={handleQuantityChange}
                />
                {quantity !== "0" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-7 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
                    aria-label="판매 수량 초기화"
                    onClick={handleClearQuantityClick}
                  >
                    <CircleX className="size-4" aria-hidden="true" />
                  </Button>
                ) : null}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  주
                </span>
              </div>
            </div>

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
                className={cn(
                  "h-12 rounded-md text-xl font-semibold",
                  keypadItem.value === "0" && "col-span-2",
                )}
                onClick={() => handleNumberClick(keypadItem.value)}
              >
                {keypadItem.label}
              </Button>
            ))}
          </section>
        ) : null}
      </div>

      <Button
        type="button"
        className="w-full bg-blue-500 text-white hover:bg-blue-600"
        disabled={isSellDisabled}
        onClick={handleSellClick}
      >
        {isOrderPending ? "판매 요청 중" : "판매하기"}
      </Button>

      <MessageBox
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.description}
        onConfirm={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function formatCurrency(value: number, currency: "KRW" | "USD") {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function normalizeQuantityInput(value: string) {
  const numericValue = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

  return numericValue === "" ? "0" : numericValue;
}

function getOrderErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return "로그인이 필요합니다.";
  }

  return "주문 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

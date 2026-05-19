const API_BASE_PATH = "/backend-api";

type TradeType = "BUY" | "SELL";

type OrderRequest = {
  quantity: number;
  ticker: string;
  tradeType: TradeType;
};

export type OrderResult = {
  currency?: "KRW" | "USD";
  executedAt?: string;
  price?: number;
  quantity?: number;
  ticker?: string;
  totalAmount?: number;
  tradeType?: TradeType;
};

type ApiResponse<T> = {
  data?: T;
  success?: boolean;
};

export async function placeOrder(order: OrderRequest): Promise<OrderResult> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("AUTH_REQUIRED");
  }

  const response = await fetch(`${API_BASE_PATH}/v1/investments/order`, {
    body: JSON.stringify(order),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!response.ok) {
    throw new Error("ORDER_FAILED");
  }

  const apiResponse = (await response.json()) as ApiResponse<OrderResult>;

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error("ORDER_FAILED");
  }

  return apiResponse.data;
}

function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("accessToken") ??
    window.localStorage.getItem("access_token") ??
    window.sessionStorage.getItem("accessToken") ??
    window.sessionStorage.getItem("access_token")
  );
}

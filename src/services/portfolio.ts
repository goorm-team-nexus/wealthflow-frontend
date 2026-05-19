import { apiClient } from "@/lib/api-client";
import type { StaticImageData } from "next/image";

import naverLogo from "@/assets/images/logos/stocks/stock-naver.svg";
import tossLogo from "@/assets/images/logos/stocks/stock-toss.svg";
import kakaobankLogo from "@/assets/images/logos/stocks/stock-kakaobank.svg";
import shinhanLogo from "@/assets/images/logos/stocks/stock-sinhanbank.svg";
import cjLogo from "@/assets/images/logos/stocks/stock-CJ.svg";
import kbLogo from "@/assets/images/logos/stocks/stock-kb.svg";

// ---------------------------------------------------------
// 1. OpenAPI 연동 인터페이스 (API Contract)
// ---------------------------------------------------------

export interface PortfolioItemResponse {
  ticker: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  evaluationAmount: number;
  profitLoss: number;
  yieldRate: number;
  priceUpdatedAt: string;
}

export interface PortfolioResponse {
  totalInvestment: number;
  totalEvaluation: number;
  totalProfitLoss: number;
  totalYieldRate: number;
  evaluatedAt: string;
  items: PortfolioItemResponse[];
}

export interface ApiResponsePortfolioResponse {
  success?: boolean;
  data?: PortfolioResponse;
}

// ---------------------------------------------------------
// 2. UI 모델 인터페이스 (Component Data Model)
// ---------------------------------------------------------

export interface TotalAssetsData {
  totalAssets: number;
  totalProfit: number;
  totalProfitRate: number;
}

export interface HoldingItem {
  name: string;
  slug: string;
  initial?: string;
  shares: number;
  value: number;
  profitRate: number;
  logoSrc: string | StaticImageData;
  logoClassName?: string;
}

// ---------------------------------------------------------
// 3. 종목 메타데이터 매핑 (임시 하드코딩 - 추후 DB화)
// ---------------------------------------------------------

interface StockMetadata {
  name: string;
  slug: string;
  initial?: string;
  logoSrc: string | StaticImageData;
  logoClassName?: string;
}

const STOCK_META_MAP: Record<string, StockMetadata> = {
  "035420": {
    name: "네이버",
    slug: "naver",
    logoSrc: naverLogo,
    logoClassName: "w-full h-full object-cover",
  },
  TOSS: { name: "토스", slug: "toss", logoSrc: tossLogo },
  "323410": { name: "카카오뱅크", slug: "kakaobank", logoSrc: kakaobankLogo },
  "055550": {
    name: "신한은행",
    slug: "shinhan-bank",
    logoSrc: shinhanLogo,
    logoClassName: "w-full h-full object-cover",
  },
  "001040": { name: "CJ", slug: "cj", logoSrc: cjLogo, logoClassName: "w-8 h-8 object-contain" },
  "105560": { name: "KB", slug: "kb", logoSrc: kbLogo, logoClassName: "w-8 h-8 object-contain" },
  "005930": { name: "삼성전자", slug: "samsung-electronics", initial: "S", logoSrc: "" },
  "373220": { name: "LG에너지솔루션", slug: "lg-energy-solution", initial: "L", logoSrc: "" },
  "005380": { name: "현대차", slug: "hyundai-motor", initial: "H", logoSrc: "" },
  "000660": { name: "SK하이닉스", slug: "sk-hynix", initial: "S", logoSrc: "" },
};

const getStockMetadata = (ticker: string): StockMetadata => {
  return (
    STOCK_META_MAP[ticker] || {
      name: ticker,
      slug: ticker.toLowerCase(),
      initial: ticker.charAt(0).toUpperCase(),
      logoSrc: "",
    }
  );
};

// ---------------------------------------------------------
// 4. API Response -> UI Model Mapper
// ---------------------------------------------------------

export const mapToTotalAssetsData = (data: PortfolioResponse): TotalAssetsData => {
  return {
    totalAssets: data.totalEvaluation,
    totalProfit: data.totalProfitLoss,
    totalProfitRate: data.totalYieldRate,
  };
};

export const mapToHoldingItems = (items: PortfolioItemResponse[]): HoldingItem[] => {
  return items.map((item) => {
    const meta = getStockMetadata(item.ticker);
    return {
      name: meta.name,
      slug: meta.slug,
      initial: meta.initial,
      shares: item.quantity,
      value: item.evaluationAmount,
      profitRate: item.yieldRate,
      logoSrc: meta.logoSrc,
      logoClassName: meta.logoClassName,
    };
  });
};

// ---------------------------------------------------------
// 5. Fetch API (Service Method)
// ---------------------------------------------------------

/**
 * 포트폴리오 데이터를 가져옵니다.
 */
export async function getPortfolio(): Promise<ApiResponsePortfolioResponse> {
  return apiClient<ApiResponsePortfolioResponse>("/investments/portfolio", {
    method: "GET",
  });
}

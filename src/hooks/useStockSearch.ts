import { useState, useEffect, useMemo, useCallback } from "react";

import { getStockPrice } from "@/services/investment";
import { type StockItem, stockCatalog, filterStockCatalog } from "@/lib/stock-catalog";

interface UseStockSearchOptions {
  /** 기본 표시 종목 수 (기본값: 4) */
  defaultDisplayCount?: number;
  /** API 폴백 디바운스 딜레이 ms (기본값: 500) */
  debounceMs?: number;
}

interface UseStockSearchReturn {
  /** 현재 검색어 */
  searchQuery: string;
  /** 검색어 변경 핸들러 */
  handleSearchChange: (value: string) => void;
  /** 상태 초기화 */
  reset: () => void;
  /** 검색어가 비어있지 않은지 여부 */
  hasSearch: boolean;
  /** 로컬 카탈로그 매치 결과 */
  catalogMatches: StockItem[];
  /** API 폴백 검색 결과 */
  apiResult: StockItem | null;
  /** API 검색 대기 중 (파생 상태) */
  isSearchPending: boolean;
  /** 카탈로그·API 모두 결과 없음 */
  searchError: boolean;
  /** 검색어 없을 때 기본 표시 종목 */
  defaultStocks: StockItem[];
}

/**
 * 종목 검색 훅 — 로컬 카탈로그 즉시 필터링 + API 폴백
 *
 * @example
 * ```tsx
 * const { searchQuery, handleSearchChange, catalogMatches, ... } = useStockSearch();
 * ```
 */
export function useStockSearch(options: UseStockSearchOptions = {}): UseStockSearchReturn {
  const { defaultDisplayCount = 4, debounceMs = 500 } = options;

  const [searchQuery, setSearchQuery] = useState("");
  const [apiResult, setApiResult] = useState<StockItem | null>(null);
  const [searchError, setSearchError] = useState(false);

  // ── 로컬 카탈로그 즉시 필터링 ──
  const catalogMatches = useMemo(() => filterStockCatalog(searchQuery), [searchQuery]);

  /** API 폴백이 필요한지 여부 */
  const needsApiFallback = searchQuery.trim().length > 0 && catalogMatches.length === 0;

  /** API 검색 대기 중 (파생 상태) */
  const isSearchPending = needsApiFallback && !apiResult && !searchError;

  // ── 카탈로그 매치 없을 때만 API 폴백 (디바운스) ──
  useEffect(() => {
    if (!needsApiFallback) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const response = await getStockPrice(searchQuery.trim());
        if (cancelled) return;

        if (response.success && response.data?.ticker) {
          const ticker = response.data.ticker;
          setApiResult({
            id: ticker.toLowerCase(),
            name: ticker,
            ticker,
            initial: ticker[0],
          });
        } else {
          setSearchError(true);
        }
      } catch {
        if (!cancelled) setSearchError(true);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [needsApiFallback, searchQuery, debounceMs]);

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setApiResult(null);
    setSearchError(false);
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setSearchQuery("");
    setApiResult(null);
    setSearchError(false);
  }, []);

  const hasSearch = searchQuery.trim().length > 0;
  const defaultStocks = useMemo(
    () => stockCatalog.slice(0, defaultDisplayCount),
    [defaultDisplayCount],
  );

  return {
    searchQuery,
    handleSearchChange,
    reset,
    hasSearch,
    catalogMatches,
    apiResult,
    isSearchPending,
    searchError,
    defaultStocks,
  };
}

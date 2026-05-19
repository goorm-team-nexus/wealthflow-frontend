/**
 * 로컬 종목 카탈로그 — 종목명 ↔ 티커 매핑
 * 전체 종목 리스트 API 추가 시 교체 예정
 */

export interface StockItem {
  id: string;
  name: string;
  ticker: string;
  initial: string;
}

export const stockCatalog: StockItem[] = [
  // 한국 주식
  { id: "samsung-electronics", name: "삼성전자", ticker: "005930", initial: "삼" },
  { id: "sk-hynix", name: "SK하이닉스", ticker: "000660", initial: "S" },
  { id: "lg-energy", name: "LG에너지솔루션", ticker: "373220", initial: "L" },
  { id: "samsung-bio", name: "삼성바이오로직스", ticker: "207940", initial: "삼" },
  { id: "hyundai-motor", name: "현대자동차", ticker: "005380", initial: "현" },
  { id: "kia", name: "기아", ticker: "000270", initial: "기" },
  { id: "celltrion", name: "셀트리온", ticker: "068270", initial: "셀" },
  { id: "kb-financial", name: "KB금융", ticker: "105560", initial: "K" },
  { id: "samsung-sdi", name: "삼성SDI", ticker: "006400", initial: "삼" },
  { id: "posco-holdings", name: "POSCO홀딩스", ticker: "005490", initial: "P" },
  { id: "naver", name: "네이버", ticker: "035420", initial: "네" },
  { id: "kakao", name: "카카오", ticker: "035720", initial: "카" },
  // 미국 주식
  { id: "apple", name: "Apple", ticker: "AAPL", initial: "A" },
  { id: "tesla", name: "Tesla", ticker: "TSLA", initial: "T" },
  { id: "nvidia", name: "NVIDIA", ticker: "NVDA", initial: "N" },
  { id: "microsoft", name: "Microsoft", ticker: "MSFT", initial: "M" },
  { id: "alphabet", name: "Alphabet", ticker: "GOOGL", initial: "G" },
  { id: "amazon", name: "Amazon", ticker: "AMZN", initial: "A" },
  { id: "meta", name: "Meta", ticker: "META", initial: "M" },
  { id: "netflix", name: "Netflix", ticker: "NFLX", initial: "N" },
  { id: "amd", name: "AMD", ticker: "AMD", initial: "A" },
  { id: "intel", name: "Intel", ticker: "INTC", initial: "I" },
];

/**
 * 종목명 또는 티커로 카탈로그를 필터링합니다.
 * @param query 검색어 (빈 문자열이면 빈 배열 반환)
 */
export function filterStockCatalog(query: string): StockItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return stockCatalog.filter(
    (s) => s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q),
  );
}

/**
 * 티커로 카탈로그 항목을 조회합니다.
 * @returns 매칭된 StockItem 또는 undefined
 */
export function findByTicker(ticker: string): StockItem | undefined {
  return stockCatalog.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
}

/**
 * 로컬 종목 카탈로그 — 종목명 ↔ 티커 매핑
 * 전체 종목 리스트 API 추가 시 교체 예정
 */

export interface StockItem {
  id: string;
  name: string; // 표시용 한글명 (예: "삼성전자", "테슬라")
  englishName: string; // 영문명 (예: "Samsung Electronics", "Tesla")
  ticker: string; // 티커 (예: "005930", "TSLA")
  initial: string; // 초성 또는 이니셜
}

export const stockCatalog: StockItem[] = [
  // 한국 주식
  {
    id: "samsung-electronics",
    name: "삼성전자",
    englishName: "Samsung Electronics",
    ticker: "005930",
    initial: "삼",
  },
  { id: "sk-hynix", name: "SK하이닉스", englishName: "SK Hynix", ticker: "000660", initial: "S" },
  {
    id: "lg-energy",
    name: "LG에너지솔루션",
    englishName: "LG Energy Solution",
    ticker: "373220",
    initial: "L",
  },
  {
    id: "samsung-bio",
    name: "삼성바이오로직스",
    englishName: "Samsung Biologics",
    ticker: "207940",
    initial: "삼",
  },
  {
    id: "hyundai-motor",
    name: "현대자동차",
    englishName: "Hyundai Motor",
    ticker: "005380",
    initial: "현",
  },
  { id: "kia", name: "기아", englishName: "Kia", ticker: "000270", initial: "기" },
  { id: "celltrion", name: "셀트리온", englishName: "Celltrion", ticker: "068270", initial: "셀" },
  {
    id: "kb-financial",
    name: "KB금융",
    englishName: "KB Financial Group",
    ticker: "105560",
    initial: "K",
  },
  {
    id: "samsung-sdi",
    name: "삼성SDI",
    englishName: "Samsung SDI",
    ticker: "006400",
    initial: "삼",
  },
  {
    id: "posco-holdings",
    name: "POSCO홀딩스",
    englishName: "POSCO Holdings",
    ticker: "005490",
    initial: "P",
  },
  { id: "naver", name: "네이버", englishName: "NAVER", ticker: "035420", initial: "네" },
  { id: "kakao", name: "카카오", englishName: "Kakao", ticker: "035720", initial: "카" },

  // 미국 주식 (표시명 한글화 + 영문명 유지)
  { id: "apple", name: "애플", englishName: "Apple", ticker: "AAPL", initial: "애" },
  { id: "tesla", name: "테슬라", englishName: "Tesla", ticker: "TSLA", initial: "테" },
  { id: "nvidia", name: "엔비디아", englishName: "NVIDIA", ticker: "NVDA", initial: "엔" },
  {
    id: "microsoft",
    name: "마이크로소프트",
    englishName: "Microsoft",
    ticker: "MSFT",
    initial: "마",
  },
  { id: "alphabet", name: "알파벳", englishName: "Alphabet", ticker: "GOOGL", initial: "알" },
  { id: "amazon", name: "아마존", englishName: "Amazon", ticker: "AMZN", initial: "아" },
  { id: "meta", name: "메타", englishName: "Meta Platforms", ticker: "META", initial: "메" },
  { id: "netflix", name: "넷플릭스", englishName: "Netflix", ticker: "NFLX", initial: "넷" },
  { id: "amd", name: "에이엠디", englishName: "AMD", ticker: "AMD", initial: "에" },
  { id: "intel", name: "인텔", englishName: "Intel", ticker: "INTC", initial: "인" },
];

/**
 * 종목명(한/영) 또는 티커로 카탈로그를 필터링합니다.
 * @param query 검색어 (빈 문자열이면 빈 배열 반환)
 */
export function filterStockCatalog(query: string): StockItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return stockCatalog.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.ticker.toLowerCase().includes(q),
  );
}

/**
 * 티커로 카탈로그 항목을 조회합니다.
 * @returns 매칭된 StockItem 또는 undefined
 */
export function findByTicker(ticker: string): StockItem | undefined {
  return stockCatalog.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
}

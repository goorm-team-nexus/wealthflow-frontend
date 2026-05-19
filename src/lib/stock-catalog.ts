/**
 * 로컬 종목 카탈로그 — 종목명 ↔ 티커 매핑
 * 전체 종목 리스트 API 추가 시 교체 예정
 */

export interface StockItem {
  id: string;
  name: string; // 표시용 한글명 (예: "삼성전자", "테슬라")
  englishName: string; // 영문명 (예: "Samsung Electronics", "Tesla")
  ticker: string; // 티커 (예: "005930", "TSLA")
  initial: string; // 세련된 영문 대문자 로고 이니셜 (예: "S", "T")
  aliases?: string[]; // 사용자가 검색할 수 있는 다양한 별칭 및 한글/영어 발음 준말
}

export const stockCatalog: StockItem[] = [
  // 한국 주식
  {
    id: "samsung-electronics",
    name: "삼성전자",
    englishName: "Samsung Electronics",
    ticker: "005930",
    initial: "S",
    aliases: ["삼성", "삼전", "samsung", "sec"],
  },
  {
    id: "sk-hynix",
    name: "SK하이닉스",
    englishName: "SK Hynix",
    ticker: "000660",
    initial: "S",
    aliases: ["에스케이", "하이닉스", "하닉", "hynix", "sk"],
  },
  {
    id: "lg-energy",
    name: "LG에너지솔루션",
    englishName: "LG Energy Solution",
    ticker: "373220",
    initial: "L",
    aliases: ["엘지", "엘쥐", "엘지엔솔", "엔솔", "lg", "lgenesol"],
  },
  {
    id: "samsung-bio",
    name: "삼성바이오로직스",
    englishName: "Samsung Biologics",
    ticker: "207940",
    initial: "S",
    aliases: ["삼바", "삼성바이오", "삼바이오", "sambio"],
  },
  {
    id: "hyundai-motor",
    name: "현대자동차",
    englishName: "Hyundai Motor",
    ticker: "005380",
    initial: "H",
    aliases: ["현대차", "현대", "hyundai"],
  },
  {
    id: "kia",
    name: "기아",
    englishName: "Kia",
    ticker: "000270",
    initial: "K",
    aliases: ["기아차", "kia"],
  },
  {
    id: "celltrion",
    name: "셀트리온",
    englishName: "Celltrion",
    ticker: "068270",
    initial: "C",
    aliases: ["셀트", "celltrion"],
  },
  {
    id: "kb-financial",
    name: "KB금융",
    englishName: "KB Financial Group",
    ticker: "105560",
    initial: "K",
    aliases: ["국민은행", "kb", "kb금융"],
  },
  {
    id: "samsung-sdi",
    name: "삼성SDI",
    englishName: "Samsung SDI",
    ticker: "006400",
    initial: "S",
    aliases: ["삼에스디아이", "sdi", "삼성sdi"],
  },
  {
    id: "posco-holdings",
    name: "POSCO홀딩스",
    englishName: "POSCO Holdings",
    ticker: "005490",
    initial: "P",
    aliases: ["포스코", "포스코홀딩스", "posco"],
  },
  {
    id: "naver",
    name: "네이버",
    englishName: "NAVER",
    ticker: "035420",
    initial: "N",
    aliases: ["네버", "naver"],
  },
  {
    id: "kakao",
    name: "카카오",
    englishName: "Kakao",
    ticker: "035720",
    initial: "K",
    aliases: ["카톡", "kakao"],
  },

  // 미국 주식
  {
    id: "apple",
    name: "애플",
    englishName: "Apple",
    ticker: "AAPL",
    initial: "A",
    aliases: ["apple", "ap"],
  },
  {
    id: "tesla",
    name: "테슬라",
    englishName: "Tesla",
    ticker: "TSLA",
    initial: "T",
    aliases: ["tesla", "ts"],
  },
  {
    id: "nvidia",
    name: "엔비디아",
    englishName: "NVIDIA",
    ticker: "NVDA",
    initial: "N",
    aliases: ["엔비", "nvidia", "nv"],
  },
  {
    id: "microsoft",
    name: "마이크로소프트",
    englishName: "Microsoft",
    ticker: "MSFT",
    initial: "M",
    aliases: ["마소", "microsoft", "ms"],
  },
  {
    id: "alphabet",
    name: "알파벳",
    englishName: "Alphabet",
    ticker: "GOOGL",
    initial: "G",
    aliases: ["구글", "google", "alphabet", "goog"],
  },
  {
    id: "amazon",
    name: "아마존",
    englishName: "Amazon",
    ticker: "AMZN",
    initial: "A",
    aliases: ["amazon", "amz"],
  },
  {
    id: "meta",
    name: "메타",
    englishName: "Meta Platforms",
    ticker: "META",
    initial: "M",
    aliases: ["페이스북", "페북", "meta", "facebook"],
  },
  {
    id: "netflix",
    name: "넷플릭스",
    englishName: "Netflix",
    ticker: "NFLX",
    initial: "N",
    aliases: ["넷플", "netflix", "nflx"],
  },
  {
    id: "amd",
    name: "에이엠디",
    englishName: "AMD",
    ticker: "AMD",
    initial: "A",
    aliases: ["암드", "amd"],
  },
  {
    id: "intel",
    name: "인텔",
    englishName: "Intel",
    ticker: "INTC",
    initial: "I",
    aliases: ["intel", "intc"],
  },
];

/**
 * 종목명(한/영), 티커 또는 다양한 별칭(aliases)으로 카탈로그를 필터링합니다.
 * @param query 검색어 (빈 문자열이면 빈 배열 반환)
 */
export function filterStockCatalog(query: string): StockItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return stockCatalog.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.ticker.toLowerCase().includes(q) ||
      (s.aliases && s.aliases.some((alias) => alias.toLowerCase().includes(q))),
  );
}

/**
 * 티커로 카탈로그 항목을 조회합니다.
 * @returns 매칭된 StockItem 또는 undefined
 */
export function findByTicker(ticker: string): StockItem | undefined {
  return stockCatalog.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
}

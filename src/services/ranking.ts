import { apiClient } from "@/lib/api-client";
import { getAvatarSrc } from "@/services/user";

// ==========================================
// 1. OpenAPI 스키마 기반 TypeScript 타입 정의
// ==========================================

export interface RankingUserInfo {
  nickname: string;
  profileImg: string;
  avatarPresetId?: number;
  rank: number;
  returnRate: number;
  stockCount: number;
  totalAsset: number;
}

export interface RankingListResponse {
  rankings: RankingUserInfo[];
  totalCount: number;
  updatedAt: string;
}

export interface MyRankingResponse {
  rankingInfo: RankingUserInfo;
  updatedAt: string;
}

export interface ApiResponseRankingListResponse {
  success?: boolean;
  data?: RankingListResponse;
}

export interface ApiResponseMyRankingResponse {
  success?: boolean;
  data?: MyRankingResponse;
}

// ==========================================
// 2. UI 요구사항에 맞춘 내부 모델 정의
// ==========================================

export interface MyRankingUIModel {
  nickname: string;
  avatarUrl: string;
  rank: number;
  rankChange: number;
  topPercent: number;
  message: string;
  isAuthenticated: boolean;
  totalAsset?: number;
  returnRate?: number;
  totalAssetFormatted: string;
}

export interface WeeklyUserUIModel {
  name: string;
  rate: string;
  img: string;
  totalAsset: string;
}

export interface WeeklyRankingUIModel {
  rank1: WeeklyUserUIModel;
  rank2: WeeklyUserUIModel;
  rank3: WeeklyUserUIModel;
}

export interface OverallRankingUIModel {
  rank: number;
  name: string;
  avatarUrl: string;
  rate: string;
  totalAsset: string;
  stocks: number;
}

// ==========================================
// 3. API 서비스 함수 정의
// ==========================================

/**
 * 전체 랭킹 조회 (페이징 지원)
 */
export async function getRanking(page = 0, size = 10): Promise<ApiResponseRankingListResponse> {
  return apiClient<ApiResponseRankingListResponse>(`/ranking?page=${page}&size=${size}`);
}

/**
 * 로그인한 나의 랭킹 정보 조회 (인증 토큰 사용)
 */
export async function getMyRanking(): Promise<ApiResponseMyRankingResponse> {
  return apiClient<ApiResponseMyRankingResponse>("/ranking/me");
}

/**
 * TOP 3 랭커 조회
 */
export async function getTop3(): Promise<ApiResponseRankingListResponse> {
  return apiClient<ApiResponseRankingListResponse>("/ranking/top3");
}

// ==========================================
// 4. Raw API Response -> UI Model 변환 매퍼 (Mapper)
// ==========================================

function formatTotalAsset(value: number): string {
  if (value >= 100_000_000) {
    const eok = Math.floor(value / 100_000_000);
    const remainder = value % 100_000_000;
    const man = Math.floor(remainder / 10_000);

    if (man > 0) {
      return `₩${eok}억 ${man.toLocaleString()}만`;
    }
    return `₩${eok}억`;
  }
  if (value >= 10_000) {
    return `₩${Math.floor(value / 10_000).toLocaleString()}만`;
  }
  return `₩${value.toLocaleString()}`;
}

/**
 * 나의 랭킹 정보를 UI 모델로 변환 (인증 오류 또는 빈 데이터에 대한 폴백 처리 완비)
 */
export function mapToMyRankingUI(
  rankingInfo?: RankingUserInfo | null,
  isAuthenticated = true,
): MyRankingUIModel {
  if (!isAuthenticated || !rankingInfo) {
    return {
      nickname: "-",
      avatarUrl: "",
      rank: 0,
      rankChange: 0,
      topPercent: 0,
      message: "",
      isAuthenticated: false,
      totalAssetFormatted: "",
    };
  }

  const nickname = rankingInfo.nickname || "홍길동";
  const avatarUrl = getAvatarSrc(rankingInfo.avatarPresetId) || "";
  const rank = rankingInfo.rank || 0;
  const returnRateVal = rankingInfo.returnRate || 0;

  // 수익률 포맷팅
  const formattedRate =
    returnRateVal >= 0 ? `+${returnRateVal.toFixed(2)}%` : `${returnRateVal.toFixed(2)}%`;
  const message = `수익률: ${formattedRate} | 보유 종목: ${rankingInfo.stockCount || 0}개 📈`;

  return {
    nickname,
    avatarUrl,
    rank,
    rankChange: 0, // 백엔드 미지원으로 0으로 유지
    topPercent: 0, // 백엔드 미지원으로 0으로 유지
    message,
    isAuthenticated: true,
    totalAsset: rankingInfo.totalAsset,
    returnRate: returnRateVal,
    totalAssetFormatted: formatTotalAsset(rankingInfo.totalAsset || 0),
  };
}

/**
 * TOP 3 랭킹 정보를 주간 랭킹 UI 모델로 변환 (비어있는 슬롯은 홍길동 등으로 기본 이름 폴백 채움)
 */
export function mapToWeeklyRankingUI(rankings: RankingUserInfo[] = []): WeeklyRankingUIModel {
  const sortedRankings = [...rankings].sort((a, b) => (a.rank || 0) - (b.rank || 0));

  // 1, 2, 3위 찾기 또는 순차 할당
  const r1 = sortedRankings.find((r) => r.rank === 1) || sortedRankings[0];
  const r2 = sortedRankings.find((r) => r.rank === 2) || sortedRankings[1];
  const r3 = sortedRankings.find((r) => r.rank === 3) || sortedRankings[2];

  const formatRate = (rate?: number) => {
    if (rate === undefined) return "0.00%";
    return rate >= 0 ? `+${rate.toFixed(2)}%` : `${rate.toFixed(2)}%`;
  };

  return {
    rank1: {
      name: r1?.nickname || "홍길동",
      rate: formatRate(r1?.returnRate),
      img: getAvatarSrc(r1?.avatarPresetId) || "",
      totalAsset: formatTotalAsset(r1?.totalAsset || 0),
    },
    rank2: {
      name: r2?.nickname || "임꺽정",
      rate: formatRate(r2?.returnRate),
      img: getAvatarSrc(r2?.avatarPresetId) || "",
      totalAsset: formatTotalAsset(r2?.totalAsset || 0),
    },
    rank3: {
      name: r3?.nickname || "심청이",
      rate: formatRate(r3?.returnRate),
      img: getAvatarSrc(r3?.avatarPresetId) || "",
      totalAsset: formatTotalAsset(r3?.totalAsset || 0),
    },
  };
}

/**
 * 전체 랭킹 리스트를 테이블 UI 모델로 변환
 */
export function mapToOverallRankingUI(rankings: RankingUserInfo[] = []): OverallRankingUIModel[] {
  return rankings.map((r) => {
    const rateVal = r.returnRate || 0;
    const formattedRate = rateVal >= 0 ? `+${rateVal.toFixed(2)}%` : `${rateVal.toFixed(2)}%`;

    return {
      rank: r.rank || 0,
      name: r.nickname || `투자자 ${r.rank || 0}`,
      avatarUrl: getAvatarSrc(r.avatarPresetId) || "",
      rate: formattedRate,
      totalAsset: formatTotalAsset(r.totalAsset || 0),
      stocks: r.stockCount || 0,
    };
  });
}

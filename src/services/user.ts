import { apiClient } from "@/lib/api-client";

export const AVATAR_PRESETS = [
  { id: 1, key: "purple", src: "/profiles/avatar_purple.png" },
  { id: 2, key: "green", src: "/profiles/avatar_green.png" },
  { id: 3, key: "yellow", src: "/profiles/avatar_yellow.png" },
  { id: 4, key: "red", src: "/profiles/avatar_red.png" },
  { id: 5, key: "blue", src: "/profiles/avatar_blue.png" },
  { id: 6, key: "pink", src: "/profiles/avatar_pink.png" },
];

export function getAvatarSrc(presetId?: number | null): string | null {
  if (!presetId) return null;
  const found = AVATAR_PRESETS.find((a) => a.id === presetId);
  return found ? found.src : null;
}

export function getAvatarPresetId(src?: string | null): number {
  if (!src) return 1;
  const found = AVATAR_PRESETS.find((a) => a.src === src);
  return found ? found.id : 1;
}

export interface MyPageResponse {
  avatarPresetId?: number;
  cashBalance: number;
  currencyCode: string;
  email: string;
  joinedAt?: string;
  name: string;
  profitRate: number;
  totalAsset: number;
  totalProfit: number;
}

export interface ApiResponseMyPageResponse {
  success?: boolean;
  data?: MyPageResponse;
  message?: string;
}

export interface UpdateUserProfileRequest {
  avatarPresetId: number;
  currentPassword?: string;
  name: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

export interface UserProfileResponse {
  avatarPresetId?: number;
  email?: string;
  joinedAt?: string;
  name?: string;
}

export interface ApiResponseUserProfileResponse {
  success?: boolean;
  data?: UserProfileResponse;
  message?: string;
}

/**
 * 마이페이지 / 사용자 정보 조회 API
 */
export async function getMyPage(): Promise<ApiResponseMyPageResponse> {
  return apiClient<ApiResponseMyPageResponse>("/user/me", {
    method: "GET",
  });
}

/**
 * 사용자 정보 / 프로필 수정 API
 */
export async function updateProfile(
  data: UpdateUserProfileRequest,
): Promise<ApiResponseUserProfileResponse> {
  return apiClient<ApiResponseUserProfileResponse>("/user/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

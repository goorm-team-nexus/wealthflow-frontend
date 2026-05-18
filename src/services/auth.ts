import { apiClient } from "@/lib/api-client";

export interface LoginRequest {
  email: string;
  password?: string; // Optional if you only support kakao in the future, but required for standard
}

export interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface ApiResponseTokenResponse {
  success?: boolean;
  data?: TokenResponse;
}

export interface UserSignUpRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface UserResponse {
  email?: string;
  id?: number;
  name?: string;
}

export interface ApiResponseUserResponse {
  success?: boolean;
  data?: UserResponse;
}

export interface ApiResponseLogoutResponse {
  success?: boolean;
}

/**
 * 로그인 API (Next.js Route Handler Proxy 호출)
 */
export async function login(data: LoginRequest): Promise<ApiResponseTokenResponse> {
  // isExternal = true to use the exact endpoint without NEXT_PUBLIC_API_URL prefix,
  // because we are calling our own Next.js API Route.
  return apiClient<ApiResponseTokenResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true,
  );
}

/**
 * 리프레시 토큰으로 액세스 토큰 재발급 (Next.js Route Handler Proxy 호출)
 */
export async function refresh(): Promise<ApiResponseTokenResponse> {
  return apiClient<ApiResponseTokenResponse>(
    "/api/auth/refresh",
    {
      method: "POST",
    },
    true,
  );
}

/**
 * 로그아웃 (Next.js Route Handler Proxy 호출)
 */
export async function logout(): Promise<ApiResponseLogoutResponse> {
  return apiClient<ApiResponseLogoutResponse>(
    "/api/auth/logout",
    {
      method: "POST",
    },
    true,
  );
}

/**
 * 회원가입 API (실제 백엔드 호출)
 */
export async function signUp(data: UserSignUpRequest): Promise<ApiResponseUserResponse> {
  return apiClient<ApiResponseUserResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

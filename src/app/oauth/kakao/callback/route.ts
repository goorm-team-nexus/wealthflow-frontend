import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCanonicalFrontendRedirectUrl, isSecureRequest, KAKAO_STATE_COOKIE } from "@/lib/oauth";

const getApiBaseUrl = () => {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return baseUrl.replace(/\/$/, "");
};

const getKakaoLoginUrl = (request: Request, code: string) => {
  const baseUrl = getApiBaseUrl();
  const isRelative = baseUrl.startsWith("/");
  const url = isRelative
    ? new URL(`${baseUrl}/auth/kakao`, request.url)
    : new URL(`${baseUrl}/auth/kakao`);

  url.searchParams.set("code", code);

  return url.toString();
};

const redirectToLoginError = () =>
  NextResponse.redirect(getCanonicalFrontendRedirectUrl("/login?authError=kakao"));

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const state = requestUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get(KAKAO_STATE_COOKIE)?.value;

  cookieStore.delete(KAKAO_STATE_COOKIE);

  if (error || !code || !state || !storedState || state !== storedState) {
    return redirectToLoginError();
  }

  try {
    const backendResponse = await fetch(getKakaoLoginUrl(request, code), {
      method: "POST",
    });

    let data: {
      success?: boolean;
      data?: {
        refreshToken?: string;
      };
    } | null = null;

    try {
      data = await backendResponse.json();
    } catch {
      data = null;
    }

    if (!backendResponse.ok || !data?.success || !data.data?.refreshToken) {
      return redirectToLoginError();
    }

    cookieStore.set({
      name: "refreshToken",
      value: data.data.refreshToken,
      httpOnly: true,
      secure: isSecureRequest(request),
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.redirect(getCanonicalFrontendRedirectUrl("/stocks"));
  } catch {
    return redirectToLoginError();
  }
}

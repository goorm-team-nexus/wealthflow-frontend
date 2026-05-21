import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getRequestOrigin, isSecureRequest, KAKAO_STATE_COOKIE } from "@/lib/oauth";

const KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_CALLBACK_PATH = "/oauth/kakao/callback";
const STATE_MAX_AGE_SECONDS = 5 * 60;

const getKakaoRedirectUri = (request: Request) => {
  const frontendUrl = process.env.APP_FRONTEND_URL ?? process.env.NEXT_PUBLIC_APP_URL;

  return new URL(KAKAO_CALLBACK_PATH, frontendUrl || getRequestOrigin(request)).toString();
};

export async function GET(request: Request) {
  const kakaoClientId = process.env.KAKAO_CLIENT_ID;

  if (!kakaoClientId) {
    return NextResponse.redirect(new URL("/login?authError=kakao", getRequestOrigin(request)));
  }

  const redirectUri = getKakaoRedirectUri(request);
  const state = randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set({
    name: KAKAO_STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: isSecureRequest(request),
    path: "/",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE_SECONDS,
  });

  const authorizeUrl = new URL(KAKAO_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", kakaoClientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl);
}

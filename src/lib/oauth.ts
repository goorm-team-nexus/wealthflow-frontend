export const KAKAO_STATE_COOKIE = "kakaoOAuthState";

const getFirstHeaderValue = (value: string | null) => value?.split(",")[0]?.trim();

export const getRequestOrigin = (request: Request) => {
  const requestUrl = new URL(request.url);
  const forwardedProto = getFirstHeaderValue(request.headers.get("x-forwarded-proto"));
  const forwardedHost = getFirstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = forwardedHost || request.headers.get("host") || requestUrl.host;
  const protocol = forwardedProto || requestUrl.protocol.replace(":", "");

  return `${protocol}://${host}`;
};

export const isSecureRequest = (request: Request) =>
  getFirstHeaderValue(request.headers.get("x-forwarded-proto")) === "https" ||
  request.url.startsWith("https://") ||
  process.env.SECURE_COOKIE === "true";

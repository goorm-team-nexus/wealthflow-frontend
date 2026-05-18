import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DEFAULT_DEV_API_BASE_URL = "https://d3uib3r331utfe.cloudfront.net/api/v1";

const getApiBaseUrl = () => {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "development" ? DEFAULT_DEV_API_BASE_URL : undefined);

  if (!baseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return baseUrl.replace(/\/$/, "");
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401 });
    }

    const baseUrl = getApiBaseUrl();
    const isRelative = baseUrl.startsWith("/");
    const fetchUrl = isRelative
      ? new URL(`${baseUrl}/auth/refresh`, request.url).toString()
      : `${baseUrl}/auth/refresh`;

    const backendResponse = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      // Refresh failed (e.g. token expired/invalidated). Delete the cookie.
      cookieStore.delete("refreshToken");
      return NextResponse.json(data, { status: backendResponse.status });
    }

    if (data.success && data.data) {
      const { refreshToken: newRefreshToken, accessToken } = data.data;

      if (newRefreshToken) {
        const isHttps =
          request.headers.get("x-forwarded-proto") === "https" ||
          request.url.startsWith("https://") ||
          process.env.SECURE_COOKIE === "true";

        cookieStore.set({
          name: "refreshToken",
          value: newRefreshToken,
          httpOnly: true,
          secure: isHttps,
          path: "/",
          sameSite: "lax",
        });
      }

      return NextResponse.json({
        success: true,
        data: { accessToken },
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Refresh Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

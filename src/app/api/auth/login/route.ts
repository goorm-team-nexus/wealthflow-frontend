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
    const body = await request.json();

    const baseUrl = getApiBaseUrl();
    // Construct absolute URL for server-side fetch.
    // If the API base URL is relative (e.g. /api/v1), we need to ensure it's absolute,
    // or assume the backend is hosted elsewhere. Typically NEXT_PUBLIC_API_URL is absolute.
    // If not, this might fail in server environment. We'll attempt to construct it based on request URL if it starts with /
    const isRelative = baseUrl.startsWith("/");
    const fetchUrl = isRelative
      ? new URL(`${baseUrl}/auth/login`, request.url).toString()
      : `${baseUrl}/auth/login`;

    const backendResponse = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // backend response matches ApiResponseTokenResponse: { success: boolean, data: { accessToken, refreshToken } }
    if (data.success && data.data) {
      const { refreshToken, accessToken } = data.data;

      // Set cookie for refreshToken
      if (refreshToken) {
        // Determine if secure cookie should be used.
        // 1. x-forwarded-proto: Set by reverse proxies (ALB, Nginx, Ingress)
        // 2. request.url: Fallback for direct HTTPS access
        // 3. SECURE_COOKIE: Explicit override environment variable
        const isHttps =
          request.headers.get("x-forwarded-proto") === "https" ||
          request.url.startsWith("https://") ||
          process.env.SECURE_COOKIE === "true";

        const cookieStore = await cookies();
        cookieStore.set({
          name: "refreshToken",
          value: refreshToken,
          httpOnly: true,
          secure: isHttps,
          path: "/",
          sameSite: "lax",
          // Optional: set maxAge based on token validity
        });
      }

      // Return accessToken to client
      return NextResponse.json({
        success: true,
        data: { accessToken },
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

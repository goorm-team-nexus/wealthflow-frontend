import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      // If no refresh token is present, we consider logout already complete locally.
      return NextResponse.json({ success: true, message: "Already logged out" }, { status: 200 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://d3uib3r331utfe.cloudfront.net/api/v1";
    const isRelative = baseUrl.startsWith("/");
    const fetchUrl = isRelative
      ? new URL(`${baseUrl}/auth/logout`, request.url).toString()
      : `${baseUrl}/auth/logout`;

    // Attempt to notify backend to invalidate token family
    try {
      await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.warn("Backend logout notification failed, but proceeding to clear local cookie", e);
    }

    // Always clear the cookie
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true, message: "Logged out" }, { status: 200 });
  } catch (error) {
    console.error("Logout Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

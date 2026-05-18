let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const DEFAULT_DEV_API_BASE_URL = "https://d3uib3r331utfe.cloudfront.net/api/v1";

const getPublicApiBaseUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "development" ? DEFAULT_DEV_API_BASE_URL : undefined);

  if (!baseUrl) {
    throw new ApiError(500, "API base URL is not configured.");
  }

  return baseUrl.replace(/\/$/, "");
};

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
  isExternal = false,
): Promise<T> {
  // URL 조합 (isExternal이 true면 내부 Next.js API 등 프록시 경로 사용)
  const url = isExternal ? endpoint : `${getPublicApiBaseUrl()}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized using Token Refresh Queue
  if (response.status === 401 && !isExternal) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch("/auth-proxy/refresh", { method: "POST" });
        const refreshData = await refreshResponse.json();

        if (refreshData.success && refreshData.data?.accessToken) {
          setAccessToken(refreshData.data.accessToken);
          onRefreshed(refreshData.data.accessToken);
        } else {
          clearAccessToken();
          onRefreshed("");
          // 토큰 갱신 완전 실패 시 로그인 페이지로 강제 이동
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } catch {
        clearAccessToken();
        onRefreshed("");
      } finally {
        isRefreshing = false;
      }
    }

    // Wait for the refresh to complete
    const newToken = await new Promise<string>((resolve) => {
      addRefreshSubscriber(resolve);
    });

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      // Retry the original request
      response = await fetch(url, { ...options, headers });
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    throw new ApiError(
      response.status,
      errorData?.message || `API request failed with status ${response.status}`,
      errorData,
    );
  }

  // No content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

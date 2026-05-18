"use client";

import { useEffect, useState } from "react";
import { getAccessToken, setAccessToken } from "@/lib/api-client";
import { refresh } from "@/services/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // 만약 메모리에 토큰이 없다면 (최초 진입 또는 새로고침)
      if (!getAccessToken()) {
        try {
          const res = await refresh();
          if (res.success && res.data?.accessToken) {
            setAccessToken(res.data.accessToken);
          }
        } catch (error) {
          // 리프레시 실패 (로그인되지 않은 상태)
          console.debug("Silent auth refresh failed:", error);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // 렌더링 블로킹 여부 결정 (isInitializing 동안 로딩 화면을 보여줄 수 있음)
  // 여기서는 부드러운 전환을 위해 빈 화면 처리 대신 children을 렌더링할 수도 있지만,
  // 권한이 필요한 페이지의 깜빡임 방지를 위해 로딩 처리가 권장됨.
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* 간단한 로딩 표시 */}
        <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}

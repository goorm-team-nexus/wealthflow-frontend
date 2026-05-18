"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { clearAccessToken } from "@/lib/api-client";
import { logout } from "@/services/auth";

const LOGOUT_ERROR_MESSAGE = "로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.";

export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const response = await logout();

      if (response.success === false) {
        setLogoutError(LOGOUT_ERROR_MESSAGE);
        return;
      }

      clearAccessToken();
      router.replace("/login");
    } catch {
      setLogoutError(LOGOUT_ERROR_MESSAGE);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  return {
    handleLogout,
    isLoggingOut,
    logoutError,
  };
}

"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { getAccessToken, setAccessToken } from "@/lib/api-client";
import { refresh } from "@/services/auth";
import { getMyPage, getAvatarSrc } from "@/services/user";

interface UserProfile {
  name: string;
  avatarSrc: string | null;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  refreshUserProfile: async () => {},
  isInitializing: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    try {
      const res = await getMyPage();
      if (res.success && res.data) {
        const resolvedAvatar = getAvatarSrc(res.data.avatarPresetId);
        const avatarSrc = resolvedAvatar && resolvedAvatar !== "default" ? resolvedAvatar : null;
        setUserProfile({
          name: res.data.name || "사용자",
          avatarSrc,
        });
        if (avatarSrc) {
          localStorage.setItem("wealthflow_profile_avatar", avatarSrc);
        } else {
          localStorage.removeItem("wealthflow_profile_avatar");
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.debug("Failed to fetch user profile:", error);
      setUserProfile(null);
    }
  };

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

      // 토큰이 존재하는 경우에만 프로필 조회
      if (getAccessToken()) {
        await fetchUserProfile();
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const refreshUserProfile = async () => {
    if (getAccessToken()) {
      await fetchUserProfile();
    }
  };

  return (
    <AuthContext.Provider value={{ userProfile, refreshUserProfile, isInitializing }}>
      {isInitializing ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

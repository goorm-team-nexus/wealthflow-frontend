"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setAccessToken } from "@/lib/api-client";
import { login } from "@/services/auth";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(() =>
    searchParams.get("authError") === "kakao"
      ? "카카오 로그인에 실패했습니다. 다시 시도해주세요."
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await login({ email, password });

      if (res.success && res.data?.accessToken) {
        // Save token to memory
        setAccessToken(res.data.accessToken);
        // Redirect to stocks
        router.push("/stocks");
      } else {
        setErrorMsg("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message || "로그인 중 오류가 발생했습니다.");
      } else {
        setErrorMsg("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:bg-muted">
      <div className="w-full max-w-100">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 border-b border-border pb-6">
              <h1 className="text-2xl font-bold text-foreground">WealthFlow</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                모의투자로 투자 감각을 키워보세요
              </p>
            </div>

            <h2 className="mb-6 text-lg font-semibold text-foreground">로그인</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  이메일
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  비밀번호
                </label>
                <Input
                  className="col-span-2"
                  type="password"
                  id="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Link
                  href="/find-pw"
                  className="col-start-2 row-start-1 justify-self-end text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  비밀번호 찾기
                </Link>
              </div>

              {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

              <div className="space-y-3 pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>

              {/* Kakao - provider color exception */}
              <a
                href="/oauth/kakao/start"
                className="flex w-full items-center justify-center gap-2 bg-[#FEE500] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#FDD800]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 2C4.029 2 0 5.166 0 9.071C0 11.597 1.614 13.805 4.093 15.068L3.219 18.291C3.155 18.528 3.424 18.711 3.626 18.577L7.494 15.992C7.981 16.096 8.483 16.143 9 16.143C13.971 16.143 18 12.978 18 9.071C18 5.166 13.971 2 9 2Z"
                    fill="#000000"
                  />
                </svg>
                카카오 로그인
              </a>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}

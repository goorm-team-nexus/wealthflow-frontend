"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { confirmPasswordReset } from "@/services/auth";

function isValidPassword(value: string) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/.test(value);
}

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasToken = token.length > 0;
  const isSuccess = successMsg.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!hasToken) {
      setErrorMsg("비밀번호 재설정 링크가 유효하지 않습니다.");
      return;
    }

    if (!password || !passwordConfirm) {
      setErrorMsg("새 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMsg("비밀번호는 영문, 숫자, 특수문자 조합으로 9자리 이상 입력하세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await confirmPasswordReset({ token, newPassword: password });

      if (res.success) {
        setSuccessMsg("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
        setPassword("");
        setPasswordConfirm("");
      } else {
        setErrorMsg("비밀번호를 변경하지 못했습니다. 링크를 다시 확인해주세요.");
      }
    } catch {
      setErrorMsg("비밀번호를 변경하지 못했습니다. 링크를 다시 확인하거나 새 메일을 요청해주세요.");
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

            <h2 className="mb-6 text-lg font-semibold text-foreground">비밀번호 재설정</h2>

            {!hasToken ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  비밀번호 재설정 링크가 유효하지 않습니다. 이메일을 다시 요청해주세요.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/find-pw">재설정 메일 다시 받기</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full">
                  <Link href="/login">로그인으로 돌아가기</Link>
                </Button>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{successMsg}</p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/login">로그인하기</Link>
                </Button>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    새 비밀번호
                  </label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="새 비밀번호 입력"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!errorMsg}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    비밀번호는 영문, 숫자, 특수문자 조합으로 9자리 이상 입력하세요.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-medium text-foreground"
                  >
                    새 비밀번호 확인
                  </label>
                  <Input
                    type="password"
                    id="passwordConfirm"
                    placeholder="새 비밀번호 다시 입력"
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!errorMsg}
                  />
                </div>

                {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </div>

                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Link href="/login">로그인으로 돌아가기</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}

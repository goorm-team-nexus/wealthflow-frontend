"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { requestPasswordReset } from "@/services/auth";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPasswordResetRequestAccepted(success?: boolean) {
  return success !== false;
}

type StatusMessageProps = {
  message: string;
  variant: "error" | "success";
};

function StatusMessage({ message, variant }: StatusMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "whitespace-pre-line rounded-lg border px-3 py-2 text-sm leading-relaxed",
        variant === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-muted text-foreground",
      )}
    >
      {message}
    </div>
  );
}

export default function FindPassword() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMsg("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMsg("올바른 이메일 형식으로 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await requestPasswordReset({ email: trimmedEmail });

      if (isPasswordResetRequestAccepted(res.success)) {
        setSuccessMsg("입력하신 이메일로 재설정 안내가 발송되었습니다.\n메일함을 확인해주세요.");
      } else {
        setErrorMsg("메일 발송 요청을 처리하지 못했습니다.\n잠시 후 다시 시도해주세요.");
      }
    } catch {
      setErrorMsg("메일 발송 요청을 처리하지 못했습니다.\n잠시 후 다시 시도해주세요.");
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

            <h2 className="mb-8 text-lg font-semibold text-foreground">비밀번호 찾기</h2>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  이메일
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="이메일 주소 입력"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isLoading}
                  aria-invalid={!!errorMsg}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  가입한 이메일 주소로 비밀번호 재설정 안내를 보내드립니다.
                </p>
              </div>

              {errorMsg && <StatusMessage message={errorMsg} variant="error" />}
              {successMsg && <StatusMessage message={successMsg} variant="success" />}

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "발송 중..." : "이메일 보내기"}
                </Button>
              </div>

              <Button asChild variant="secondary" className="w-full" disabled={isLoading}>
                <Link href="/login">로그인으로 돌아가기</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

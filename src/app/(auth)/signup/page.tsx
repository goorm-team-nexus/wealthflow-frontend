"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUp } from "@/services/auth";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validate password: 9 chars minimum, must contain letters, numbers, and special chars
  const validatePassword = (pwd: string) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{9,}$/;
    return passwordRegex.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !passwordConfirm) {
      setErrorMsg("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMsg("비밀번호는 영문, 숫자, 특수문자 조합으로 9자리 이상 입력하세요.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signUp({ name, email, password });

      if (res.success) {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      } else {
        setErrorMsg("회원가입에 실패했습니다.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message || "회원가입 중 오류가 발생했습니다.");
      } else {
        setErrorMsg("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:bg-muted">
      <div className="w-full max-w-[400px]">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 border-b border-border pb-6">
              <h1 className="text-2xl font-bold text-foreground">WealthFlow</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                모든 자산을 WealthFlow로 한번에 관리하세요
              </p>
            </div>

            <h2 className="mb-6 text-lg font-semibold text-foreground">회원가입</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  이름
                </label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  이메일
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="xxxx@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex justify-end pt-1">
                  <Button type="button" size="sm" variant="outline" disabled={isLoading}>
                    인증요청
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  비밀번호
                </label>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  비밀번호는 영문, 숫자, 특수문자 조합으로 9자리 이상 입력하세요.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-medium text-foreground"
                >
                  비밀번호 재입력
                </label>
                <Input
                  type="password"
                  id="passwordConfirm"
                  placeholder="********"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "처리 중..." : "회원가입"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

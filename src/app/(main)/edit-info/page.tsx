"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";

export default function EditInfo() {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("wealthflow_profile_avatar");
    if (savedAvatar && savedAvatar !== "default") {
      setAvatarSrc(savedAvatar);
    }
  }, []);
  return (
    <div className="w-full p-4">
      <Card>
        <CardContent className="flex flex-col gap-6 p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">내 정보 수정</h2>
            <Link href="/profile" className="shrink-0">
              <Avatar className="size-16 cursor-pointer transition-transform hover:scale-105 shadow-sm ring-1 ring-border border">
                {avatarSrc ? (
                  <AvatarImage src={avatarSrc} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <CircleUserRound className="size-10" />
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                이름
              </label>
              <Input type="text" id="name" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호 변경
              </label>
              <Input type="password" id="password" placeholder="********" />
              <p className="text-xs text-destructive">
                비밀번호는 영문, 숫자, 특수문자 조합으로 9자리를 입력하세요
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirm" className="text-sm font-medium">
                비밀번호 재입력
              </label>
              <Input type="password" id="passwordConfirm" placeholder="********" />
              <p className="text-xs text-destructive">비밀번호가 다릅니다</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input id="email" value="xxxx@gmail.com" readOnly disabled />
            </div>

            <Button type="button" className="w-full">
              변경
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUserRound } from "lucide-react";
import { getMyPage, updateProfile, getAvatarSrc } from "@/services/user";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditInfo() {
  const router = useRouter();
  const { refreshUserProfile } = useAuth();
  const [avatarPresetId, setAvatarPresetId] = useState<number>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    isSuccess: false,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getMyPage();
        if (res.success && res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          if (res.data.avatarPresetId) {
            setAvatarPresetId(res.data.avatarPresetId);
          }
        } else {
          setError(res.message || "사용자 정보를 불러오는 데 실패했습니다.");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "사용자 정보를 불러오는 데 실패했습니다.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const isPasswordLengthInvalid = password.length > 0 && password.length < 9;
  const isPasswordConfirmInvalid = passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleUpdate = async () => {
    if (!name.trim()) {
      setModalContent({
        title: "변경 실패",
        description: "이름을 입력해주세요.",
        isSuccess: false,
      });
      setIsModalOpen(true);
      return;
    }

    if (currentPassword || password || passwordConfirm) {
      if (!currentPassword) {
        setModalContent({
          title: "변경 실패",
          description: "현재 비밀번호를 입력해주세요.",
          isSuccess: false,
        });
        setIsModalOpen(true);
        return;
      }
      if (!password) {
        setModalContent({
          title: "변경 실패",
          description: "변경할 새 비밀번호를 입력해주세요.",
          isSuccess: false,
        });
        setIsModalOpen(true);
        return;
      }
      if (password.length < 9) {
        setModalContent({
          title: "변경 실패",
          description: "비밀번호는 9자리 이상이어야 합니다.",
          isSuccess: false,
        });
        setIsModalOpen(true);
        return;
      }
      if (!passwordConfirm) {
        setModalContent({
          title: "변경 실패",
          description: "새 비밀번호 재입력을 입력해주세요.",
          isSuccess: false,
        });
        setIsModalOpen(true);
        return;
      }
      if (password !== passwordConfirm) {
        setModalContent({
          title: "변경 실패",
          description: "비밀번호가 일치하지 않습니다.",
          isSuccess: false,
        });
        setIsModalOpen(true);
        return;
      }
    }

    setIsUpdating(true);
    try {
      const res = await updateProfile({
        name,
        avatarPresetId,
        ...(password
          ? {
              currentPassword,
              newPassword: password,
              newPasswordConfirm: passwordConfirm,
            }
          : {}),
      });

      if (res.success) {
        await refreshUserProfile();
        setModalContent({
          title: "변경 완료",
          description: "회원 정보가 성공적으로 수정되었습니다.",
          isSuccess: true,
        });
        setIsModalOpen(true);
      } else {
        setModalContent({
          title: "변경 실패",
          description: res.message || "정보 수정에 실패했습니다.",
          isSuccess: false,
        });
        setIsModalOpen(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "정보 수정에 실패했습니다.";
      setModalContent({ title: "변경 실패", description: msg, isSuccess: false });
      setIsModalOpen(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalContent.isSuccess) {
      router.push("/my-page");
    }
  };

  if (isLoading) {
    return <EditInfoSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  const resolvedAvatar =
    getAvatarSrc(avatarPresetId) || localStorage.getItem("wealthflow_profile_avatar");
  const avatarSrc = resolvedAvatar && resolvedAvatar !== "default" ? resolvedAvatar : null;

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

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            {/* 기본 정보 그룹 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  이름
                </label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    이메일
                  </label>
                  {email.toLowerCase().endsWith("@kakao.com") && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE500] px-2 py-0.5 text-[10px] font-bold text-[#191919]">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current text-[#191919]">
                        <path d="M12 3c-5.52 0-10 3.58-10 8 0 2.92 2 5.47 5 6.9L6 21c-.13.52.19.57.4.43l3.6-2.4c.67.1 1.37.17 2 .17 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                      </svg>
                      카카오 계정
                    </span>
                  )}
                </div>
                <Input id="email" value={email} readOnly disabled />
              </div>
            </div>

            {/* 구분선 */}
            <hr className="border-t border-border" />

            {/* 비밀번호 변경 그룹 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-muted-foreground">비밀번호 변경</h3>

              <div className="flex flex-col gap-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  현재 비밀번호
                </label>
                <Input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  새 비밀번호
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isPasswordLengthInvalid && (
                  <p className="text-xs text-destructive animate-in fade-in duration-300">
                    비밀번호는 영문, 숫자, 특수문자 조합으로 9자리 이상이어야 합니다.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="passwordConfirm" className="text-sm font-medium">
                  새 비밀번호 재입력
                </label>
                <Input
                  type="password"
                  id="passwordConfirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                {isPasswordConfirmInvalid && (
                  <p className="text-xs text-destructive animate-in fade-in duration-300">
                    비밀번호가 다릅니다
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isUpdating}>
              {isUpdating ? "변경 중..." : "변경"}
            </Button>
          </form>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-xs" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-center">
                  {modalContent.title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-sm text-center py-4 text-foreground break-keep">
                {modalContent.description}
              </DialogDescription>
              <div className="flex justify-center mt-2">
                <Button className="w-24" onClick={handleModalClose}>
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

function EditInfoSkeleton() {
  return (
    <div className="w-full p-4">
      <Card>
        <CardContent className="flex flex-col gap-6 p-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="size-16 shrink-0 rounded-full" />
          </div>

          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}

            <div className="flex flex-col gap-2 pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

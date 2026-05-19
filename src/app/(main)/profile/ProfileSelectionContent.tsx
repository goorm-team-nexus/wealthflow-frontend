"use client";

import { useState, useEffect } from "react";
import { CircleUser, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMyPage, updateProfile, AVATAR_PRESETS } from "@/services/user";

export default function ProfileSelectionContent() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("purple");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [userName, setUserName] = useState("사용자");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getMyPage();
        const data = res.data;
        if (res.success && data) {
          setUserName(data.name || "사용자");
          if (data.avatarPresetId) {
            const found = AVATAR_PRESETS.find((a) => a.id === data.avatarPresetId);
            if (found) {
              setSelectedAvatar(found.key);
            }
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load user info:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const currentAvatarSrc = AVATAR_PRESETS.find((a) => a.key === selectedAvatar)?.src;

  const handleSave = () => {
    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaveDialogOpen(false);
    setIsLoading(true);
    try {
      const preset = AVATAR_PRESETS.find((a) => a.key === selectedAvatar);
      const presetId = preset ? preset.id : 1;

      const res = await updateProfile({
        name: userName,
        avatarPresetId: presetId,
      });

      if (res.success) {
        const src = preset?.src || "default";
        localStorage.setItem("wealthflow_profile_avatar", src);
        router.push("/my-page");
      } else {
        alert(res.message || "프로필 저장에 실패했습니다.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "프로필 저장에 실패했습니다.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await updateProfile({
        name: userName,
        avatarPresetId: 1, // Reset to purple
      });
      if (res.success) {
        setSelectedAvatar("purple");
        localStorage.setItem("wealthflow_profile_avatar", AVATAR_PRESETS[0].src);
        alert("프로필이 초기화되었습니다.");
      } else {
        alert(res.message || "프로필 삭제에 실패했습니다.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "프로필 삭제에 실패했습니다.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 p-4">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 p-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Avatar className="size-20 shadow-sm ring-1 ring-border">
        <AvatarImage src={currentAvatarSrc} alt="Selected profile" />
        <AvatarFallback>
          <CircleUser className="size-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <h2 className="text-2xl font-bold text-foreground">프로필 선택</h2>

      <div className="grid w-full grid-cols-3 gap-6">
        {AVATAR_PRESETS.map((avatar) => (
          <div
            key={avatar.id}
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={() => setSelectedAvatar(avatar.key)}
          >
            <Avatar
              className={`aspect-square w-full h-auto border-2 transition-all duration-300 ${
                selectedAvatar === avatar.key
                  ? "scale-110 border-primary shadow-sm ring-4 ring-primary/10"
                  : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <AvatarImage src={avatar.src} alt={`Avatar ${avatar.key}`} />
              <AvatarFallback>{avatar.key[0]}</AvatarFallback>
            </Avatar>
            {selectedAvatar === avatar.key && (
              <div className="absolute -right-1 -top-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm animate-in zoom-in duration-300">
                <Check className="size-4 stroke-[4px]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 pt-4">
        <Button type="button" className="w-full" onClick={handleSave}>
          프로필 저장
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={handleDelete}>
          프로필 삭제
        </Button>
      </div>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[320px] rounded-2xl">
          <DialogHeader className="pt-2">
            <DialogTitle className="text-center text-lg">알림</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              프로필이 성공적으로 저장되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-2">
            <Button onClick={handleConfirmSave} className="w-full">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

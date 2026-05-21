"use client";

import { useState, useEffect } from "react";
import { CircleUser, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBox } from "@/components/shared/message-box";
import { getMyPage, updateProfile, AVATAR_PRESETS } from "@/services/user";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProfileSelectionContent() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("purple");
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({ title: "", message: "" });
  const [userName, setUserName] = useState("사용자");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { refreshUserProfile } = useAuth();

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

  const showMessageBox = (title: string, message: string) => {
    setMessageBoxContent({ title, message });
    setIsMessageBoxOpen(true);
  };

  const handleSave = async () => {
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
        await refreshUserProfile();
        router.push("/my-page");
      } else {
        showMessageBox(
          "저장 실패",
          res.message || "프로필 저장에 실패했습니다.\n잠시 후 다시 시도해주세요.",
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "프로필 저장에 실패했습니다.\n잠시 후 다시 시도해주세요.";
      showMessageBox("저장 실패", msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ProfileSelectionSkeleton />;
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
      </div>

      <MessageBox
        isOpen={isMessageBoxOpen}
        onClose={() => setIsMessageBoxOpen(false)}
        title={messageBoxContent.title}
        message={messageBoxContent.message}
        onConfirm={() => setIsMessageBoxOpen(false)}
      />
    </div>
  );
}

function ProfileSelectionSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-8 p-4 pt-8">
      <Skeleton className="size-20 rounded-full" />
      <Skeleton className="h-8 w-28" />

      <div className="grid w-full grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-full" />
        ))}
      </div>

      <div className="flex w-full flex-col gap-2 pt-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

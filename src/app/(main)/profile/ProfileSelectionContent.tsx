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

const AVATARS = [
  { id: "purple", src: "/profiles/avatar_purple.png" },
  { id: "green", src: "/profiles/avatar_green.png" },
  { id: "yellow", src: "/profiles/avatar_yellow.png" },
  { id: "red", src: "/profiles/avatar_red.png" },
  { id: "blue", src: "/profiles/avatar_blue.png" },
  { id: "pink", src: "/profiles/avatar_pink.png" },
];

export default function ProfileSelectionContent() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("default");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("wealthflow_profile_avatar");
    if (saved && saved !== "default") {
      const found = AVATARS.find((a) => a.src === saved);
      if (found) {
        setTimeout(() => {
          setSelectedAvatar(found.id);
        }, 0);
      }
    }
  }, []);

  const currentAvatarSrc = AVATARS.find((a) => a.id === selectedAvatar)?.src;

  const handleSave = () => {
    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (selectedAvatar === "default") {
      localStorage.setItem("wealthflow_profile_avatar", "default");
    } else {
      const src = AVATARS.find((a) => a.id === selectedAvatar)?.src || "default";
      localStorage.setItem("wealthflow_profile_avatar", src);
    }
    setIsSaveDialogOpen(false);
    router.push("/my-page");
  };

  const handleDelete = () => {
    setSelectedAvatar("default");
    localStorage.setItem("wealthflow_profile_avatar", "default");
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 p-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {selectedAvatar === "default" ? (
        <Button
          type="button"
          size="icon-lg"
          className="size-20 rounded-full cursor-default hover:bg-primary"
        >
          <CircleUser className="size-10" />
        </Button>
      ) : (
        <Avatar className="size-20 shadow-sm ring-1 ring-border">
          <AvatarImage src={currentAvatarSrc} alt="Selected profile" />
          <AvatarFallback>
            <CircleUser className="size-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}

      <h2 className="text-2xl font-bold text-foreground">프로필 선택</h2>

      <div className="grid w-full grid-cols-3 gap-6">
        {AVATARS.map((avatar) => (
          <div
            key={avatar.id}
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={() => setSelectedAvatar(avatar.id)}
          >
            <Avatar
              className={`aspect-square w-full h-auto border-2 transition-all duration-300 ${
                selectedAvatar === avatar.id
                  ? "scale-110 border-primary shadow-sm ring-4 ring-primary/10"
                  : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <AvatarImage src={avatar.src} alt={`Avatar ${avatar.id}`} />
              <AvatarFallback>{avatar.id[0]}</AvatarFallback>
            </Avatar>
            {selectedAvatar === avatar.id && (
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

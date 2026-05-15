"use client";

import { useState } from "react";
import { Upload, Check } from "lucide-react";
import Image from "next/image";

const AVATARS = [
  { id: "purple", src: "/profiles/avatar_purple.png" },
  { id: "green", src: "/profiles/avatar_green.png" },
  { id: "yellow", src: "/profiles/avatar_yellow.png" },
  { id: "red", src: "/profiles/avatar_red.png" },
  { id: "blue", src: "/profiles/avatar_blue.png" },
  { id: "pink", src: "/profiles/avatar_pink.png" },
];

export default function ProfileSelectionContent() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("purple");

  return (
    <div className="flex w-full flex-col items-center gap-8 p-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Upload Button */}
      <button className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95">
        <Upload className="w-10 h-10 text-white" />
      </button>

      <h2 className="text-2xl font-bold text-foreground">프로필 선택</h2>

      {/* Avatar Grid */}
      <div className="grid w-full grid-cols-3 gap-6">
        {AVATARS.map((avatar) => (
          <div
            key={avatar.id}
            className="relative cursor-pointer group flex flex-col items-center"
            onClick={() => setSelectedAvatar(avatar.id)}
          >
            <div
              className={`aspect-square rounded-full overflow-hidden border-2 transition-all duration-300 ${
                selectedAvatar === avatar.id
                  ? "border-[#171717] scale-110 shadow-lg ring-4 ring-[#171717]/10"
                  : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <Image
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>
            {selectedAvatar === avatar.id && (
              <div className="absolute -top-1 -right-1 bg-[#171717] rounded-full p-1.5 shadow-md animate-in zoom-in duration-300">
                <Check className="w-4 h-4 text-white stroke-[4px]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Profile Button */}
      <button className="text-[15px] font-semibold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider">
        프로필 삭제
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Upload, Check, Bell } from "lucide-react";
import { TabBar } from "@/components/shared/TabBar";
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a]">WealthFlow</h1>
        <button className="p-1 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-7 h-7" />
        </button>
      </header>

      <main className="flex-1 px-6 pt-12 pb-28 flex flex-col items-center max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Upload Button */}
        <button className="w-20 h-20 bg-[#171717] rounded-full flex items-center justify-center mb-8 shadow-xl hover:scale-105 active:scale-95 transition-all">
          <Upload className="w-10 h-10 text-white" />
        </button>

        <h2 className="text-[32px] font-bold text-gray-900 mb-10 tracking-tight">프로필 선택</h2>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-6 w-full mb-12">
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
      </main>

      <TabBar />
    </div>
  );
}

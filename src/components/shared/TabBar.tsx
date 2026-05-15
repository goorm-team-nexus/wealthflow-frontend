"use client";

import { Heart, LineChart, Menu, PieChart, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FullMenuPopup } from "./FullMenuPopup";

export const tabLabels = {
  menu: "menu",
  market: "market",
  watchlist: "watchlist",
  portfolio: "portfolio",
  ranking: "ranking",
} as const;

export function TabBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const tabs = [
    { id: "menu", label: "메뉴", icon: Menu, href: null },
    { id: "market", label: "시장/거래", icon: LineChart, href: "#" },
    { id: "watchlist", label: "관심 종목", icon: Heart, href: "#" },
    { id: "portfolio", label: "포트폴리오", icon: PieChart, href: "/portfolio" },
    { id: "ranking", label: "랭킹", icon: Trophy, href: "/ranking" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-[64px] px-2 gap-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] max-w-[500px] mx-auto z-[100]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // menu는 팝업 상태에 따라, 나머지는 pathname에 따라 활성화
          const isActive = (tab.id === "menu" && isMenuOpen) || (tab.href && pathname === tab.href);

          const content = (
            <div className="flex flex-col items-center justify-center gap-1 transition-all duration-300">
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-300 ${
                  isActive ? "text-blue-600" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {tab.label}
              </span>
            </div>
          );

          return (
            <div key={tab.id} className="flex-1 group">
              {tab.id === "menu" ? (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-transform"
                >
                  {content}
                </button>
              ) : (
                <Link
                  href={tab.href || "#"}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-transform"
                >
                  {content}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <FullMenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

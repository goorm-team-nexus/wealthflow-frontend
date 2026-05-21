"use client";

import { Heart, LineChart, Menu, PieChart, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { FullMenuPopup } from "./FullMenuPopup";

export const tabLabels = {
  menu: "menu",
  market: "market",
  watchlist: "watchlist",
  portfolio: "portfolio",
  ranking: "ranking",
} as const;

export function TabBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: "menu", label: "메뉴", icon: Menu, href: null },
    { id: "market", label: "시장/거래", icon: LineChart, href: "/stocks" },
    { id: "watchlist", label: "관심 종목", icon: Heart, href: "/favorites" },
    { id: "portfolio", label: "포트폴리오", icon: PieChart, href: "/portfolio" },
    { id: "ranking", label: "랭킹", icon: Trophy, href: "/ranking" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-[101] flex h-16 w-full max-w-[500px] -translate-x-1/2 items-center justify-around border-x border-t border-border bg-background">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.href ? pathname.startsWith(tab.href) : isMenuOpen;
          const itemClassName = `flex h-full flex-1 flex-col items-center justify-center rounded-none p-0 shadow-none group ${
            isActive
              ? "bg-muted text-foreground font-semibold"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`;

          return (
            <React.Fragment key={tab.id}>
              {tab.id === "menu" ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsMenuOpen((prev) => !prev);
                  }}
                  className={itemClassName}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 mb-1 group-hover:scale-110" />
                  <span className="text-xs leading-none inline-block origin-center group-hover:scale-110">
                    {tab.label}
                  </span>
                </Button>
              ) : (
                <Link
                  href={tab.href ?? "/"}
                  className={itemClassName}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mb-1 group-hover:scale-110" />
                  <span className="text-xs leading-none inline-block origin-center group-hover:scale-110">
                    {tab.label}
                  </span>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <FullMenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

"use client";

import { Heart, LineChart, Menu, PieChart, Trophy } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FullMenuPopup } from "./FullMenuPopup";

export function TabBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");

  const tabs = [
    { id: "menu", label: "메뉴", icon: Menu },
    { id: "market", label: "시장/거래", icon: LineChart },
    { id: "watchlist", label: "관심 종목", icon: Heart },
    { id: "portfolio", label: "포트폴리오", icon: PieChart },
    { id: "ranking", label: "랭킹", icon: Trophy },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
        <div className="max-w-md mx-auto flex justify-around items-center h-[50px] px-2 gap-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab || (tab.id === "menu" && isMenuOpen);

            return (
              <React.Fragment key={tab.id}>
                {tab.id === "menu" ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(true);
                      setActiveTab("menu");
                    }}
                    className={`flex flex-col items-center pt-1.5 w-16 h-[44px] rounded-lg cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-muted text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] leading-none">{tab.label}</span>
                  </button>
                ) : (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }}
                    className={`flex flex-col items-center pt-1.5 w-16 h-[44px] rounded-lg cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-muted text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner"
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] leading-none">{tab.label}</span>
                  </Link>
                )}
                {index < tabs.length - 1 && <div className="w-px h-5 bg-border shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <FullMenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

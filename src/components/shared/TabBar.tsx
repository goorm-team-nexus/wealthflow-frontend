"use client";

import { Heart, LineChart, Menu, PieChart, Trophy } from "lucide-react";
import Link from "next/link";

export function TabBar() {
  // Hardcoded active tab for demonstration to match the image
  const activeTab = "menu";

  const tabs = [
    { id: "menu", label: "메뉴", icon: Menu },
    { id: "market", label: "시장/거래", icon: LineChart },
    { id: "watchlist", label: "관심 종목", icon: Heart },
    { id: "portfolio", label: "포트폴리오", icon: PieChart },
    { id: "ranking", label: "랭킹", icon: Trophy },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <Link
              key={tab.id}
              href="#"
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
                isActive
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

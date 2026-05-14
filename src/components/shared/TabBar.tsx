"use client";

import { Heart, LineChart, Menu, PieChart, Trophy } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FullMenuPopup } from "./FullMenuPopup";

export function TabBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");

  type TabBarProps = {
    selectedTab: string;
    onSelectTab: (tab: string) => void;
  };

  return (
    <>
      <div className="w-full bg-white border-t border-border flex justify-around items-center h-[56px] px-2 gap-1 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] rounded-b-[1.5rem]">
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
                  className={`flex flex-col items-center pt-2 w-16 h-[50px] rounded-lg cursor-pointer transition-[transform,box-shadow] duration-100 ${
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
                  className={`flex flex-col items-center pt-2 w-16 h-[50px] rounded-lg cursor-pointer transition-[transform,box-shadow] duration-100 ${
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

      <FullMenuPopup isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

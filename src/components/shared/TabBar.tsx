"use client";

import { ChartNoAxesColumnIncreasing, Clock3, Heart, Menu, Trophy } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type NavigationItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type TabBarProps = {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
};

export const tabLabels = {
  menu: "\uba54\ub274",
  marketTrade: "\uc2dc\uc7a5/\uac70\ub798",
  favorites: "\uad00\uc2ec \uc885\ubaa9",
  portfolio: "\ud3ec\ud2b8\ud3f4\ub9ac\uc624",
  ranking: "\ub7ad\ud0b9",
} as const;

const navigationItems: NavigationItem[] = [
  { label: tabLabels.menu, icon: Menu },
  { label: tabLabels.marketTrade, icon: ChartNoAxesColumnIncreasing },
  { label: tabLabels.favorites, icon: Heart },
  { label: tabLabels.portfolio, icon: Clock3 },
  { label: tabLabels.ranking, icon: Trophy },
];

export function TabBar({ selectedTab, onSelectTab }: TabBarProps) {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 border-t border-zinc-100 bg-white px-8 pb-4 pt-2"
      aria-label="Bottom navigation"
    >
      <div className="grid h-14 grid-cols-5 items-center">
        {navigationItems.map((navigationItem) => (
          <TabBarItem
            key={navigationItem.label}
            isSelected={selectedTab === navigationItem.label}
            icon={navigationItem.icon}
            label={navigationItem.label}
            onSelectTab={onSelectTab}
          />
        ))}
      </div>
    </nav>
  );
}

function TabBarItem({
  icon: Icon,
  isSelected,
  label,
  onSelectTab,
}: NavigationItem & {
  isSelected: boolean;
  onSelectTab: (tab: string) => void;
}) {
  return (
    <button
      type="button"
      className={`flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] transition-colors ${
        isSelected ? "bg-zinc-100 font-semibold text-zinc-950" : "font-semibold text-zinc-600"
      }`}
      aria-pressed={isSelected}
      onClick={() => onSelectTab(label)}
    >
      <Icon className="size-6 stroke-[2] text-current" aria-hidden="true" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

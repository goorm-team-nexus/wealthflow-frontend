"use client";

import { useState } from "react";
import {
  X,
  LineChart,
  ArrowLeftRight,
  Heart,
  History,
  Banknote,
  PieChart,
  Trophy,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/useLogout";
import { TradeActionDialog } from "./TradeActionDialog";

interface FullMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullMenuPopup({ isOpen, onClose }: FullMenuPopupProps) {
  const { handleLogout, isLoggingOut, logoutError } = useLogout();
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);

  const menuItems = [
    { icon: LineChart, label: "시장/거래", href: "/stocks" },
    {
      icon: ArrowLeftRight,
      label: "종목 구매/판매",
      onClick: () => {
        setIsTradeDialogOpen(true);
        onClose();
      },
    },
    { icon: Heart, label: "관심종목", href: "/favorites" },
    { icon: History, label: "거래내역", href: "#" },
    { icon: Banknote, label: "환전", href: "/exchange" },
    { icon: PieChart, label: "포트폴리오", href: "/portfolio" },
    { icon: Trophy, label: "랭킹", href: "/ranking" },
    { icon: User, label: "마이페이지", href: "/my-page" },
    { icon: Settings, label: "내 정보 수정", href: "/edit-info" },
  ];

  if (!isOpen && !isTradeDialogOpen) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-100"
            onClick={onClose}
          />

          {/* Popup Container (Side Drawer Style) */}
          <div className="fixed bottom-20 left-4 z-[102] flex h-fit max-h-[calc(100dvh-100px)] w-[calc(100%-32px)] max-w-[240px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg transition-transform duration-100 linear sm:left-[calc(50%-234px)]">
            {/* Header with Logo */}
            <div className="p-4 pb-0 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-xl bg-foreground">
                    <AvatarImage src="" alt="Logo" />
                    <AvatarFallback className="bg-transparent rounded-xl flex items-center justify-center">
                      <div className="w-5 h-5 bg-background rounded-sm" />
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-lg font-semibold">WealthFlow</h1>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="-mr-2 text-muted-foreground"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground ml-1">Menu</span>
              </div>
            </div>

            {/* Menu Items Area */}
            <div className="px-4 py-0">
              <Separator className="bg-border/50" />
              <div className="flex flex-col gap-0 pt-2">
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    onClick={item.onClick}
                  />
                ))}
              </div>
            </div>

            {/* Footer Profile Section */}
            <div>
              <Separator className="bg-border/50" />
              <div className="p-4">
                <button
                  type="button"
                  className="group -m-2 flex w-[calc(100%+16px)] cursor-pointer items-center justify-between rounded-xl p-2 text-left transition-all duration-150 hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 active:shadow-inner disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-xl bg-muted group-hover:bg-background transition-colors">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-transparent text-muted-foreground rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">사용자</span>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground">
                        {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 text-muted-foreground group-hover:text-foreground">
                    <LogOut className="w-5 h-5" />
                  </div>
                </button>
                {logoutError && <p className="mt-3 text-xs text-destructive">{logoutError}</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trade Action Dialog */}
      <TradeActionDialog isOpen={isTradeDialogOpen} onClose={() => setIsTradeDialogOpen(false)} />
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors shrink-0" />
      <span className="flex-1 text-sm font-medium text-left">{label}</span>
    </>
  );

  const className =
    "flex w-full items-center gap-3 px-3.5 py-2 rounded-xl text-foreground hover:bg-muted hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all duration-150 group cursor-pointer";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} type="button">
      {content}
    </button>
  );
}

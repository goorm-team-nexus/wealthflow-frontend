"use client";

import { useState } from "react";
import {
  X,
  LineChart,
  ArrowLeftRight,
  Heart,
  History,
  Banknote,
  ClipboardList,
  PieChart,
  Trophy,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/useLogout";
import { TradeActionDialog } from "./TradeActionDialog";
import { useAuth } from "@/components/providers/AuthProvider";
import mainLogo from "@/assets/images/logos/logo/mainlogo.webp";

interface FullMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullMenuPopup({ isOpen, onClose }: FullMenuPopupProps) {
  const { handleLogout, isLoggingOut, logoutError } = useLogout();
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const { userProfile } = useAuth();
  const avatarSrc = userProfile?.avatarSrc;
  const userName = userProfile?.name || "사용자";

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
    { icon: History, label: "거래내역", href: "/transactions" },
    { icon: Banknote, label: "환전", href: "/exchange" },
    { icon: ClipboardList, label: "환전 내역", href: "/exchange/history" },
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
                  <div className="size-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 relative border border-border/60">
                    <Image
                      src={mainLogo}
                      alt="WealthFlow Logo"
                      className="w-full h-full object-cover object-top scale-[1.3] origin-top"
                      priority
                    />
                  </div>
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
            <div className="py-0">
              <div className="px-4">
                <Separator className="bg-border/50" />
              </div>
              <div className="flex flex-col gap-0 pt-2">
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    onClick={item.onClick || onClose}
                  />
                ))}
              </div>
            </div>

            {/* Footer Profile Section */}
            <div>
              <div className="px-4">
                <Separator className="bg-border/50" />
              </div>
              <div className="py-2">
                <button
                  type="button"
                  className="group flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <Avatar className="w-7 h-7 rounded-full bg-muted group-hover:bg-background transition-colors border border-border/60">
                      {avatarSrc ? <AvatarImage src={avatarSrc} alt={userName} /> : null}
                      <AvatarFallback className="bg-transparent text-muted-foreground rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">{userName}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground">
                        {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 text-muted-foreground group-hover:text-foreground group-hover:scale-110">
                    <LogOut className="w-5 h-5" />
                  </div>
                </button>
                {logoutError && <p className="mt-3 px-4 text-xs text-destructive">{logoutError}</p>}
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
      <Icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground group-hover:scale-110 shrink-0" />
      <span className="flex-1 text-sm font-medium text-left group-hover:translate-x-1">
        {label}
      </span>
    </>
  );

  const className =
    "flex w-full items-center gap-3 px-4 py-2.5 rounded-none text-foreground hover:bg-muted group cursor-pointer";

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
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

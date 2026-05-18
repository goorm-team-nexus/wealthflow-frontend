import {
  X,
  LineChart,
  SlidersHorizontal,
  Heart,
  Activity,
  Smile,
  PieChart,
  Trophy,
  User,
  Settings,
  Bot,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface FullMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullMenuPopup({ isOpen, onClose }: FullMenuPopupProps) {
  const menuItems = [
    { icon: LineChart, label: "시장/거래", href: "/stocks" },
    { icon: SlidersHorizontal, label: "종목 팔기/사기", href: "/stocks" },
    { icon: Heart, label: "관심종목", href: "/favorites" },
    { icon: Activity, label: "거래내역", href: "/portfolio" },
    { icon: Smile, label: "환전", href: "/portfolio" },
    { icon: PieChart, label: "포트폴리오", href: "/portfolio" },
    { icon: Trophy, label: "랭킹", href: "/ranking" },
    { icon: User, label: "마이페이지", href: "/my-page" },
    { icon: Settings, label: "내 정보 수정", href: "/edit-info" },
    { icon: Bot, label: "문의하기", href: "/my-page" },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-100"
        onClick={onClose}
      />

      {/* Popup Container (Side Drawer Style) */}
      <div className="fixed bottom-20 left-4 z-[101] flex h-fit max-h-[calc(100dvh-100px)] w-[calc(100%-32px)] max-w-[240px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg transition-transform duration-100 linear sm:left-[calc(50%-234px)]">
        {/* Header with Logo */}
        <div className="p-4 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
              {/* Logo Placeholder */}
              <div className="w-5 h-5 bg-background rounded-sm" />
            </div>
            <h1 className="text-lg font-semibold">WealthFlow</h1>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground ml-1">Menu</span>
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
        </div>

        {/* Menu Items Scrollable Area */}
        <div className="overflow-y-auto px-4 py-0 custom-scrollbar max-h-[60vh]">
          <div className="flex flex-col gap-0 border-t border-border/50 pt-2">
            {menuItems.map((item, index) => (
              <MenuItem key={index} icon={item.icon} label={item.label} href={item.href} />
            ))}
          </div>
        </div>

        {/* Footer Profile Section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center justify-between p-2 -m-2 rounded-xl hover:bg-muted hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all duration-150 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-muted-foreground group-hover:bg-background">
                <User className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">사용자</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground">
                  로그아웃
                </span>
              </div>
            </div>
            <div className="p-2 text-muted-foreground group-hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-foreground hover:bg-muted hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all duration-150 group"
    >
      <Icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors shrink-0" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
    </Link>
  );
}

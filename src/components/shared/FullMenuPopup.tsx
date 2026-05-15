import {
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
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FullMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullMenuPopup({ isOpen, onClose }: FullMenuPopupProps) {
  const menuItems = [
    { icon: LineChart, label: "시장/거래", href: "#" },
    { icon: SlidersHorizontal, label: "종목 팔기/사기", href: "/purchase" },
    { icon: Heart, label: "관심종목", href: "#" },
    { icon: Activity, label: "거래내역", href: "#" },
    { icon: Smile, label: "환전", href: "#" },
    { icon: PieChart, label: "포트폴리오", href: "/portfolio" },
    { icon: Trophy, label: "랭킹", href: "/ranking" },
    { icon: User, label: "마이페이지", href: "/mypage" },
    { icon: Settings, label: "내 정보 수정", href: "/EditInfo" },
    { icon: Bot, label: "문의하기", href: "#" },
  ];

  const MenuItem = ({
    icon: Icon,
    label,
    href,
  }: {
    icon: React.ElementType;
    label: string;
    href: string;
  }) => (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2 px-3 py-1 rounded-lg text-foreground hover:bg-muted transition-all duration-150 group"
    >
      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-background transition-colors">
        <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
      </div>
      <span className="text-[13px] font-bold tracking-tighter">{label}</span>
    </Link>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed !bottom-[72px] !left-4 sm:!left-[calc(50%-234px)] !top-auto !right-auto !translate-x-0 !translate-y-0 z-[101] w-[calc(100%-32px)] max-w-[200px] h-fit bg-white rounded-[2rem] shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-border/50 p-0 sm:max-w-[200px] gap-0 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2">
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-50 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer scale-75">
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        {/* Header with Logo */}
        <div className="p-3 pb-0 shrink-0 text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <DialogTitle className="text-base font-bold tracking-tighter text-gray-900">
              WealthFlow
            </DialogTitle>
          </div>
          <div className="border-b border-gray-100 pb-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter ml-1">
              Menu
            </span>
          </div>
        </div>

        {/* Menu Items Area */}
        <div className="px-1.5 py-1.5 flex flex-col gap-0">
          {menuItems.map((item, index) => (
            <MenuItem key={index} icon={item.icon} label={item.label} href={item.href} />
          ))}
        </div>

        {/* Footer Profile Section */}
        <div className="p-1.5 bg-gray-50 border-t border-gray-100">
          <div
            onClick={onClose}
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 rounded-lg border border-gray-100">
                <AvatarImage src="" />
                <AvatarFallback className="bg-white rounded-lg text-gray-400">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-none mb-0.5 tracking-tighter">
                  사용자
                </span>
                <span className="text-[9px] text-gray-400 group-hover:text-gray-500 tracking-tighter">
                  로그아웃
                </span>
              </div>
            </div>
            <div className="p-1 text-gray-400 group-hover:text-gray-900 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

interface FullMenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FullMenuPopup({ isOpen, onClose }: FullMenuPopupProps) {
  // We remove the mounted state check to follow lint rules and because it's not strictly needed for this layout-based popup.

  const menuItems = [
    { icon: LineChart, label: "시장/거래", href: "#" },
    { icon: SlidersHorizontal, label: "종목 팔기/사기", href: "#" },
    { icon: Heart, label: "관심종목", href: "#" },
    { icon: Activity, label: "거래내역", href: "#" },
    { icon: Smile, label: "환전", href: "#" },
    { icon: PieChart, label: "포트폴리오", href: "#" },
    { icon: Trophy, label: "랭킹", href: "#" },
    { icon: User, label: "마이페이지", href: "#" },
    { icon: Settings, label: "내 정보 수정", href: "#" },
    { icon: Bot, label: "문의하기", href: "#" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-100 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Popup Container (Side Drawer Style) */}
      <div
        className={`fixed bottom-20 left-4 z-[101] w-[calc(100%-32px)] max-w-[240px] h-fit max-h-[calc(100dvh-100px)] bg-background rounded-3xl shadow-2xl transition-transform duration-100 linear transform flex flex-col overflow-hidden border border-border/50 ${
          isOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        {/* Header with Logo */}
        <div className="p-4 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
              {/* Logo Placeholder */}
              <div className="w-5 h-5 bg-background rounded-sm" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">WealthFlow</h1>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground ml-1">Menu</span>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
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
                <span className="text-[15px] font-bold leading-tight">사용자</span>
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
      <span className="text-[15px] font-medium flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
    </Link>
  );
}

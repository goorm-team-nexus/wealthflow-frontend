"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathMap: Record<string, string> = {
  "/portfolio": "Portfolio",
  "/ranking": "Ranking",
  "/mypage": "My Page",
};

export default function GlobalNavigationBar() {
  const pathname = usePathname();
  const title = pathMap[pathname] || "WealthFlow";

  return (
    <header className="w-full border-b bg-background rounded-t-[1.5rem]">
      <div className="flex h-[56px] items-center justify-between px-4">
        {/* Left: Logo Placeholder + Title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-muted" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">{title}</span>
        </div>

        {/* Right: My Page Link (Profile Circle Placeholder) */}
        <div className="flex items-center">
          <Link
            href="/mypage"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80"
            aria-label="My Page"
          >
            <div className="h-full w-full rounded-full border-2 border-background bg-muted-foreground/20" />
          </Link>
        </div>
      </div>
    </header>
  );
}

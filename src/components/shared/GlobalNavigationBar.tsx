import Link from "next/link";

export default function GlobalNavigationBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[50px] items-center justify-between px-4">
        {/* Left: Logo Placeholder + Title */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-muted" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">WealthFlow</span>
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

import GlobalNavigationBar from "@/components/shared/GlobalNavigationBar";
import { TabBar } from "@/components/shared/TabBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-layout="main"
      className="mx-auto min-h-dvh w-full max-w-[500px] border-x border-border bg-background"
    >
      <GlobalNavigationBar />
      <main className="pb-16">{children}</main>
      <TabBar />
    </div>
  );
}

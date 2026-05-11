import { TabBar } from "@/components/shared/TabBar";

export default function TestTabBarPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm mb-20">
        <h1 className="text-2xl font-bold mb-4 text-center">탭바 테스트</h1>
        <p className="text-muted-foreground text-center">하단에 공통 탭바가 렌더링됩니다.</p>
      </div>

      {/* TabBar is fixed to the bottom */}
      <TabBar />
    </main>
  );
}

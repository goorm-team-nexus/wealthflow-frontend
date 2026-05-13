import MyRankingCard from "@/components/ranking/MyRankingCard";

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-background p-4 flex flex-col items-center justify-start pt-6 pb-12">
      <div className="w-full max-w-[390px]">
        <h1 className="text-2xl font-bold text-foreground mb-4">랭킹</h1>
        <MyRankingCard />
      </div>
    </main>
  );
}

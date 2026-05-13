import MyRankingCard from "@/components/ranking/MyRankingCard";
import WeeklyRanking from "@/components/ranking/WeeklyRanking";

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-background p-4 flex flex-col items-center justify-start pt-6 pb-12">
      <div className="w-full max-w-[390px] flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">랭킹</h1>
        <MyRankingCard />
        <WeeklyRanking />
      </div>
    </main>
  );
}

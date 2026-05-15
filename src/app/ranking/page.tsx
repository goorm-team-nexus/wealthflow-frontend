import MyRankingCard from "@/components/ranking/MyRankingCard";
import WeeklyRanking from "@/components/ranking/WeeklyRanking";
import OverallRanking from "@/components/ranking/OverallRanking";

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-background p-4 flex flex-col items-center justify-start pt-6 pb-24">
      <div className="w-full max-w-[500px] flex flex-col gap-6">
        <MyRankingCard />
        <WeeklyRanking />
        <OverallRanking />
      </div>
    </main>
  );
}

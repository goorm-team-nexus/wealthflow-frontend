import MyRankingCard from "@/components/ranking/MyRankingCard";
import WeeklyRanking from "@/components/ranking/WeeklyRanking";
import OverallRanking from "@/components/ranking/OverallRanking";

export default function RankingPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-foreground">랭킹</h1>
      <MyRankingCard />
      <WeeklyRanking />
      <OverallRanking />
    </div>
  );
}

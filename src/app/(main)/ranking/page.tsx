import MyRankingCard from "@/components/ranking/MyRankingCard";
import WeeklyRanking from "@/components/ranking/WeeklyRanking";
import OverallRanking from "@/components/ranking/OverallRanking";

export default function RankingPage() {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <MyRankingCard />
      <WeeklyRanking />
      <OverallRanking />
    </div>
  );
}

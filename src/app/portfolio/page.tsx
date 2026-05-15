import PortfolioHoldingsList from "@/components/portfolio/PortfolioHoldingsList";
import PortfolioHoldingsRatio from "@/components/portfolio/PortfolioHoldingsRatio";
import PortfolioMyRanking from "@/components/portfolio/PortfolioMyRanking";
import PortfolioTotalAssets from "@/components/portfolio/PortfolioTotalAssets";
import PortfolioAiAnalysis from "@/components/portfolio/PortfolioAiAnalysis";

export const metadata = {
  title: "포트폴리오 | WealthFlow",
  description: "나의 포트폴리오 현황 및 랭킹을 확인하세요.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="w-full max-w-[500px] mx-auto flex flex-col gap-4 p-4">
        <PortfolioMyRanking />
        <PortfolioTotalAssets />
        <PortfolioHoldingsRatio />
        <PortfolioHoldingsList />
        <PortfolioAiAnalysis />
      </div>
    </main>
  );
}

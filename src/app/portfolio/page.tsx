import PortfolioHoldingsList from "@/components/portfolio/PortfolioHoldingsList";
import PortfolioHoldingsRatio from "@/components/portfolio/PortfolioHoldingsRatio";
import PortfolioMyRanking from "@/components/portfolio/PortfolioMyRanking";
import PortfolioTotalAssets from "@/components/portfolio/PortfolioTotalAssets";

export const metadata = {
  title: "포트폴리오 | WealthFlow",
  description: "나의 포트폴리오 현황 및 랭킹을 확인하세요.",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">포트폴리오</h1>
      <PortfolioMyRanking />
      <PortfolioTotalAssets />
      <PortfolioHoldingsRatio />
      <PortfolioHoldingsList />
    </main>
  );
}

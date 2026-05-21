import { Metadata } from "next";

import { ExchangeContent } from "./components/ExchangeContent";

export const metadata: Metadata = {
  title: "환전 | WealthFlow",
  description: "WealthFlow 환전 신청 페이지입니다.",
};

export default function ExchangePage() {
  return <ExchangeContent />;
}

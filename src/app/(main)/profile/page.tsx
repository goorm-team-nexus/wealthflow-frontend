import { Metadata } from "next";
import ProfileSelectionContent from "./ProfileSelectionContent";

export const metadata: Metadata = {
  title: "프로필 선택 | WealthFlow",
  description: "WealthFlow에서 당신만의 특별한 프로필을 선택하세요.",
};

export default function ProfilePage() {
  return <ProfileSelectionContent />;
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { getTop3, mapToWeeklyRankingUI, type WeeklyRankingUIModel } from "@/services/ranking";
import { useAuth } from "@/components/providers/AuthProvider";

import crownIcon from "@/assets/images/ranking/crown.webp";
import cupIcon from "@/assets/images/ranking/cup.webp";
import vipIcon from "@/assets/images/ranking/vip.webp";

export default function WeeklyRanking() {
  const [data, setData] = useState<WeeklyRankingUIModel | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchTop3 = async () => {
      try {
        const response = await getTop3();
        if (isMounted) {
          if (response.success && response.data?.rankings) {
            setData(mapToWeeklyRankingUI(response.data.rankings));
          } else {
            setData(mapToWeeklyRankingUI([])); // 빈 리스트일 때 기본 홍길동 폴백 주입
          }
        }
      } catch {
        if (isMounted) {
          setData(mapToWeeklyRankingUI([]));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchTop3();
    return () => {
      isMounted = false;
    };
  }, []);

  // 로딩 스켈레톤 뷰
  if (loading) {
    return (
      <Card className="w-full border border-border bg-card shadow-none">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="h-6 w-24 bg-muted animate-pulse rounded-md mb-4" />
          <div className="flex items-end justify-center gap-3 w-full px-1">
            {/* 2위 skeleton */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-5 w-16 bg-muted animate-pulse rounded-md mb-2" />
              <div className="w-16 h-16 bg-muted animate-pulse rounded-full mb-2" />
              <div className="w-full bg-white border border-border/80 rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-36 animate-pulse bg-muted/20" />
            </div>
            {/* 1위 skeleton */}
            <div className="flex flex-col items-center flex-1 z-10">
              <div className="w-20 h-20 bg-muted animate-pulse rounded-full mb-2" />
              <div className="h-5 w-20 bg-muted animate-pulse rounded-md mb-2" />
              <div className="w-full bg-white border border-border/80 rounded-xl flex flex-col items-center pt-2 pb-4 shadow-md h-44 animate-pulse bg-muted/20" />
            </div>
            {/* 3위 skeleton */}
            <div className="flex flex-col items-center flex-1">
              <div className="h-5 w-16 bg-muted animate-pulse rounded-md mb-2" />
              <div className="w-16 h-16 bg-muted animate-pulse rounded-full mb-2" />
              <div className="w-full bg-white border border-border/80 rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-36 animate-pulse bg-muted/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;
  const { rank1, rank2, rank3 } = data;

  const getWeeklyAvatar = (weeklyUser: { name: string; img: string }) => {
    if (userProfile && weeklyUser.name === userProfile.name) {
      return userProfile.avatarSrc || "";
    }
    return weeklyUser.img || "";
  };

  return (
    <Card className="w-full border border-border bg-card shadow-none">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">랭킹 TOP 3</h2>
        </div>

        <div className="flex items-end justify-center gap-3 w-full px-1">
          {/* 2위 (좌측) */}
          <div className="flex flex-col items-center flex-1">
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{rank2.name}</Badge>
            <Avatar className="w-16 h-16 mb-2 border-2 border-white shadow-sm">
              {getWeeklyAvatar(rank2) ? (
                <AvatarImage src={getWeeklyAvatar(rank2)} alt="User 2" />
              ) : null}
              <AvatarFallback className="bg-muted text-foreground font-bold">
                {rank2.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-36">
              <div className="h-14 flex items-center justify-center">
                <Image src={cupIcon} alt="2nd place" width={48} height={48} unoptimized priority />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">2</span>
                <span className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5">
                  {rank2.totalAsset}
                </span>
                <span className="text-red-500 text-xs font-medium leading-none mt-0.5">
                  {rank2.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 1위 (중앙) */}
          <div className="flex flex-col items-center flex-1 z-10">
            <Avatar className="w-20 h-20 mb-2 border-2 border-white shadow-md">
              {getWeeklyAvatar(rank1) ? (
                <AvatarImage src={getWeeklyAvatar(rank1)} alt="User 1" />
              ) : null}
              <AvatarFallback className="bg-muted text-foreground font-bold">
                {rank1.name[0]}
              </AvatarFallback>
            </Avatar>
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{rank1.name}</Badge>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-4 shadow-md h-44">
              <div className="h-20 flex items-center justify-center">
                <Image
                  src={crownIcon}
                  alt="1st place"
                  width={80}
                  height={80}
                  unoptimized
                  priority
                />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-3xl font-bold">1</span>
                <span className="text-[11px] text-muted-foreground font-medium leading-none mt-0.5">
                  {rank1.totalAsset}
                </span>
                <span className="text-red-500 text-sm font-semibold leading-none mt-0.5">
                  {rank1.rate}
                </span>
              </div>
            </div>
          </div>

          {/* 3위 (우측) */}
          <div className="flex flex-col items-center flex-1">
            <Badge className="mb-2 h-auto px-3 py-1 whitespace-nowrap">{rank3.name}</Badge>
            <Avatar className="w-16 h-16 mb-2 border-2 border-white shadow-sm">
              {getWeeklyAvatar(rank3) ? (
                <AvatarImage src={getWeeklyAvatar(rank3)} alt="User 3" />
              ) : null}
              <AvatarFallback className="bg-muted text-foreground font-bold">
                {rank3.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="w-full bg-white border border-border rounded-xl flex flex-col items-center pt-2 pb-3 shadow-sm h-36">
              <div className="h-14 flex items-center justify-center">
                <Image src={vipIcon} alt="3rd place" width={48} height={48} unoptimized priority />
              </div>
              <div className="mt-auto flex flex-col items-center">
                <span className="text-2xl font-bold">3</span>
                <span className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5">
                  {rank3.totalAsset}
                </span>
                <span className="text-red-500 text-xs font-medium leading-none mt-0.5">
                  {rank3.rate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

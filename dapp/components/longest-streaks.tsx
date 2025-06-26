"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { RefreshButton } from "./refresh-button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchContentFromIPFS, useContractFetch } from "@/hooks/useBlockchain";
import { STARKIT_ABI } from "@/app/abis/starkit_abi";
import { useAccount } from "@starknet-react/core";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { shortString } from "starknet";
function LongestStreaks({ setShowWalletModal }: { setShowWalletModal: any }) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [topStreaks, setTopStreaks] = useState([]);
  const {
    readData: platformLongestStreaks,
    readIsLoading: isLoadingPlatformLongestStreaks,
    dataRefetch: refetchPlatformLongestStreaks,
    readRefetching: isRefetchingPlatformLongestStreaks,
  } = useContractFetch(STARKIT_ABI, "get_platform_longest_streaks", []);
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      return;
    }

    async function fetchHabitsInfo() {
      try {
        setIsLoading(true);
        if (!platformLongestStreaks || platformLongestStreaks.length === 0)
          return;

        const habitPromises = platformLongestStreaks.map((habit: any) =>
          fetchContentFromIPFS(habit.info)
        );
        const habitInfo: any = await Promise.all(habitPromises);

        const streaks = platformLongestStreaks
          .map((habit: any, i: number) => ({
            ...habitInfo[i],
            streak_count: habit.streak_count,
            owner_username: shortString.decodeShortString(habit.owner_username),
          }))
          .sort(
            (a: any, b: any) => Number(b.streak_count) - Number(a.streak_count)
          )
          .slice(0, 4)
          .filter((habit: any) => Number(habit.streak_count) !== 0)
          .map((habit: any) => ({
            habit: habit.title,
            username: habit.owner_username,
            streak: Number(habit.streak_count),
            avatar: "🎯",
          }));

        setTopStreaks(streaks);
      } catch (err) {
        console.error("Failed to fetch top streaks:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHabitsInfo();
  }, [address, platformLongestStreaks]);

  const handleStartHabit = () => {
    if (address) {
      router.push("/create");
    } else {
      setShowWalletModal(true);
    }
  };
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>🏆 Longest Streaks</span>
          </CardTitle>
          <RefreshButton onRefresh={refetchPlatformLongestStreaks} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ||
        isLoadingPlatformLongestStreaks ||
        isRefetchingPlatformLongestStreaks ? (
          <div className="flex justify-center h-full items-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : topStreaks.length === 0 || !topStreaks.length ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚫</div>
            <p className="text-gray-600 mb-4">
              No one is on the leaderboard yet, create a habit.
            </p>
            <Button onClick={handleStartHabit} variant="outline">
              Create an entry
            </Button>
          </div>
        ) : (
          topStreaks.length !== 0 &&
          topStreaks.map((streak: any, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="text-2xl">{streak.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{streak.username}</p>
                <p className="font-medium text-sm">{streak.habit}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  🔥
                  <span className="font-bold text-lg">{streak.streak}</span>
                </div>
                <p className="text-xs text-gray-500">days</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default LongestStreaks;

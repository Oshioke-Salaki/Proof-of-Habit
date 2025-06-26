import { STARKIT_ABI } from "@/app/abis/starkit_abi";
import { useContractFetch } from "./useBlockchain";

export function useUserStats(address: string | undefined) {
  const { readData: totalHabits, readIsLoading: isLoadingTotalHabits } =
    useContractFetch(STARKIT_ABI, "get_total_user_habits", [address]);

  const { readData: totalUserLogs, readIsLoading: isLoadingTotalUserLogs } =
    useContractFetch(STARKIT_ABI, "get_total_logs_user", [address]);

  const {
    readData: userLongestStreak,
    readIsLoading: isLoadingUserLongestStreak,
  } = useContractFetch(STARKIT_ABI, "get_user_longest_streak", [address]);

  const isLoadingStats =
    isLoadingTotalHabits ||
    isLoadingTotalUserLogs ||
    isLoadingUserLongestStreak;

  return {
    totalHabits,
    totalUserLogs,
    userLongestStreak,
    isLoadingStats,
  };
}

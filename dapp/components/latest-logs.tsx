"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Clock, Flame } from "lucide-react";
import { RefreshButton } from "./refresh-button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { fetchContentFromIPFS, useContractFetch } from "@/hooks/useBlockchain";
import { STARKIT_ABI } from "@/app/abis/starkit_abi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { bigIntToHex, getTimeAgo, shortenAddress } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { shortString } from "starknet";

function LatestLogs({ setShowWalletModal }: { setShowWalletModal: any }) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const {
    readData: contractLogs,
    readIsLoading: isLoadingContractLogs,
    dataRefetch: refetchContractLogs,
    readRefetching: isRefetchingContractLogs,
  } = useContractFetch(STARKIT_ABI, "get_recent_logs", []);
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      return;
    }

    async function fetchContractLogs() {
      try {
        setIsLoading(true);
        if (!contractLogs || contractLogs.length === 0) return;

        const habitInfoPromises = contractLogs.map((log: any) =>
          fetchContentFromIPFS(log.habit_info)
        );
        const logInfoPromises = contractLogs.map((log: any) =>
          fetchContentFromIPFS(log.log_info)
        );

        const habitInfo: any = await Promise.all(habitInfoPromises);
        const logInfo: any = await Promise.all(logInfoPromises);

        const cleanedLogs = contractLogs
          .map((log: any, i: number) => ({
            ...habitInfo[i],
            ...logInfo[i],
            streak_count: log.streak_count,
            timestamp: log.timestamp,
            address: log.address,
            username: log.username,
          }))
          .sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp))
          .slice(0, 4);

        setLogs(cleanedLogs);
      } catch (err) {
        console.error("Failed to fetch top streaks:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContractLogs();
  }, [address, contractLogs]);

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
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Latest Logs</span>
          </CardTitle>
          <RefreshButton onRefresh={refetchContractLogs} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {" "}
        {isLoading ||
        isLoading ||
        isRefetchingContractLogs ||
        isLoadingContractLogs ? (
          <div className="flex justify-center h-full items-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🪵</div>
            <p className="text-gray-600 mb-4">
              It’s quiet here... Be the first to log your habit and inspire
              others!
            </p>
            <Button onClick={handleStartHabit} variant="outline">
              Create Your First Entry
            </Button>
          </div>
        ) : (
          logs.length !== 0 &&
          logs.map((log: any, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50/50"
            >
              <Avatar className="w-10 h-10">
                {/* TODO: Have multiple avatars */}
                <Image
                  src="/user_avatar.svg"
                  alt="avatar"
                  width={50}
                  height={50}
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">
                    {shortString.decodeShortString(log.username) ||
                      shortenAddress(bigIntToHex(log.address))}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    🔥
                    {Number(log.streak_count)}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-800">{log.title}</p>
                <p className="text-sm text-gray-600">{log.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeAgo(log.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default LatestLogs;

import { clsx, type ClassValue } from "clsx";
import { RpcProvider } from "starknet";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjOWU2MDAxNy00YTgwLTQ4ZWEtYmY3MS1kYTZlMDM0NjBjMTIiLCJlbWFpbCI6InNhbGFraTE5MDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImUwNmM4ZWI4YWUzODY2YzkzZmYzIiwic2NvcGVkS2V5U2VjcmV0IjoiZGQ1ODBiOWZiM2Q5NWUzZmZjZjdlZjRkNzVjNTQ3OWRmNTJkNGYzYTQ2Y2UzOGRkOTEwOTMwNmVjYTgzZGU0MCIsImV4cCI6MTc4MjQxNzk3Mn0.x4lA02I2Dg-CR9uoKePujPjkPj5PY233c3eN1MB9-cg";

export function canLogTodayFromEpoch(
  epochSeconds: number | bigint | null | undefined
): boolean {
  if (!epochSeconds) return true;

  const lastLogDate = new Date(Number(epochSeconds) * 1000);
  const now = new Date();

  const isDifferentDay =
    now.getFullYear() !== lastLogDate.getFullYear() ||
    now.getMonth() !== lastLogDate.getMonth() ||
    now.getDate() !== lastLogDate.getDate();

  return isDifferentDay;
}

export function shortenAddress(address: `0x${string}`, chars = 5): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, 4)}...${address.slice(-chars)}`;
}

export const getTimeUntilNextLog = (lastLogTime: string | null) => {
  if (!lastLogTime) return null;
  const lastLog = new Date(lastLogTime);
  const nextLog = new Date(lastLog);
  nextLog.setDate(nextLog.getDate() + 1);
  const now = new Date();

  if (now >= nextLog) return null;

  const diff = nextLog.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const myProvider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
});

export function bigIntToHex(value: bigint): `0x${string}` {
  return `0x${value.toString(16)}`;
}

export function getTimeAgo(epochSeconds: bigint): string {
  const now = Date.now(); // current time in ms
  const past = Number(epochSeconds) * 1000; // convert BigInt to number and to ms

  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

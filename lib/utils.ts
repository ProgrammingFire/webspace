import { Rank } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEnded(endDate: Date): [number, boolean] {
  const time = endDate.getTime() - new Date().getTime();

  if (time < 0) {
    return [time, true];
  }
  return [time, false];
}

export function getEndDate(createdAt: Date) {
  const endDate = new Date(createdAt);
  endDate.setDate(createdAt.getDate() + 1);
  return endDate;
}

export function rankMap(rankPoints: number): Rank {
  if (rankPoints === 300) {
    return "Silver";
  } else if (rankPoints === 600) {
    return "Gold";
  } else if (rankPoints === 1000) {
    return "Platinum";
  } else if (rankPoints === 1500) {
    return "Diamond";
  } else if (rankPoints === 2000) {
    return "Legendary";
  } else {
    return "Bronze";
  }
}

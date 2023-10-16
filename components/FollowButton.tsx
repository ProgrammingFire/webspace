"use client";

import React from "react";
import { Button } from "./ui/button";
import { Loader2, Minus, Plus } from "lucide-react";
import { User } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  currentUserId: string;
  dbUser: User;
}

function FollowButton({ currentUserId, dbUser }: FollowButtonProps) {
  const isFollowing = dbUser.followers.includes(currentUserId);
  const router = useRouter();

  const { mutate: follow, isLoading } = trpc.followUser.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {},
  });

  const { mutate: unfollow, isLoading: isLoadingUnfollow } =
    trpc.unfollowUser.useMutation({
      onSuccess: () => {
        router.refresh();
      },
      onError: () => {},
    });

  return isFollowing ? (
    <Button
      disabled={isLoadingUnfollow}
      onClick={() => unfollow({ userId: dbUser.id })}
      variant="outline"
    >
      {isLoadingUnfollow ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Minus className="w-4 h-4 mr-2" />
      )}{" "}
      Unfollow
    </Button>
  ) : (
    <Button
      disabled={isLoading}
      onClick={() => follow({ userId: dbUser.id })}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Plus className="w-4 h-4 mr-2" />
      )}{" "}
      Follow
    </Button>
  );
}

export default FollowButton;

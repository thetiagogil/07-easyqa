"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useFollow, useUnfollow } from "@/hooks/useFollowApi";
import { Button } from "@mui/joy";
import { useState } from "react";

type FollowButtonProps = {
  targetUserId: number;
  isFollowing: boolean;
};

export const FollowButton = ({ targetUserId, isFollowing }: FollowButtonProps) => {
  const { currentUser } = useAuthContext();
  const { mutateAsync: follow, isPending: isPendingFollow } = useFollow(targetUserId);
  const { mutateAsync: unfollow, isPending: isPendingUnfollow } = useUnfollow(targetUserId);
  const [hover, setHover] = useState(false);

  const commonStyles = { width: 80, fontSize: 12, transition: "0.3s" };

  if (!currentUser || currentUser.id === targetUserId) return null;

  if (isFollowing) {
    return (
      <Button
        variant="outlined"
        color={hover ? "danger" : "primary"}
        size="sm"
        disabled={isPendingUnfollow}
        loading={isPendingUnfollow}
        onClick={() => unfollow()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={commonStyles}
      >
        {hover ? "Unfollow" : "Following"}
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      color={hover ? "primary" : "neutral"}
      size="sm"
      disabled={isPendingFollow}
      loading={isPendingFollow}
      onClick={() => follow()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={commonStyles}
    >
      Follow
    </Button>
  );
};

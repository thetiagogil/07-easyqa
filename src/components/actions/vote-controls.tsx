"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useOptimistic, useTransition } from "react";
import { submitVoteAction } from "@/lib/easyqa/actions/votes";
import type { Answer, Question, TargetType, VoteValue } from "@/types/easyqa";

type VoteControlsProps = {
  targetType: TargetType;
  target: Question | Answer;
  returnTo: string;
  disabled?: boolean;
};

export function VoteControls({
  targetType,
  target,
  returnTo,
  disabled,
}: VoteControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticVote, addOptimisticVote] = useOptimistic<
    VoteState,
    VoteValue
  >(
    {
      voteScore: target.voteScore,
      viewerVoteValue: target.viewerVoteValue,
    },
    applyVote,
  );

  const handleVote = (value: VoteValue) => {
    if (disabled || isPending) return;

    startTransition(async () => {
      addOptimisticVote(value);
      await submitVoteAction(targetType, target.id, value, returnTo);
    });
  };

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <IconButton
        type="button"
        size="sm"
        variant="plain"
        color={optimisticVote.viewerVoteValue === 1 ? "success" : "neutral"}
        disabled={disabled}
        aria-disabled={isPending || disabled}
        aria-label="Upvote"
        onClick={() => handleVote(1)}
        sx={disabled ? { opacity: 0.5 } : undefined}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <Typography
        level="body-sm"
        sx={{ width: 20, textAlign: "center" }}
        color={
          optimisticVote.viewerVoteValue === 1
            ? "success"
            : optimisticVote.viewerVoteValue === -1
              ? "danger"
              : "neutral"
        }
      >
        {optimisticVote.voteScore}
      </Typography>
      <IconButton
        type="button"
        size="sm"
        variant="plain"
        color={optimisticVote.viewerVoteValue === -1 ? "danger" : "neutral"}
        disabled={disabled}
        aria-disabled={isPending || disabled}
        aria-label="Downvote"
        onClick={() => handleVote(-1)}
        sx={disabled ? { opacity: 0.5 } : undefined}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Stack>
  );
}

type VoteState = {
  voteScore: number;
  viewerVoteValue: VoteValue | null;
};

function applyVote(current: VoteState, selectedValue: VoteValue): VoteState {
  if (current.viewerVoteValue === selectedValue) {
    return {
      voteScore: current.voteScore - selectedValue,
      viewerVoteValue: null,
    };
  }

  if (current.viewerVoteValue === null) {
    return {
      voteScore: current.voteScore + selectedValue,
      viewerVoteValue: selectedValue,
    };
  }

  return {
    voteScore: current.voteScore + selectedValue * 2,
    viewerVoteValue: selectedValue,
  };
}

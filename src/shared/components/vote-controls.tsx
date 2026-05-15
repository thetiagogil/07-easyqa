"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircularProgress from "@mui/joy/CircularProgress";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState, useTransition } from "react";
import { submitVoteAction } from "@/shared/server/actions";
import type { Answer, Question, TargetType, VoteValue } from "@/types/easyqa";

type VoteControlsProps = {
  targetType: TargetType;
  target: Question | Answer;
  disabled?: boolean;
};

export function VoteControls({
  targetType,
  target,
  disabled,
}: VoteControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [voteState, setVoteState] = useState<VoteState>({
    voteScore: target.voteScore,
    viewerVoteValue: target.viewerVoteValue,
  });

  const handleVote = (value: VoteValue) => {
    if (disabled || isPending) return;

    startTransition(async () => {
      const previousState = voteState;
      setVoteState((current) => applyVote(current, value));

      try {
        await submitVoteAction(targetType, target.id, value);
      } catch (error) {
        setVoteState(previousState);
        throw error;
      }
    });
  };

  return (
    <Stack direction="row" alignItems="center" gap={0.5} aria-busy={isPending || undefined}>
      <IconButton
        type="button"
        size="sm"
        variant="plain"
        color={voteState.viewerVoteValue === 1 ? "success" : "neutral"}
        disabled={disabled || isPending}
        aria-disabled={isPending || disabled}
        aria-label="Upvote"
        onClick={() => handleVote(1)}
        sx={disabled ? { opacity: 0.5 } : undefined}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={0.5}
        minWidth={34}
        aria-live="polite"
      >
        <Typography
          level="body-sm"
          sx={{ width: 20, textAlign: "center" }}
          color={
            voteState.viewerVoteValue === 1
              ? "success"
              : voteState.viewerVoteValue === -1
                ? "danger"
                : "neutral"
          }
        >
          {voteState.voteScore}
        </Typography>
        {isPending ? (
          <CircularProgress
            color="neutral"
            size="sm"
            thickness={2}
            aria-label="Saving vote"
            sx={{ "--CircularProgress-size": "12px" }}
          />
        ) : null}
      </Stack>
      <IconButton
        type="button"
        size="sm"
        variant="plain"
        color={voteState.viewerVoteValue === -1 ? "danger" : "neutral"}
        disabled={disabled || isPending}
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

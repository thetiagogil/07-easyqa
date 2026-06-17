"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircularProgress from "@mui/joy/CircularProgress";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState, useTransition } from "react";
import { submitVoteAction } from "@/features/questions/server/actions";
import { ActionStatus } from "@/shared/components/action-status";
import type { Answer, Question, TargetType, VoteValue } from "@/types/easyqa";

type VoteControlsProps = {
  targetType: TargetType;
  target: Question | Answer;
  disabled?: boolean;
};

export const VoteControls = ({
  targetType,
  target,
  disabled,
}: VoteControlsProps) => {
  const [isPending, startTransition] = useTransition();
  const [voteState, setVoteState] = useState<VoteState>({
    voteScore: target.voteScore,
    viewerVoteValue: target.viewerVoteValue,
  });
  const [error, setError] = useState<string | null>(null);

  const handleVote = (value: VoteValue) => {
    if (disabled || isPending) return;

    startTransition(async () => {
      const previousState = voteState;
      setError(null);
      setVoteState((current) => applyVote(current, value));

      try {
        const result = await submitVoteAction(targetType, target.id, value);
        if (result.error) {
          setVoteState(previousState);
          setError(result.error);
        }
      } catch (error) {
        setVoteState(previousState);
        setError(
          error instanceof Error ? error.message : "Vote was not saved.",
        );
      }
    });
  };

  return (
    <Stack gap={0.25} alignItems="flex-start">
      <Stack
        direction="row"
        alignItems="center"
        gap={0.5}
        aria-busy={isPending || undefined}
      >
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
      <ActionStatus compact error={error ?? undefined} />
    </Stack>
  );
};

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

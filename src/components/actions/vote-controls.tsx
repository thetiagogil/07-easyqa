import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton, Stack, Typography } from "@mui/joy";
import { submitVoteAction } from "@/lib/easyqa/actions";
import type { Answer, Question, TargetType } from "@/types/easyqa";

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
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <form action={submitVoteAction.bind(null, targetType, target.id, 1, returnTo)}>
        <IconButton
          type="submit"
          size="sm"
          variant="plain"
          color={target.viewerVoteValue === 1 ? "success" : "neutral"}
          disabled={disabled}
          aria-label="Upvote"
          sx={disabled ? { opacity: 0.5 } : undefined}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </form>
      <Typography
        level="body-sm"
        sx={{ width: 20, textAlign: "center" }}
        color={
          target.viewerVoteValue === 1
            ? "success"
            : target.viewerVoteValue === -1
              ? "danger"
              : "neutral"
        }
      >
        {target.voteScore}
      </Typography>
      <form action={submitVoteAction.bind(null, targetType, target.id, -1, returnTo)}>
        <IconButton
          type="submit"
          size="sm"
          variant="plain"
          color={target.viewerVoteValue === -1 ? "danger" : "neutral"}
          disabled={disabled}
          aria-label="Downvote"
          sx={disabled ? { opacity: 0.5 } : undefined}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </form>
    </Stack>
  );
}

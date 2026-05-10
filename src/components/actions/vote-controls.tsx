import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton, Stack, Typography } from "@mui/joy";
import { submitVoteAction } from "@/lib/easyqa/actions";
import type { TargetType, VoteValue } from "@/types/easyqa";

type VoteControlsProps = {
  targetType: TargetType;
  targetId: number;
  score: number;
  viewerVoteValue: VoteValue | null;
  returnTo: string;
  disabled?: boolean;
};

export function VoteControls({
  targetType,
  targetId,
  score,
  viewerVoteValue,
  returnTo,
  disabled,
}: VoteControlsProps) {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <form action={submitVoteAction.bind(null, targetType, targetId, 1, returnTo)}>
        <IconButton
          type="submit"
          size="sm"
          variant="plain"
          color={viewerVoteValue === 1 ? "success" : "neutral"}
          disabled={disabled}
          aria-label="Upvote"
        >
          <ArrowUpwardIcon />
        </IconButton>
      </form>
      <Typography level="body-sm" sx={{ minWidth: 28, textAlign: "center" }}>
        {score}
      </Typography>
      <form action={submitVoteAction.bind(null, targetType, targetId, -1, returnTo)}>
        <IconButton
          type="submit"
          size="sm"
          variant="plain"
          color={viewerVoteValue === -1 ? "danger" : "neutral"}
          disabled={disabled}
          aria-label="Downvote"
        >
          <ArrowDownwardIcon />
        </IconButton>
      </form>
    </Stack>
  );
}

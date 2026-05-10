import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Chip, Link, Stack, Typography } from "@mui/joy";
import type { Question } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { RelativeTime } from "./time";
import { VoteControls } from "@/components/actions/vote-controls";

export function QuestionCard({
  question,
  returnTo = "/",
  compact = false,
}: {
  question: Question;
  returnTo?: string;
  compact?: boolean;
}) {
  const isClosed = question.status === "closed";

  return (
    <Stack borderBottom="1px solid" borderColor="divider" p={2} gap={1.25}>
      <Stack direction="row" gap={1.25} alignItems="center">
        <Link component="a" href={`/profile/${question.author.id}`} underline="none">
          <ProfileAvatar profile={question.author} size={32} />
        </Link>
        <Stack minWidth={0}>
          <Typography level="body-sm">
            <Link component="a" href={`/profile/${question.author.id}`} color="primary" fontWeight={700}>
              {question.author.displayName}
            </Link>{" "}
            asked
          </Typography>
          <Typography level="body-xs" textColor="text.tertiary">
            <RelativeTime value={question.createdAt} />
          </Typography>
        </Stack>
      </Stack>

      <Stack gap={0.75}>
        <Link component="a" href={`/question/${question.id}`} underline="none">
          <Typography level={compact ? "title-sm" : "title-md"}>{question.title}</Typography>
        </Link>
        {!compact ? (
          <Typography level="body-sm" textColor="text.secondary" whiteSpace="pre-line">
            {question.content}
          </Typography>
        ) : null}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <VoteControls
          targetType="question"
          targetId={question.id}
          score={question.voteScore}
          viewerVoteValue={question.viewerVoteValue}
          returnTo={returnTo}
          disabled={isClosed}
        />
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip size="sm" variant="outlined" color={isClosed ? "neutral" : "primary"}>
            {question.status}
          </Chip>
          <Chip size="sm" variant="soft" color="neutral" startDecorator={<ChatBubbleOutlineIcon />}>
            {question.answerCount}
          </Chip>
        </Stack>
      </Stack>
    </Stack>
  );
}

import { Chip, Link, Stack, Typography } from "@mui/joy";
import { AcceptAnswerButton } from "@/components/actions/accept-answer-button";
import { VoteControls } from "@/components/actions/vote-controls";
import type { Answer, CurrentUser, Question } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { RelativeTime } from "./time";

export function AnswerCard({
  answer,
  question,
  currentUser,
}: {
  answer: Answer;
  question: Question;
  currentUser: CurrentUser | null;
}) {
  const canAccept =
    currentUser?.id === question.userId && question.status === "open" && !answer.accepted;

  return (
    <Stack borderBottom="1px solid" borderColor="divider" p={2} gap={1.25} sx={answer.accepted ? undefined : {}}>
      <Stack direction="row" gap={1.25} alignItems="center">
        <Link component="a" href={`/profile/${answer.author.id}`} underline="none">
          <ProfileAvatar profile={answer.author} size={32} />
        </Link>
        <Stack minWidth={0}>
          <Typography level="body-sm">
            <Link component="a" href={`/profile/${answer.author.id}`} color="primary" fontWeight={700}>
              {answer.author.displayName}
            </Link>{" "}
            answered
          </Typography>
          <Typography level="body-xs" textColor="text.tertiary">
            <RelativeTime value={answer.createdAt} />
          </Typography>
        </Stack>
      </Stack>

      <Typography level="body-sm" whiteSpace="pre-line" textColor="text.secondary">
        {answer.content}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <VoteControls
          targetType="answer"
          targetId={answer.id}
          score={answer.voteScore}
          viewerVoteValue={answer.viewerVoteValue}
          returnTo={`/question/${question.id}`}
          disabled={question.status === "closed"}
        />

        <Stack direction="row" gap={1} alignItems="center">
          {answer.accepted ? (
            <Chip size="sm" color="success" variant="outlined">
              Accepted
            </Chip>
          ) : null}
          {canAccept ? <AcceptAnswerButton answerId={answer.id} questionId={question.id} /> : null}
        </Stack>
      </Stack>
    </Stack>
  );
}

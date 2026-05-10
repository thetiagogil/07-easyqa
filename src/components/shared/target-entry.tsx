import { Chip, Link, Stack, Typography } from "@mui/joy";
import { AcceptAnswerButton } from "@/components/actions/accept-answer-button";
import { VoteControls } from "@/components/actions/vote-controls";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Answer, CurrentUser, Question } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { RelativeTime } from "./time";

type TargetEntryProps = {
  targetType: "question" | "answer";
  target: Question | Answer;
  answeredQuestion?: Question;
  currentUser?: CurrentUser | null;
  returnTo?: string;
};

export function TargetEntry({
  targetType,
  target,
  answeredQuestion,
  currentUser,
  returnTo,
}: TargetEntryProps) {
  const question = targetType === "question" ? (target as Question) : null;
  const answer = targetType === "answer" ? (target as Answer) : null;
  const author = question?.author ?? answer?.author;
  const canAccept =
    !!answer &&
    !!answeredQuestion &&
    currentUser?.id === answeredQuestion.userId &&
    answeredQuestion.status !== "closed" &&
    !answer.accepted;
  const isClosed =
    (question?.status === "closed") || (!!answer && answeredQuestion?.status === "closed");
  const notAcceptedAnswer =
    !!answer && answeredQuestion?.status === "closed" && !answer.accepted;

  if (!author) return null;

  return (
    <Stack
      direction="row"
      borderBottom={MAIN_BORDERS}
      p={2}
      gap={1}
      sx={notAcceptedAnswer ? { opacity: 0.5 } : undefined}
    >
      <Stack>
        <Link component="a" href={`/profile/${author.id}`} underline="none">
          <ProfileAvatar profile={author} size={24} />
        </Link>
      </Stack>

      <Stack flexBasis="100%" gap={1}>
        <Stack direction="row" minHeight={24} alignItems="center" gap={1}>
          <Typography level="body-sm">
            <Link
              component="a"
              href={`/profile/${author.id}`}
              color="primary"
              fontWeight="bold"
              marginRight={1}
            >
              {author.displayName}
            </Link>
            {question ? "asked" : "answered"}
          </Typography>
          <Typography level="body-sm" textColor="neutral.600" fontSize={10}>
            •
          </Typography>
          <Typography level="body-sm" textColor="neutral.600">
            <RelativeTime value={target.createdAt} />
          </Typography>
        </Stack>

        {question ? (
          <Link component="a" href={`/question/${question.id}`} underline="none">
            <Typography level="body-md">{question.title}</Typography>
          </Link>
        ) : (
          <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
            {target.content}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <VoteControls
            target={target}
            targetType={targetType}
            returnTo={returnTo ?? (question ? `/question/${question.id}` : `/question/${answer?.questionId}`)}
            disabled={isClosed}
          />

          {question ? (
            <Chip
              variant="outlined"
              color={question.status === "open" ? "primary" : "neutral"}
              disabled={isClosed}
            >
              {question.status}
            </Chip>
          ) : null}

          {answer?.accepted ? (
            <Chip variant="outlined" color="success">
              Accepted
            </Chip>
          ) : null}

          {answer && canAccept ? (
            <AcceptAnswerButton answerId={answer.id} questionId={answer.questionId} color="neutral">
              Accept answer
            </AcceptAnswerButton>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
}

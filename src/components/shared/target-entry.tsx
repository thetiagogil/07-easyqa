import { Chip, Link, Stack, Typography } from "@mui/joy";
import { AcceptAnswerButton } from "@/components/actions/accept-answer-button";
import { VoteControls } from "@/components/actions/vote-controls";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Answer, CurrentUser, Question } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { QuestionStatusChip } from "./question-status-chip";
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
    question?.status === "closed" || (!!answer && answeredQuestion?.status === "closed");
  const notAcceptedAnswer =
    !!answer && answeredQuestion?.status === "closed" && !answer.accepted;

  if (!author) return null;

  const targetHref = question ? `/question/${question.id}` : `/question/${answer?.questionId}`;
  const returnPath = returnTo ?? targetHref;
  const sharedSize = 24;

  return (
    <Stack
      direction="row"
      borderBottom={MAIN_BORDERS}
      p={2}
      gap={1}
      sx={notAcceptedAnswer ? { opacity: 0.5 } : undefined}
    >
      <Stack flexShrink={0}>
        <Link component="a" href={`/profile/${author.id}`} underline="none">
          <ProfileAvatar profile={author} size={sharedSize} />
        </Link>
      </Stack>

      <Stack flexBasis="100%" minWidth={0} gap={1}>
        <Stack direction="row" height={sharedSize} alignItems="center" gap={1} minWidth={0}>
          <Typography level="body-sm" noWrap minWidth={0}>
            <Link component="a" href={`/profile/${author.id}`} color="primary" fontWeight={700} marginRight={1}>
              {author.displayName}
            </Link>
            <Typography component="span" level="body-sm" textColor="neutral.400">
              {question ? "asked" : "answered"}
            </Typography>
          </Typography>
          <Typography level="body-sm" textColor="neutral.600" fontSize={10}>
            &bull;
          </Typography>
          <Typography level="body-sm" textColor="neutral.500" noWrap>
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
            returnTo={returnPath}
            disabled={isClosed}
          />

          <Stack direction="row" alignItems="center" gap={1}>
            {question ? <QuestionStatusChip status={question.status} openColor="primary" /> : null}

            {answer?.accepted ? (
              <Chip size="sm" variant="outlined" color="success">
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
    </Stack>
  );
}

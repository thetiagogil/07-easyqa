import { Chip, Link, Stack, Typography } from "@mui/joy";
import { AcceptAnswerButton } from "@/components/actions/accept-answer-button";
import { VoteControls } from "@/components/actions/vote-controls";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Answer, CurrentUser, Question } from "@/types/easyqa";
import { EntryMeta } from "./entry-meta";
import { QuestionStatusChip } from "./question-status-chip";

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

  return (
    <Stack
      borderBottom={MAIN_BORDERS}
      p={{ xs: 2, sm: 2.5 }}
      gap={1.5}
      sx={{
        opacity: notAcceptedAnswer ? 0.52 : undefined,
        transition: "0.3s",
        "&:hover": { bgcolor: "background.level1" },
      }}
    >
      <EntryMeta
        profile={author}
        action={question ? "asked" : "answered"}
        createdAt={target.createdAt}
        avatarSize={30}
      />

      <Stack gap={1}>
        {question ? (
          <Link component="a" href={`/question/${question.id}`} underline="none">
            <Typography level="title-sm" fontWeight={800}>
              {question.title}
            </Typography>
            <Typography
              level="body-sm"
              textColor="neutral.400"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {question.content}
            </Typography>
          </Link>
        ) : (
          <Typography level="body-sm" textColor="neutral.300" whiteSpace="pre-line">
            {target.content}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <VoteControls
            target={target}
            targetType={targetType}
            returnTo={returnTo ?? (question ? `/question/${question.id}` : `/question/${answer?.questionId}`)}
            disabled={isClosed}
          />

          <Stack direction="row" alignItems="center" gap={1}>
            {question ? <QuestionStatusChip status={question.status} /> : null}

            {answer?.accepted ? (
              <Chip size="sm" variant="soft" color="success" sx={{ fontWeight: 700 }}>
                Accepted
              </Chip>
            ) : null}

            {answer && canAccept ? (
              <AcceptAnswerButton answerId={answer.id} questionId={answer.questionId} color="neutral">
                Accept
              </AcceptAnswerButton>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

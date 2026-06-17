import { Alert, Stack } from "@mui/joy";
import { notFound } from "next/navigation";
import { AuthLinkButton } from "@/shared/components/auth/auth-link-button";
import { MainContainer } from "@/shared/components/layout/main-container";
import { AnswerForm } from "@/features/questions/components/answer-form";
import { NoData } from "@/shared/components/ui/no-data";
import { LinkButton } from "@/shared/components/ui/link-button";
import { QuestionEntry } from "@/features/questions/components/question-entry";
import { TargetEntry } from "@/features/questions/components/target-entry";
import { MAIN_BORDERS } from "@/shared/constants/app";
import {
  getAnswersForQuestion,
  getQuestionById,
} from "@/features/questions/server/queries";
import { getCurrentUser } from "@/shared/server/auth";
import type { CurrentUser, Question } from "@/types/easyqa";

type QuestionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const QuestionDetailPage = async ({
  params,
}: QuestionDetailPageProps) => {
  const { id } = await params;
  const questionId = Number(id);
  if (!Number.isSafeInteger(questionId) || questionId <= 0) {
    notFound();
  }

  const [currentUser, question, answers] = await Promise.all([
    getCurrentUser(),
    getQuestionById(questionId),
    getAnswersForQuestion(questionId),
  ]);

  const hasAnswered = answers.some(
    (answer) => answer.userId === currentUser?.id,
  );
  const canAnswer =
    !!currentUser?.profile?.hasDisplayName &&
    question.status === "open" &&
    question.userId !== currentUser.id &&
    !hasAnswered;
  const answerRestriction = getAnswerRestrictionMessage(
    currentUser,
    question,
    hasAnswered,
  );

  return (
    <MainContainer
      navbarProps={{ title: "question", hasBackButton: true }}
      noPad
    >
      <QuestionEntry question={question} />

      {!currentUser ? (
        <Stack p={{ xs: 2, sm: 2.5 }} borderBottom={MAIN_BORDERS}>
          <Alert
            variant="soft"
            color="neutral"
            endDecorator={<AuthLinkButton>log in</AuthLinkButton>}
          >
            You need to log in to answer this question.
          </Alert>
        </Stack>
      ) : canAnswer ? (
        <AnswerForm questionId={question.id} profile={currentUser.profile} />
      ) : answerRestriction ? (
        <Stack p={{ xs: 2, sm: 2.5 }} borderBottom={MAIN_BORDERS}>
          <Alert variant="soft" color="neutral">
            {answerRestriction}
          </Alert>
        </Stack>
      ) : null}

      {answers.length ? (
        answers.map((answer) => (
          <TargetEntry
            key={answer.id}
            targetType="answer"
            target={answer}
            answeredQuestion={question}
            currentUser={currentUser}
          />
        ))
      ) : (
        <NoData
          title="No answers yet"
          description={
            question.status === "closed"
              ? "This question was closed before receiving answers."
              : "Useful answers will appear here when someone responds."
          }
          action={
            !currentUser && question.status === "open" ? (
              <LinkButton
                href={`/auth?next=${encodeURIComponent(`/question/${question.id}`)}`}
                size="sm"
              >
                Log in to answer
              </LinkButton>
            ) : null
          }
        />
      )}
    </MainContainer>
  );
};

function getAnswerRestrictionMessage(
  currentUser: CurrentUser | null,
  question: Question,
  hasAnswered: boolean,
) {
  if (!currentUser) return null;
  if (question.status === "closed") {
    return "This question is closed, so new answers are disabled.";
  }
  if (question.userId === currentUser.id) {
    return "You asked this question, so other people need to answer it.";
  }
  if (hasAnswered) {
    return "You have already answered this question.";
  }

  return null;
}

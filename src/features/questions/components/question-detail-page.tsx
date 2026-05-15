import { Alert, Stack } from "@mui/joy";
import { AuthLinkButton } from "@/shared/components/auth/auth-link-button";
import { MainContainer } from "@/shared/components/layout/main-container";
import { AnswerForm } from "@/features/questions/components/answer-form";
import { NoData } from "@/shared/components/ui/no-data";
import { QuestionEntry } from "@/shared/components/qa/question-entry";
import { TargetEntry } from "@/shared/components/qa/target-entry";
import { MAIN_BORDERS } from "@/shared/constants/app";
import { getAnswersForQuestion, getQuestionById } from "@/features/questions/server/queries";
import { getCurrentUser } from "@/shared/server/auth";

type QuestionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { id } = await params;
  const questionId = Number(id);
  const [currentUser, question, answers] = await Promise.all([
    getCurrentUser(),
    getQuestionById(questionId),
    getAnswersForQuestion(questionId),
  ]);

  const hasAnswered = answers.some((answer) => answer.userId === currentUser?.id);
  const canAnswer =
    !!currentUser?.profile?.hasDisplayName &&
    question.status === "open" &&
    question.userId !== currentUser.id &&
    !hasAnswered;

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }} noPad>
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
        <NoData title="No answers yet" description="Be the first to share a useful answer." />
      )}
    </MainContainer>
  );
}

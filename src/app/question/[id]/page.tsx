import { Alert, Button, Stack } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { AnswerForm } from "@/components/forms/answer-form";
import { NoData } from "@/components/shared/no-data";
import { QuestionEntry } from "@/components/shared/question-entry";
import { TargetEntry } from "@/components/shared/target-entry";
import { getAnswersForQuestion, getCurrentUser, getQuestionById } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

type QuestionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionPage({ params }: QuestionPageProps) {
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
        <Stack p={2} borderBottom="1px solid">
          <Alert
            variant="soft"
            color="neutral"
            endDecorator={
              <Button component="a" href="/auth" size="sm">
                Sign in
              </Button>
            }
          >
            Sign in to answer this question.
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
            returnTo={`/question/${question.id}`}
          />
        ))
      ) : (
        <NoData />
      )}
    </MainContainer>
  );
}

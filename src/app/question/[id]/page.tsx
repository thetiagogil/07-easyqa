import { Alert, Button, Stack, Typography } from "@mui/joy";
import { AnswerForm } from "@/components/forms/answer-form";
import { AnswerCard } from "@/components/shared/answer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestionCard } from "@/components/shared/question-card";
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
    !!currentUser?.profile &&
    question.status === "open" &&
    question.userId !== currentUser.id &&
    !hasAnswered;

  return (
    <Stack>
      <QuestionCard question={question} returnTo={`/question/${question.id}`} />

      {!currentUser ? (
        <Stack p={2} borderBottom="1px solid" borderColor="divider">
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
        <AnswerForm questionId={question.id} />
      ) : null}

      <Stack>
        {answers.length ? (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              question={question}
              currentUser={currentUser}
            />
          ))
        ) : (
          <EmptyState title="No answers yet" body="The first useful answer will show here." />
        )}
      </Stack>

      {question.status === "closed" ? (
        <Stack p={2}>
          <Typography level="body-xs" textColor="text.tertiary">
            This question is closed because an answer was accepted.
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}

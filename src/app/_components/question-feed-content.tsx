import { NoData } from "@/shared/components/ui/no-data";
import { LinkButton } from "@/shared/components/ui/link-button";
import { TargetEntry } from "@/features/questions/components/target-entry";
import { getQuestions } from "@/features/questions/server/queries";
import type { QuestionSort } from "@/types/easyqa";

type QuestionFeedContentProps = {
  sort: QuestionSort;
};

export const QuestionFeedContent = async ({
  sort,
}: QuestionFeedContentProps) => {
  const questions = await getQuestions(sort);

  if (!questions.length) {
    return (
      <NoData
        title="No questions yet"
        description="Ask the first question to start the feed."
        action={
          <LinkButton href="/question/add" size="sm">
            Ask a question
          </LinkButton>
        }
      />
    );
  }

  return questions.map((question) => (
    <TargetEntry key={question.id} targetType="question" target={question} />
  ));
};

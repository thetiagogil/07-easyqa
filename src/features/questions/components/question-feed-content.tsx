import { NoData } from "@/shared/components/ui/no-data";
import { TargetEntry } from "@/shared/components/target-entry";
import { getQuestions } from "@/features/questions/server/queries";
import type { QuestionSort } from "@/types/easyqa";

type QuestionFeedContentProps = {
  sort: QuestionSort;
};

export async function QuestionFeedContent({ sort }: QuestionFeedContentProps) {
  const questions = await getQuestions(sort);

  if (!questions.length) {
    return <NoData title="No questions yet" description="Ask the first question to start the feed." />;
  }

  return questions.map((question) => (
    <TargetEntry key={question.id} targetType="question" target={question} />
  ));
}

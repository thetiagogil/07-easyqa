import { NoData } from "@/shared/components/ui/no-data";
import { TargetEntry } from "@/shared/components/target-entry";
import {
  getAnsweredQuestionsByProfile,
  getQuestionsByProfile,
} from "@/features/profiles/server/queries";
import type { ProfileTab } from "@/features/profiles/types";

type ProfileTabContentProps = {
  profileId: string;
  tab: ProfileTab;
};

export async function ProfileTabContent({ profileId, tab }: ProfileTabContentProps) {
  const questions =
    tab === "answers"
      ? await getAnsweredQuestionsByProfile(profileId)
      : await getQuestionsByProfile(profileId);

  if (!questions.length) {
    return (
      <NoData
        title={tab === "answers" ? "No answers yet" : "No questions yet"}
        description={
          tab === "answers"
            ? "Answered questions will appear here."
            : "Questions from this profile will appear here."
        }
      />
    );
  }

  return questions.map((question) => (
    <TargetEntry key={question.id} targetType="question" target={question} />
  ));
}

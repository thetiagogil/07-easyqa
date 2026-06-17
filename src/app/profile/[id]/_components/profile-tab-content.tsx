import { NoData } from "@/shared/components/ui/no-data";
import { LinkButton } from "@/shared/components/ui/link-button";
import { TargetEntry } from "@/features/questions/components/target-entry";
import {
  getAnsweredQuestionsByProfile,
  getQuestionsByProfile,
} from "@/features/profiles/server/queries";
import type { ProfileTab } from "@/features/profiles/types";
import { getCurrentUser } from "@/shared/server/auth";

type ProfileTabContentProps = {
  profileId: string;
  tab: ProfileTab;
};

export const ProfileTabContent = async ({
  profileId,
  tab,
}: ProfileTabContentProps) => {
  const [currentUser, questions] = await Promise.all([
    getCurrentUser(),
    tab === "answers"
      ? getAnsweredQuestionsByProfile(profileId)
      : getQuestionsByProfile(profileId),
  ]);
  const isOwnProfile = currentUser?.id === profileId;

  if (!questions.length) {
    return (
      <NoData
        title={tab === "answers" ? "No answers yet" : "No questions yet"}
        description={
          tab === "answers"
            ? "Answered questions will appear here."
            : "Questions from this profile will appear here."
        }
        action={
          isOwnProfile && tab === "questions" ? (
            <LinkButton href="/question/add" size="sm">
              Ask a question
            </LinkButton>
          ) : null
        }
      />
    );
  }

  return questions.map((question) => (
    <TargetEntry key={question.id} targetType="question" target={question} />
  ));
};

import EditIcon from "@mui/icons-material/Edit";
import { Button, Link, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { FollowButton } from "@/components/actions/follow-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { QuestionCard } from "@/components/shared/question-card";
import {
  getAnsweredQuestionsByProfile,
  getCurrentUser,
  getProfileById,
  getQuestionsByProfile,
} from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const tab = query.tab === "answers" ? "answers" : "questions";
  const [currentUser, profile, questions, answeredQuestions] = await Promise.all([
    getCurrentUser(),
    getProfileById(id),
    getQuestionsByProfile(id),
    getAnsweredQuestionsByProfile(id),
  ]);
  const activeQuestions = tab === "answers" ? answeredQuestions : questions;
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <Stack>
      <Stack p={2} gap={2} borderBottom="1px solid" borderColor="divider">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <ProfileAvatar profile={profile} size={78} />
          {isOwnProfile ? (
            <Button
              component="a"
              href="/profile/edit"
              size="sm"
              variant="outlined"
              startDecorator={<EditIcon />}
            >
              Edit
            </Button>
          ) : currentUser?.profile ? (
            <FollowButton profileId={profile.id} isFollowing={!!profile.isViewerFollowing} />
          ) : null}
        </Stack>

        <Stack gap={0.5}>
          <Typography level="h2">{profile.displayName}</Typography>
          {profile.username ? (
            <Typography level="body-sm" textColor="text.tertiary">
              @{profile.username}
            </Typography>
          ) : null}
          {profile.bio ? <Typography level="body-sm">{profile.bio}</Typography> : null}
        </Stack>
      </Stack>

      <Tabs value={tab}>
        <TabList>
          <Tab component="a" href={`/profile/${profile.id}?tab=questions`} value="questions">
            Questions
          </Tab>
          <Tab component="a" href={`/profile/${profile.id}?tab=answers`} value="answers">
            Answers
          </Tab>
        </TabList>
      </Tabs>

      {activeQuestions.length ? (
        activeQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            returnTo={`/profile/${profile.id}?tab=${tab}`}
            compact
          />
        ))
      ) : (
        <EmptyState
          title={tab === "answers" ? "No answered questions" : "No questions"}
          body={
            isOwnProfile && tab === "questions" ? (
              <Link component="a" href="/question/add">
                Ask a question
              </Link>
            ) : undefined
          }
        />
      )}
    </Stack>
  );
}

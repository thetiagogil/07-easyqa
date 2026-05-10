import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Tab, TabList, Tabs, Typography } from "@mui/joy";
import tabClasses from "@mui/joy/Tab/tabClasses";
import { FollowButton } from "@/components/actions/follow-button";
import { MainContainer } from "@/components/layout/main-container";
import { NoData } from "@/components/shared/no-data";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { TargetEntry } from "@/components/shared/target-entry";
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
    <MainContainer navbarProps={{ title: "profile", hasBackButton: true }} noPad>
      <Stack p={2} gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <ProfileAvatar profile={profile} size={80} />

          {isOwnProfile ? (
            <Stack>
              <IconButton component="a" href="/profile/edit" variant="outlined" size="sm">
                <EditIcon />
              </IconButton>
            </Stack>
          ) : currentUser?.profile?.hasDisplayName ? (
            <Stack>
              <FollowButton profileId={profile.id} isFollowing={!!profile.isViewerFollowing} />
            </Stack>
          ) : null}
        </Stack>

        <Stack gap={0.5}>
          <Typography level="h2">{profile.displayName}</Typography>
          {profile.username ? (
            <Typography level="body-sm" textColor="neutral.600">
              @{profile.username}
            </Typography>
          ) : null}
          {profile.bio ? <Typography level="body-sm">{profile.bio}</Typography> : null}
        </Stack>
      </Stack>

      <Tabs value={tab} sx={{ bgcolor: "transparent" }}>
        <TabList
          sx={{
            justifyContent: "center",
            [`&& .${tabClasses.root}`]: {
              flex: 1,
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "transparent",
              },
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
              },
            },
          }}
        >
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
          <TargetEntry
            key={question.id}
            targetType="question"
            target={question}
            returnTo={`/profile/${profile.id}?tab=${tab}`}
          />
        ))
      ) : (
        <NoData />
      )}
    </MainContainer>
  );
}

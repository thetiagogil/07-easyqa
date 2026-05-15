import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Typography } from "@mui/joy";
import { FollowButton } from "@/features/profiles/components/follow-button";
import { getProfileById } from "@/features/profiles/server/queries";
import { PageStack } from "@/shared/components/ui/page-stack";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { getCurrentUser } from "@/shared/server/auth";

type ProfileHeaderProps = {
  profileId: string;
};

export async function ProfileHeader({ profileId }: ProfileHeaderProps) {
  const [currentUser, profile] = await Promise.all([
    getCurrentUser(),
    getProfileById(profileId),
  ]);
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <PageStack>
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
          <Typography level="body-sm" textColor="neutral.500">
            @{profile.username}
          </Typography>
        ) : null}
        {profile.bio ? <Typography level="body-sm">{profile.bio}</Typography> : null}
      </Stack>
    </PageStack>
  );
}

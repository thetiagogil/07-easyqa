import { Box, Link, Stack, Typography } from "@mui/joy";
import type { Profile } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { RelativeTime } from "./time";

type EntryMetaProps = {
  profile: Pick<Profile, "id" | "displayName" | "avatarUrl">;
  action: string;
  createdAt?: string;
  avatarSize?: number;
};

export function EntryMeta({
  profile,
  action,
  createdAt,
  avatarSize = 32,
}: EntryMetaProps) {
  return (
    <Stack direction="row" alignItems="center" gap={1.25} minWidth={0}>
      <Link component="a" href={`/profile/${profile.id}`} underline="none" flexShrink={0}>
        <ProfileAvatar profile={profile} size={avatarSize} />
      </Link>

      <Stack minWidth={0}>
        <Typography level="body-sm" noWrap>
          <Link component="a" href={`/profile/${profile.id}`} color="primary" fontWeight={700}>
            {profile.displayName}
          </Link>{" "}
          <Typography component="span" level="body-sm" textColor="neutral.500">
            {action}
          </Typography>
        </Typography>

        {createdAt ? (
          <Stack direction="row" alignItems="center" gap={0.75}>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "neutral.600",
              }}
            />
            <Typography level="body-xs" textColor="neutral.500">
              <RelativeTime value={createdAt} />
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}

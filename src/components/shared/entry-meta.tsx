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
    <Stack direction="row" flexBasis="100%" alignItems="center" gap={1} minWidth={0}>
      <Link component="a" href={`/profile/${profile.id}`} underline="none" flexShrink={0}>
        <ProfileAvatar profile={profile} size={avatarSize} />
      </Link>

      <Typography level="body-sm" noWrap minWidth={0}>
        <Link component="a" href={`/profile/${profile.id}`} color="primary" fontWeight={700} marginRight={1}>
          {profile.displayName}
        </Link>
        <Typography component="span" level="body-sm" textColor="neutral.400">
          {action}
        </Typography>
      </Typography>

      {createdAt ? (
        <>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              bgcolor: "neutral.600",
              flexShrink: 0,
            }}
          />
          <Typography level="body-sm" textColor="neutral.500" noWrap>
            <RelativeTime value={createdAt} />
          </Typography>
        </>
      ) : null}
    </Stack>
  );
}

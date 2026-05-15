import { Avatar } from "@mui/joy";
import { MAIN_BORDERS } from "@/shared/constants/app";
import type { Profile } from "@/types/easyqa";

export function ProfileAvatar({
  profile,
  size = 32,
}: {
  profile: Pick<Profile, "displayName" | "avatarUrl">;
  size?: number;
}) {
  return (
    <Avatar
      src={profile.avatarUrl ?? undefined}
      alt={profile.displayName}
      sx={{
        width: size,
        height: size,
        fontSize: Math.max(12, size * 0.38),
        fontWeight: 700,
        color: "primary.300",
        bgcolor: "background.level2",
        border: MAIN_BORDERS,
      }}
    >
      {initials(profile.displayName)}
    </Avatar>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

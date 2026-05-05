import { userName } from "@/lib/utils";
import { User } from "@/types";
import { Avatar as JoyAvatar } from "@mui/joy";

type AvatarProps = {
  user: User;
  size?: number;
  fontSize?: number;
};

export const CustomAvatar = ({ user, size, fontSize }: AvatarProps) => {
  return (
    <JoyAvatar
      src={user.avatarUrl ? user.avatarUrl : ""}
      alt={userName(user)}
      sx={{ height: size, width: size, fontSize: fontSize, fontWeight: 700, color: "primary.500" }}
    />
  );
};

import { Button } from "@mui/joy";
import { followProfileAction, unfollowProfileAction } from "@/lib/easyqa/actions";

export function FollowButton({
  profileId,
  isFollowing,
}: {
  profileId: string;
  isFollowing: boolean;
}) {
  const action = isFollowing
    ? unfollowProfileAction.bind(null, profileId, `/profile/${profileId}`)
    : followProfileAction.bind(null, profileId, `/profile/${profileId}`);

  return (
    <form action={action}>
      <Button type="submit" size="sm" variant="outlined" color={isFollowing ? "neutral" : "primary"}>
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </form>
  );
}

import { Button } from "@mui/joy";
import { followProfileAction, unfollowProfileAction } from "@/lib/server/actions";

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
      <Button
        type="submit"
        size="sm"
        variant={isFollowing ? "soft" : "solid"}
        color={isFollowing ? "neutral" : "primary"}
        sx={{ width: 96, transition: "0.3s" }}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </form>
  );
}

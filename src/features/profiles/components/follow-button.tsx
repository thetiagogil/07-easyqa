import { followProfileAction, unfollowProfileAction } from "@/features/profiles/server/actions";
import { SubmitButton } from "@/shared/components/ui/submit-button";

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
      <SubmitButton
        size="sm"
        variant={isFollowing ? "soft" : "solid"}
        color={isFollowing ? "neutral" : "primary"}
        pendingLabel="Saving"
        sx={{ width: 96, transition: "0.3s" }}
      >
        {isFollowing ? "Following" : "Follow"}
      </SubmitButton>
    </form>
  );
}

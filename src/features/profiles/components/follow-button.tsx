"use client";

import { useActionState } from "react";
import {
  followProfileAction,
  unfollowProfileAction,
} from "@/features/profiles/server/actions";
import { ActionStatus } from "@/shared/components/action-status";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import type { ActionState } from "@/shared/types";

export const FollowButton = ({
  profileId,
  isFollowing,
}: {
  profileId: string;
  isFollowing: boolean;
}) => {
  const action = isFollowing
    ? unfollowProfileAction.bind(null, profileId, `/profile/${profileId}`)
    : followProfileAction.bind(null, profileId, `/profile/${profileId}`);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction}>
      <SubmitButton
        size="sm"
        variant={isFollowing ? "soft" : "solid"}
        color={isFollowing ? "neutral" : "primary"}
        pendingLabel="Saving"
        sx={{ width: 96, transition: "0.3s" }}
      >
        {isFollowing ? "Following" : "Follow"}
      </SubmitButton>
      <ActionStatus
        compact
        pending={isPending}
        pendingMessage="Saving..."
        error={state.error}
        success={state.success}
      />
    </form>
  );
};

"use client";

import { useActionState } from "react";
import { markNotificationsReadAction } from "@/features/notifications/server/actions";
import { ActionStatus } from "@/shared/components/action-status";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import type { ActionState } from "@/shared/types";

export const MarkReadButton = ({ disabled }: { disabled?: boolean }) => {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    markNotificationsReadAction,
    {},
  );

  return (
    <form action={formAction}>
      <SubmitButton
        size="sm"
        variant="soft"
        color="neutral"
        disabled={disabled}
        pendingLabel="Saving"
      >
        Mark read
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

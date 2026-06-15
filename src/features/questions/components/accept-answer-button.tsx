"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { acceptAnswerAction } from "@/features/questions/server/actions";
import { ActionStatus } from "@/shared/components/action-status";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import type { ActionState } from "@/shared/types";

export function AcceptAnswerButton({
  answerId,
  questionId,
  children = "Accept",
  color = "success",
}: {
  answerId: number;
  questionId: number;
  children?: ReactNode;
  color?: "neutral" | "success";
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    acceptAnswerAction.bind(null, answerId, questionId),
    {},
  );

  return (
    <form action={formAction}>
      <SubmitButton
        size="sm"
        variant="soft"
        color={color}
        pendingLabel="Saving"
      >
        {children}
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
}

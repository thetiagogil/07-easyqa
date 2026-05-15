import type { ReactNode } from "react";
import { acceptAnswerAction } from "@/shared/server/actions";
import { SubmitButton } from "@/shared/components/ui/submit-button";

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
  return (
    <form action={acceptAnswerAction.bind(null, answerId, questionId)}>
      <SubmitButton size="sm" variant="soft" color={color} pendingLabel="Saving">
        {children}
      </SubmitButton>
    </form>
  );
}

import { Button } from "@mui/joy";
import type { ReactNode } from "react";
import { acceptAnswerAction } from "@/lib/easyqa/actions";

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
      <Button type="submit" size="sm" variant="outlined" color={color}>
        {children}
      </Button>
    </form>
  );
}

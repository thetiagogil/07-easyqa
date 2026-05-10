"use client";

import { Alert, FormControl, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { LIMITS } from "@/lib/constants";
import { createAnswerAction, type ActionState } from "@/lib/easyqa/actions";
import { SubmitButton } from "./submit-button";

export function AnswerForm({ questionId }: { questionId: number }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createAnswerAction.bind(null, questionId),
    {},
  );

  return (
    <Stack component="form" action={formAction} gap={2} p={2} borderBottom="1px solid" borderColor="divider">
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}
      {state.success ? <Alert color="success">{state.success}</Alert> : null}

      <FormControl required>
        <Textarea
          name="content"
          minRows={4}
          maxRows={10}
          placeholder="Write your answer..."
          slotProps={{ textarea: { maxLength: LIMITS.answerContent } }}
        />
      </FormControl>

      <Stack direction="row" justifyContent="flex-end">
        <SubmitButton size="sm">Post answer</SubmitButton>
      </Stack>
    </Stack>
  );
}

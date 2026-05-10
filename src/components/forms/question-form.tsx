"use client";

import { Alert, FormControl, FormHelperText, FormLabel, Input, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { LIMITS } from "@/lib/constants";
import { createQuestionAction, type ActionState } from "@/lib/easyqa/actions";
import { SubmitButton } from "./submit-button";

export function QuestionForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createQuestionAction, {});

  return (
    <Stack component="form" action={formAction} gap={2}>
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}

      <FormControl required>
        <FormLabel>Title</FormLabel>
        <Input name="title" slotProps={{ input: { maxLength: LIMITS.questionTitle } }} />
        <FormHelperText>Ask one clear question.</FormHelperText>
      </FormControl>

      <FormControl required>
        <FormLabel>Details</FormLabel>
        <Textarea
          name="content"
          minRows={7}
          maxRows={14}
          slotProps={{ textarea: { maxLength: LIMITS.questionContent } }}
        />
      </FormControl>

      <SubmitButton>Post question</SubmitButton>
    </Stack>
  );
}

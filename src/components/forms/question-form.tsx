"use client";

import { Alert, FormControl, FormHelperText, FormLabel, Input, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { LIMITS } from "@/lib/constants";
import { createQuestionAction, type ActionState } from "@/lib/server/actions";
import { SubmitButton } from "./submit-button";

export function QuestionForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createQuestionAction, {});

  return (
    <Stack component="form" action={formAction} gap={2}>
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}

      <FormControl required>
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          placeholder="Ask one clear question"
          slotProps={{ input: { maxLength: LIMITS.questionTitle } }}
        />
        <FormHelperText>Keep it specific enough to answer directly.</FormHelperText>
      </FormControl>

      <FormControl required>
        <FormLabel>Content</FormLabel>
        <Textarea
          name="content"
          placeholder="Add context, constraints, and what you tried"
          minRows={7}
          maxRows={14}
          slotProps={{ textarea: { maxLength: LIMITS.questionContent } }}
        />
      </FormControl>

      <SubmitButton fullWidth>Post question</SubmitButton>
    </Stack>
  );
}

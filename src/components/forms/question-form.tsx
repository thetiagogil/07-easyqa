"use client";

import { Alert, FormControl, FormLabel, Input, Stack, Textarea } from "@mui/joy";
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
        <Input
          name="title"
          placeholder="ask one clear question"
          slotProps={{ input: { maxLength: LIMITS.questionTitle } }}
        />
      </FormControl>

      <FormControl required>
        <FormLabel>Content</FormLabel>
        <Textarea
          name="content"
          placeholder="add context, constraints, and what you tried"
          minRows={7}
          maxRows={14}
          slotProps={{ textarea: { maxLength: LIMITS.questionContent } }}
        />
      </FormControl>

      <SubmitButton size="sm">Submit</SubmitButton>
    </Stack>
  );
}

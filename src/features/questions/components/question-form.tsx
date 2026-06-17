"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useActionState, useState } from "react";
import { ActionStatus } from "@/shared/components/action-status";
import { LIMITS } from "@/shared/constants/app";
import { createQuestionAction } from "@/features/questions/server/actions";
import type { ActionState } from "@/shared/types";
import { SubmitButton } from "@/shared/components/ui/submit-button";

export const QuestionForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createQuestionAction,
    {},
  );

  return (
    <Stack component="form" action={formAction} gap={2}>
      <ActionStatus
        pending={isPending}
        pendingMessage="Posting question..."
        error={state.error}
      />

      <FormControl required>
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          value={title}
          placeholder="Ask one clear question"
          disabled={isPending}
          onChange={(event) => setTitle(event.target.value)}
          slotProps={{ input: { maxLength: LIMITS.questionTitle } }}
        />
        <FormHelperText>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <span>Keep it specific enough to answer directly.</span>
            <Typography level="body-xs" textColor="neutral.500">
              {title.length} / {LIMITS.questionTitle}
            </Typography>
          </Stack>
        </FormHelperText>
      </FormControl>

      <FormControl required>
        <FormLabel>Content</FormLabel>
        <Textarea
          name="content"
          value={content}
          placeholder="Add context, constraints, and what you tried"
          disabled={isPending}
          onChange={(event) => setContent(event.target.value)}
          minRows={7}
          maxRows={14}
          slotProps={{ textarea: { maxLength: LIMITS.questionContent } }}
        />
        <FormHelperText>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <span>Include enough detail for someone to answer well.</span>
            <Typography level="body-xs" textColor="neutral.500">
              {content.length} / {LIMITS.questionContent}
            </Typography>
          </Stack>
        </FormHelperText>
      </FormControl>

      <SubmitButton
        fullWidth
        disabled={!title.trim() || !content.trim()}
        pendingLabel="Posting..."
      >
        Post question
      </SubmitButton>
    </Stack>
  );
};

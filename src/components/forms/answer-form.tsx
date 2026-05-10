"use client";

import { Alert, FormControl, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { LIMITS } from "@/lib/constants";
import { createAnswerAction, type ActionState } from "@/lib/easyqa/actions";
import type { Profile } from "@/types/easyqa";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { SubmitButton } from "./submit-button";

export function AnswerForm({
  questionId,
  profile,
}: {
  questionId: number;
  profile?: Profile | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createAnswerAction.bind(null, questionId),
    {},
  );

  return (
    <Stack component="form" action={formAction} gap={3} p={2} borderBottom="1px solid">
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}
      {state.success ? <Alert color="success">{state.success}</Alert> : null}

      <Stack direction="row" alignItems="flex-start" gap={1}>
        {profile ? <ProfileAvatar profile={profile} size={32} /> : null}
        <FormControl required sx={{ flexGrow: 1 }}>
          <Textarea
            name="content"
            variant="plain"
            minRows={3}
            maxRows={10}
            placeholder="write your answer..."
            slotProps={{ textarea: { maxLength: LIMITS.answerContent } }}
            sx={{
              flexGrow: 1,
              fontSize: 14,
              border: "none",
              boxShadow: "none",
              py: 0,
              "& textarea": {
                textAlign: "justify",
                textTransform: "none",
                pt: 0.5,
              },
              "::before": { boxShadow: "none" },
            }}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        <SubmitButton size="sm">Submit</SubmitButton>
      </Stack>
    </Stack>
  );
}

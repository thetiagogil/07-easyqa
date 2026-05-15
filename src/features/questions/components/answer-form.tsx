"use client";

import { Alert, Stack, Textarea, Typography } from "@mui/joy";
import { useActionState, useState } from "react";
import { LIMITS, MAIN_BORDERS } from "@/shared/constants/app";
import { createAnswerAction } from "@/shared/server/qa/actions";
import type { ActionState } from "@/shared/types";
import type { Profile } from "@/types/easyqa";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { SubmitButton } from "@/shared/components/ui/submit-button";

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
  const [content, setContent] = useState("");
  const isContentMaxed = content.length >= LIMITS.answerContent;
  const isContentAlmostMaxed = content.length >= LIMITS.answerContent * 0.8;
  const isValidLength = content.trim().length > 0 && content.length <= LIMITS.answerContent;

  return (
    <Stack
      component="form"
      action={formAction}
      gap={3}
      p={2}
      borderBottom={MAIN_BORDERS}
    >
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}
      {state.success ? <Alert color="success">{state.success}</Alert> : null}

      <Stack direction="row" alignItems="flex-start" gap={1}>
        {profile ? <ProfileAvatar profile={profile} size={32} /> : null}

        <Textarea
          name="content"
          variant="plain"
          placeholder="Write your answer here..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
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
            backgroundColor: "inherit",
          }}
        />
      </Stack>

      {content ? (
        <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1}>
          <Typography
            level="body-sm"
            color={isContentMaxed ? "danger" : isContentAlmostMaxed ? "warning" : "neutral"}
          >
            {content.length} / {LIMITS.answerContent}
          </Typography>

          <SubmitButton size="sm" disabled={!isValidLength}>
            Submit
          </SubmitButton>
        </Stack>
      ) : null}
    </Stack>
  );
}

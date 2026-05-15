"use client";

import { FormControl, FormHelperText, FormLabel, Input, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { ActionStatus } from "@/shared/components/action-status";
import { LIMITS } from "@/shared/constants/app";
import { updateProfileAction } from "@/features/profiles/server/actions";
import type { ActionState } from "@/shared/types";
import type { Profile } from "@/types/easyqa";
import { SubmitButton } from "@/shared/components/ui/submit-button";

export function ProfileForm({
  profile,
  submitLabel = "Confirm",
}: {
  profile?: Profile | null;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateProfileAction,
    {},
  );
  const isSaveAction = submitLabel.toLowerCase().includes("save");
  const pendingMessage = isSaveAction
    ? "Saving profile..."
    : "Setting up profile...";
  const pendingLabel = isSaveAction ? "Saving..." : "Setting up...";

  return (
    <Stack component="form" action={formAction} gap={2}>
      <ActionStatus
        pending={isPending}
        pendingMessage={pendingMessage}
        error={state.error}
      />

      <FormControl required>
        <FormLabel>Name</FormLabel>
        <Input
          name="displayName"
          defaultValue={profile?.hasDisplayName ? profile.displayName : ""}
          placeholder="Display name"
          slotProps={{ input: { maxLength: LIMITS.profileName } }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          defaultValue={profile?.username ?? ""}
          placeholder="easyqa_user"
          slotProps={{ input: { maxLength: 30 } }}
        />
        <FormHelperText>Optional. Use lowercase letters, numbers, and underscores.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          placeholder="A short note about what you know"
          minRows={4}
          maxRows={6}
          slotProps={{ textarea: { maxLength: LIMITS.profileBio } }}
        />
      </FormControl>

      <SubmitButton fullWidth pendingLabel={pendingLabel}>
        {submitLabel}
      </SubmitButton>
    </Stack>
  );
}

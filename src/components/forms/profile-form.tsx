"use client";

import { Alert, FormControl, FormHelperText, FormLabel, Input, Stack, Textarea } from "@mui/joy";
import { useActionState } from "react";
import { LIMITS } from "@/lib/constants";
import { updateProfileAction, type ActionState } from "@/lib/easyqa/actions";
import type { Profile } from "@/types/easyqa";
import { SubmitButton } from "./submit-button";

export function ProfileForm({ profile }: { profile?: Profile | null }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfileAction, {});

  return (
    <Stack component="form" action={formAction} gap={2}>
      {state.error ? <Alert color="danger">{state.error}</Alert> : null}

      <FormControl required>
        <FormLabel>Display name</FormLabel>
        <Input
          name="displayName"
          defaultValue={profile?.hasDisplayName ? profile.displayName : ""}
          slotProps={{ input: { maxLength: LIMITS.profileName } }}
        />
        <FormHelperText>Shown beside your questions and answers.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          defaultValue={profile?.username ?? ""}
          placeholder="lowercase_handle"
          slotProps={{ input: { maxLength: 30 } }}
        />
        <FormHelperText>Optional. Use lowercase letters, numbers, and underscores.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          minRows={4}
          maxRows={6}
          slotProps={{ textarea: { maxLength: LIMITS.profileBio } }}
        />
      </FormControl>

      <SubmitButton>Save profile</SubmitButton>
    </Stack>
  );
}

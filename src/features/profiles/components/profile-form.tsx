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
import { updateProfileAction } from "@/features/profiles/server/actions";
import type { ActionState } from "@/shared/types";
import type { Profile } from "@/types/easyqa";
import { SubmitButton } from "@/shared/components/ui/submit-button";

export const ProfileForm = ({
  profile,
  submitLabel = "Confirm",
}: {
  profile?: Profile | null;
  submitLabel?: string;
}) => {
  const [displayName, setDisplayName] = useState(
    profile?.hasDisplayName ? profile.displayName : "",
  );
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
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
          value={displayName}
          placeholder="Display name"
          disabled={isPending}
          onChange={(event) => setDisplayName(event.target.value)}
          slotProps={{ input: { maxLength: LIMITS.profileName } }}
        />
        <FormHelperText>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <span>Shown next to your questions and answers.</span>
            <Typography level="body-xs" textColor="neutral.500">
              {displayName.length} / {LIMITS.profileName}
            </Typography>
          </Stack>
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          value={username}
          placeholder="easyqa_user"
          disabled={isPending}
          onChange={(event) => setUsername(event.target.value)}
          slotProps={{ input: { maxLength: 30 } }}
        />
        <FormHelperText>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <span>
              Optional. Use lowercase letters, numbers, and underscores.
            </span>
            <Typography level="body-xs" textColor="neutral.500">
              {username.length} / 30
            </Typography>
          </Stack>
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Textarea
          name="bio"
          value={bio}
          placeholder="A short note about what you know"
          disabled={isPending}
          onChange={(event) => setBio(event.target.value)}
          minRows={4}
          maxRows={6}
          slotProps={{ textarea: { maxLength: LIMITS.profileBio } }}
        />
        <FormHelperText>
          <Stack direction="row" justifyContent="flex-end" width="100%">
            <Typography level="body-xs" textColor="neutral.500">
              {bio.length} / {LIMITS.profileBio}
            </Typography>
          </Stack>
        </FormHelperText>
      </FormControl>

      <SubmitButton fullWidth pendingLabel={pendingLabel}>
        {submitLabel}
      </SubmitButton>
    </Stack>
  );
};

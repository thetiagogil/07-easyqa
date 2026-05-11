import { SignOutButton } from "@/components/actions/sign-out-button";
import { ProfileForm } from "@/components/forms/profile-form";
import { requireUser } from "@/lib/easyqa/data";
import { Stack, Typography } from "@mui/joy";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const currentUser = await requireUser();
  if (currentUser.profile?.hasDisplayName) redirect("/");

  return (
    <Stack minHeight="100dvh" justifyContent="center" alignItems="center" p={2}>
      <Stack width="100%" maxWidth={400} gap={4}>
        <Stack gap={1} textAlign="center">
          <Typography level="h3">Set up your profile</Typography>
          <Typography level="body-sm" textColor="neutral.500">
            Choose how your name appears next to questions and answers.
          </Typography>
        </Stack>

        <ProfileForm profile={currentUser.profile} />

        <SignOutButton label="Use another account" size="sm" fullWidth />
      </Stack>
    </Stack>
  );
}

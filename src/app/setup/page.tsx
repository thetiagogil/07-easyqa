import { Stack, Typography } from "@mui/joy";
import { ProfileForm } from "@/components/forms/profile-form";
import { requireUser } from "@/lib/easyqa/data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const currentUser = await requireUser();
  if (currentUser.profile?.hasDisplayName) redirect("/");

  return (
    <Stack p={2} gap={3}>
      <Stack gap={1}>
        <Typography level="h2">Set up profile</Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          Your profile lives in the shared core schema and is reused across apps.
        </Typography>
      </Stack>
      <ProfileForm profile={currentUser.profile} />
    </Stack>
  );
}

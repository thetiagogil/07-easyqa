import { Stack, Typography } from "@mui/joy";
import { ProfileForm } from "@/components/forms/profile-form";
import { requireUser } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const currentUser = await requireUser();

  return (
    <Stack p={2} gap={3}>
      <Stack gap={1}>
        <Typography level="h2">Edit profile</Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          Updates are written to core.profiles under your authenticated user.
        </Typography>
      </Stack>
      <ProfileForm profile={currentUser.profile} />
    </Stack>
  );
}

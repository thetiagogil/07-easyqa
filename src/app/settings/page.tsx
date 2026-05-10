import { Divider, Stack, Typography } from "@mui/joy";
import { SignOutButton } from "@/components/actions/sign-out-button";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const currentUser = await requireProfile();

  return (
    <Stack p={2} gap={3}>
      <Stack gap={1}>
        <Typography level="h2">Settings</Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          Signed in as {currentUser.email ?? "a Supabase user"}.
        </Typography>
      </Stack>

      <Divider />

      <Stack gap={1}>
        <Typography level="title-md">Account</Typography>
        <SignOutButton />
      </Stack>
    </Stack>
  );
}

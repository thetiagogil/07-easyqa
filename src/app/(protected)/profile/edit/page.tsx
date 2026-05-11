import { Stack } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { ProfileForm } from "@/components/forms/profile-form";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const currentUser = await requireProfile();

  return (
    <MainContainer navbarProps={{ title: "edit profile", hasBackButton: true }} noPad>
      <Stack p={2} gap={3}>
        <ProfileForm profile={currentUser.profile} submitLabel="Save" />
      </Stack>
    </MainContainer>
  );
}

import { MainContainer } from "@/shared/components/layout/main-container";
import { ProfileForm } from "@/features/profiles/components/profile-form";
import { PageStack } from "@/shared/components/ui/page-stack";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { requireProfile } from "@/shared/server/auth";

export async function EditProfilePage() {
  const currentUser = await requireProfile();

  return (
    <MainContainer navbarProps={{ title: "edit profile", hasBackButton: true }} noPad>
      <PageStack>
        <SectionHeading title="Profile" description="Update the public information shown with your activity." />
        <ProfileForm profile={currentUser.profile} submitLabel="Save" />
      </PageStack>
    </MainContainer>
  );
}

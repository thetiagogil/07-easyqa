import { MainContainer } from "@/components/layout/main-container";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageStack } from "@/components/shared/page-stack";
import { SectionHeading } from "@/components/shared/section-heading";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
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

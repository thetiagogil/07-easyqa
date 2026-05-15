import { Suspense } from "react";
import { ProfileHeader } from "@/features/profiles/components/profile-header";
import { ProfileTabContent } from "@/features/profiles/components/profile-tab-content";
import { MainContainer } from "@/shared/components/layout/main-container";
import { Loading } from "@/shared/components/ui/loading";
import { RouteTabs } from "@/shared/components/ui/route-tabs";
import type { ProfileTab } from "@/features/profiles/types";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const tab: ProfileTab = query.tab === "answers" ? "answers" : "questions";

  return (
    <MainContainer navbarProps={{ title: "profile", hasBackButton: true }} noPad>
      <Suspense fallback={<Loading minHeight={220} justifyContent="center" />}>
        <ProfileHeader profileId={id} />
      </Suspense>

      <RouteTabs
        value={tab}
        tabs={[
          { label: "Questions", href: `/profile/${id}?tab=questions`, value: "questions" },
          { label: "Answers", href: `/profile/${id}?tab=answers`, value: "answers" },
        ]}
      />

      <Suspense key={`${id}-${tab}`} fallback={<Loading minHeight={260} justifyContent="center" />}>
        <ProfileTabContent profileId={id} tab={tab} />
      </Suspense>
    </MainContainer>
  );
}

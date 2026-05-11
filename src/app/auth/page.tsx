import { MainContainer } from "@/components/layout/main-container";
import { AuthForm } from "@/components/forms/auth-form";
import { PageStack } from "@/components/shared/page-stack";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { getCurrentUser } from "@/lib/server/data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AuthPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser?.profile?.hasDisplayName) redirect("/");
  if (currentUser && !currentUser.profile?.hasDisplayName) redirect("/setup");
  const { next } = await searchParams;
  const safeNext = safeRedirectPath(next, "/");

  return (
    <MainContainer navbarProps={{ title: "log in", hasBackButton: true }} noPad>
      <PageStack>
        <AuthForm next={safeNext} />
      </PageStack>
    </MainContainer>
  );
}

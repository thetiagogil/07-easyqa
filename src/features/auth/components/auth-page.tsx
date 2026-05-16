import { MainContainer } from "@/shared/components/layout/main-container";
import { AuthForm } from "@/features/auth/components/auth-form";
import { PageStack } from "@/shared/components/ui/page-stack";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { getCurrentUser } from "@/shared/server/auth";
import { redirect } from "next/navigation";

type AuthPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export async function AuthPage({ searchParams }: AuthPageProps) {
  const currentUser = await getCurrentUser();
  if (currentUser?.profile?.hasDisplayName) redirect("/");
  if (currentUser && !currentUser.profile?.hasDisplayName) redirect("/setup");
  const { error, next } = await searchParams;
  const safeNext = safeRedirectPath(next, "/");

  return (
    <MainContainer navbarProps={{ title: "log in", hasBackButton: true }} noPad>
      <PageStack>
        <AuthForm initialError={error ?? null} next={safeNext} />
      </PageStack>
    </MainContainer>
  );
}

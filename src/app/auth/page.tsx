import { Stack } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { AuthForm } from "@/components/forms/auth-form";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { getCurrentUser } from "@/lib/easyqa/data";
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
    <MainContainer navbarProps={{ title: "login", hasBackButton: true }} noPad>
      <Stack p={2} gap={3}>
        <AuthForm next={safeNext} />
      </Stack>
    </MainContainer>
  );
}

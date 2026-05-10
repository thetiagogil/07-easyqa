import { Stack, Typography } from "@mui/joy";
import { AuthForm } from "@/components/forms/auth-form";
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

  return (
    <Stack p={2} gap={3}>
      <Stack gap={1}>
        <Typography level="h2">Sign in</Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          Use Supabase Auth so writes run under your own user and RLS policies.
        </Typography>
      </Stack>
      <AuthForm next={next ?? "/"} />
    </Stack>
  );
}

import { AuthPage } from "@/features/auth/components/auth-page";

export const dynamic = "force-dynamic";

type AuthPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default function Page(props: AuthPageProps) {
  return <AuthPage {...props} />;
}

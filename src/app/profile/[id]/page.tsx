import { ProfilePage } from "./_components/profile-page";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default function Page(props: ProfilePageProps) {
  return <ProfilePage {...props} />;
}

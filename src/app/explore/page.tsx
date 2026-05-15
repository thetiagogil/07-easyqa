import { ProfileExplorePage } from "@/features/profiles/components/profile-explore-page";

export const dynamic = "force-dynamic";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function ExplorePage(props: ExplorePageProps) {
  return <ProfileExplorePage {...props} />;
}

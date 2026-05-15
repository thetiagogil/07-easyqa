import { ExplorePage as ExploreFeaturePage } from "@/features/explore/components/explore-page";

export const dynamic = "force-dynamic";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function ExplorePage(props: ExplorePageProps) {
  return <ExploreFeaturePage {...props} />;
}

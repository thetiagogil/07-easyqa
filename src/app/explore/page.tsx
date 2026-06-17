import { ExplorePage as ExploreFeaturePage } from "./_components/explore-page";

export const dynamic = "force-dynamic";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function ExplorePage(props: ExplorePageProps) {
  return <ExploreFeaturePage {...props} />;
}

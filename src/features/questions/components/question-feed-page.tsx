import { Alert } from "@mui/joy";
import { Suspense } from "react";
import { QuestionFeedContent } from "@/features/questions/components/question-feed-content";
import { MainContainer } from "@/shared/components/layout/main-container";
import { Loading } from "@/shared/components/ui/loading";
import { RouteTabs } from "@/shared/components/ui/route-tabs";
import { APP_RADIUS, MAIN_BORDERS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import type { QuestionSort } from "@/types/easyqa";

type QuestionFeedPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export async function QuestionFeedPage({ searchParams }: QuestionFeedPageProps) {
  const params = await searchParams;
  const sort: QuestionSort = params.sort === "top" ? "top" : "new";
  const isConfigured = isSupabaseConfigured();

  return (
    <MainContainer navbarProps={{ title: "home", showLoginButton: true }} noPad>
      <RouteTabs
        value={sort}
        sticky
        tabs={[
          { label: "new", href: "/?sort=new", value: "new" },
          { label: "top", href: "/?sort=top", value: "top" },
        ]}
      />

      {isConfigured ? null : (
        <Alert color="warning" variant="soft" sx={{ borderRadius: APP_RADIUS, borderBottom: MAIN_BORDERS }}>
          Supabase is not configured. Add `.env.local` from `.env.local.example`.
        </Alert>
      )}

      <Suspense key={sort} fallback={<Loading minHeight={260} justifyContent="center" />}>
        <QuestionFeedContent sort={sort} />
      </Suspense>
    </MainContainer>
  );
}

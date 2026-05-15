import { Alert } from "@mui/joy";
import { MainContainer } from "@/shared/components/layout/main-container";
import { NoData } from "@/shared/components/ui/no-data";
import { RouteTabs } from "@/shared/components/ui/route-tabs";
import { TargetEntry } from "@/shared/components/qa/target-entry";
import { APP_RADIUS, MAIN_BORDERS } from "@/shared/constants/app";
import { isSupabaseConfigured } from "@/lib/env";
import { getQuestions } from "@/features/questions/server/queries";
import type { QuestionSort } from "@/types/easyqa";

type QuestionFeedPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export async function QuestionFeedPage({ searchParams }: QuestionFeedPageProps) {
  const params = await searchParams;
  const sort: QuestionSort = params.sort === "top" ? "top" : "new";
  const isConfigured = isSupabaseConfigured();
  const questions = await getQuestions(sort);

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

      {questions.length ? (
        questions.map((question) => <TargetEntry key={question.id} targetType="question" target={question} />)
      ) : (
        <NoData title="No questions yet" description="Ask the first question to start the feed." />
      )}
    </MainContainer>
  );
}

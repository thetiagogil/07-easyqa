import { Alert } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { NoData } from "@/components/shared/no-data";
import { RouteTabs } from "@/components/shared/route-tabs";
import { TargetEntry } from "@/components/shared/target-entry";
import { APP_RADIUS, MAIN_BORDERS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { getQuestions } from "@/lib/server/data";
import type { QuestionSort } from "@/types/easyqa";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
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
        questions.map((question) => (
          <TargetEntry
            key={question.id}
            targetType="question"
            target={question}
          />
        ))
      ) : (
        <NoData title="No questions yet" description="Ask the first question to start the feed." />
      )}
    </MainContainer>
  );
}

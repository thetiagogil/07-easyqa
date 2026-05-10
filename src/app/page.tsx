import { Alert, Tab, TabList, Tabs } from "@mui/joy";
import tabClasses from "@mui/joy/Tab/tabClasses";
import { MainContainer } from "@/components/layout/main-container";
import { NoData } from "@/components/shared/no-data";
import { TargetEntry } from "@/components/shared/target-entry";
import { isSupabaseConfigured } from "@/lib/env";
import { getQuestions } from "@/lib/easyqa/data";
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
      <Tabs value={sort} sx={{ bgcolor: "transparent" }}>
        <TabList
          sticky="top"
          sx={{
            top: 56,
            justifyContent: "center",
            [`&& .${tabClasses.root}`]: {
              flex: 1,
              bgcolor: "transparent",
              "&:hover": { bgcolor: "transparent" },
              [`&.${tabClasses.selected}`]: { color: "primary.plainColor" },
            },
          }}
        >
          <Tab component="a" href="/?sort=new" value="new">
            new
          </Tab>
          <Tab component="a" href="/?sort=top" value="top">
            top
          </Tab>
        </TabList>
      </Tabs>

      {isConfigured ? null : (
        <Alert color="warning" variant="soft" sx={{ borderRadius: 0 }}>
          Supabase is not configured. Add `.env.local` from `.env.local.example`.
        </Alert>
      )}

      {questions.length ? (
        questions.map((question) => (
          <TargetEntry
            key={question.id}
            targetType="question"
            target={question}
            returnTo={`/?sort=${sort}`}
          />
        ))
      ) : (
        <NoData />
      )}
    </MainContainer>
  );
}

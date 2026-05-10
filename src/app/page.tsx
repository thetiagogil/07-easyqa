import { Alert, Button, Link, Stack, Typography } from "@mui/joy";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestionCard } from "@/components/shared/question-card";
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
    <Stack>
      <Stack p={2} gap={1} borderBottom="1px solid" borderColor="divider">
        <Typography level="h2">Questions</Typography>
        <Typography
          level="body-sm"
          textColor="text.tertiary"
          sx={{ whiteSpace: "normal", overflowWrap: "break-word" }}
        >
          Ask clearly. Answer carefully.
        </Typography>
        <Stack direction="row" gap={1} mt={1}>
          <Button component="a" href="/?sort=new" size="sm" variant={sort === "new" ? "solid" : "outlined"}>
            New
          </Button>
          <Button component="a" href="/?sort=top" size="sm" variant={sort === "top" ? "solid" : "outlined"}>
            Top
          </Button>
        </Stack>
        {!isConfigured ? (
          <Alert color="warning" variant="soft">
            Supabase is not configured. Add `.env.local` from `.env.local.example`.
          </Alert>
        ) : null}
      </Stack>

      {questions.length ? (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            returnTo={`/?sort=${sort}`}
            compact
          />
        ))
      ) : (
        <EmptyState
          title="No questions yet"
          body={
            <>
              <Link component="a" href="/question/add">
                Ask the first question
              </Link>
              .
            </>
          }
        />
      )}
    </Stack>
  );
}

import { Stack, Typography } from "@mui/joy";
import { QuestionForm } from "@/components/forms/question-form";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function AddQuestionPage() {
  await requireProfile();

  return (
    <Stack p={2} gap={3}>
      <Stack gap={1}>
        <Typography level="h2">Ask a question</Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          The database will attach your authenticated profile automatically.
        </Typography>
      </Stack>
      <QuestionForm />
    </Stack>
  );
}

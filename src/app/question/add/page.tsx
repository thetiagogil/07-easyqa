import { Stack } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { QuestionForm } from "@/components/forms/question-form";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function AddQuestionPage() {
  await requireProfile();

  return (
    <MainContainer navbarProps={{ title: "add question", hasBackButton: true }} noPad>
      <Stack p={2} gap={3}>
        <QuestionForm />
      </Stack>
    </MainContainer>
  );
}

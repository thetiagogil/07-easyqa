import { MainContainer } from "@/components/layout/main-container";
import { QuestionForm } from "@/components/forms/question-form";
import { PageStack } from "@/components/shared/page-stack";
import { SectionHeading } from "@/components/shared/section-heading";

export const dynamic = "force-dynamic";

export default async function AddQuestionPage() {
  return (
    <MainContainer navbarProps={{ title: "add question", hasBackButton: true }} noPad>
      <PageStack>
        <SectionHeading
          title="Ask a question"
          description="Use a clear title and enough context for someone to answer well."
        />
        <QuestionForm />
      </PageStack>
    </MainContainer>
  );
}

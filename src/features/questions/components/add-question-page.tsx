import { MainContainer } from "@/shared/components/layout/main-container";
import { QuestionForm } from "@/features/questions/components/question-form";
import { PageStack } from "@/shared/components/ui/page-stack";
import { SectionHeading } from "@/shared/components/ui/section-heading";

export function AddQuestionPage() {
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

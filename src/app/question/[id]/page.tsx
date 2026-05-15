import { QuestionDetailPage } from "@/features/questions/components/question-detail-page";

export const dynamic = "force-dynamic";

type QuestionPageProps = {
  params: Promise<{ id: string }>;
};

export default function QuestionPage(props: QuestionPageProps) {
  return <QuestionDetailPage {...props} />;
}

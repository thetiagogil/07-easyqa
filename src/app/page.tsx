import { QuestionFeedPage } from "@/features/questions/components/question-feed-page";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default function Home(props: HomeProps) {
  return <QuestionFeedPage {...props} />;
}

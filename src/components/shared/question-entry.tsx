import { Stack, Typography } from "@mui/joy";
import { VoteControls } from "@/components/actions/vote-controls";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Question } from "@/types/easyqa";
import { EntryMeta } from "./entry-meta";
import { QuestionStatusChip } from "./question-status-chip";

type QuestionEntryProps = {
  question: Question;
};

export function QuestionEntry({ question }: QuestionEntryProps) {
  const isClosed = question.status === "closed";

  return (
    <Stack borderBottom={MAIN_BORDERS} p={{ xs: 2, sm: 2.5 }} gap={2}>
      <EntryMeta profile={question.author} action="asked a question" createdAt={question.createdAt} />

      <Stack gap={1}>
        <Typography level="title-md" fontWeight={800}>
          {question.title}
        </Typography>
        <Typography level="body-sm" textColor="neutral.300" whiteSpace="pre-line">
          {question.content}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <VoteControls
          target={question}
          targetType="question"
          returnTo={`/question/${question.id}`}
          disabled={isClosed}
        />

        <QuestionStatusChip status={question.status} />
      </Stack>
    </Stack>
  );
}

import { Stack, Typography } from "@mui/joy";
import { VoteControls } from "@/shared/components/qa/vote-controls";
import { MAIN_BORDERS } from "@/shared/constants/app";
import type { Question } from "@/types/easyqa";
import { EntryMeta } from "./entry-meta";
import { QuestionStatusChip } from "./question-status-chip";

type QuestionEntryProps = {
  question: Question;
};

export function QuestionEntry({ question }: QuestionEntryProps) {
  const isClosed = question.status === "closed";

  return (
    <Stack borderBottom={MAIN_BORDERS} p={2} gap={1}>
      <EntryMeta profile={question.author} action="asked a question" createdAt={question.createdAt} />

      <Stack gap={1}>
        <Typography level="title-sm">
          {question.title}
        </Typography>
        <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
          {question.content}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <VoteControls
          key={`question-${question.id}-${question.voteScore}-${question.viewerVoteValue ?? "none"}`}
          target={question}
          targetType="question"
          disabled={isClosed}
        />

        <QuestionStatusChip status={question.status} />
      </Stack>
    </Stack>
  );
}

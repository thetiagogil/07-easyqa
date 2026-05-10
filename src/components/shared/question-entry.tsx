import { Chip, Link, Stack, Typography } from "@mui/joy";
import { VoteControls } from "@/components/actions/vote-controls";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Question } from "@/types/easyqa";
import { ProfileAvatar } from "./profile-avatar";
import { RelativeTime } from "./time";

type QuestionEntryProps = {
  question: Question;
};

export function QuestionEntry({ question }: QuestionEntryProps) {
  const isClosed = question.status === "closed";

  return (
    <Stack borderBottom={MAIN_BORDERS} p={2} gap={1}>
      <Stack direction="row" flexBasis="100%" alignItems="center" gap={1}>
        <Link component="a" href={`/profile/${question.author.id}`} underline="none">
          <ProfileAvatar profile={question.author} size={32} />
        </Link>

        <Typography level="body-sm">
          <Link
            component="a"
            href={`/profile/${question.author.id}`}
            color="primary"
            fontWeight="bold"
            marginRight={1}
          >
            {question.author.displayName}
          </Link>
          asked a question
        </Typography>
        <Typography level="body-sm" textColor="neutral.600" fontSize={10}>
          •
        </Typography>
        <Typography level="body-sm" textColor="neutral.600">
          <RelativeTime value={question.createdAt} />
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography level="title-sm">{question.title}</Typography>
        <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
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

        <Chip
          variant="outlined"
          color={question.status === "open" ? "neutral" : "success"}
          disabled={isClosed}
        >
          {question.status}
        </Chip>
      </Stack>
    </Stack>
  );
}

import { MAIN_BORDERS } from "@/lib/constants";
import { dateFromNow, userName } from "@/lib/utils";
import { Question } from "@/types";
import { Chip, Link, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useMemo } from "react";
import { CustomAvatar } from "./custom-avatar";
import { VoteEntry } from "./vote-entry";

type QuestionEntryProps = {
  question: Question;
};

export const QuestionEntry = ({ question }: QuestionEntryProps) => {
  const askedAt = useMemo(() => dateFromNow(question.createdAt!), [question.createdAt]);
  const isClosed = question?.status === "closed";

  return (
    <Stack borderBottom={MAIN_BORDERS} p={2} gap={1}>
      <Stack direction="row" flexBasis="100%" alignItems="center" gap={1}>
        <CustomAvatar user={question.user} size={32} fontSize={12} />

        <Typography level="body-sm">
          <Link
            component={NextLink}
            href={`/profile/${question.user?.id}`}
            color="primary"
            fontWeight="bold"
            marginRight={1}
          >
            {userName(question.user)}
          </Link>
          {question ? "asked a question" : "answered"}
        </Typography>
        <Typography level="body-sm" textColor="neutral.600" fontSize={10}>
          •
        </Typography>
        <Typography level="body-sm" textColor="neutral.600">
          {askedAt}
        </Typography>
      </Stack>

      <Stack gap={1}>
        {question && <Typography level="title-sm">{question.title}</Typography>}
        <Typography level="body-sm" textAlign="justify" whiteSpace="pre-line">
          {question.content}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <VoteEntry target={question} targetType="question" isClosed={isClosed} />

        <Chip
          variant="outlined"
          color={
            question.status === "open"
              ? "neutral"
              : question.status === "answered"
                ? "success"
                : "neutral"
          }
          disabled={question.status === "closed"}
        >
          {question.status}
        </Chip>
      </Stack>
    </Stack>
  );
};

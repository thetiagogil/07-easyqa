import { Chip } from "@mui/joy";
import type { QuestionStatus } from "@/types/easyqa";

export function QuestionStatusChip({ status }: { status: QuestionStatus }) {
  const isClosed = status === "closed";

  return (
    <Chip
      size="sm"
      variant={isClosed ? "soft" : "outlined"}
      color={isClosed ? "success" : "neutral"}
      sx={{ textTransform: "capitalize", fontWeight: 700 }}
    >
      {status}
    </Chip>
  );
}

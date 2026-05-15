import { Chip } from "@mui/joy";
import type { QuestionStatus } from "@/types/easyqa";

type QuestionStatusChipProps = {
  status: QuestionStatus;
  openColor?: "primary" | "neutral";
};

export function QuestionStatusChip({ status, openColor = "neutral" }: QuestionStatusChipProps) {
  const isClosed = status === "closed";

  return (
    <Chip
      size="sm"
      variant="outlined"
      color={isClosed ? "neutral" : openColor}
      disabled={isClosed}
      sx={{ textTransform: "capitalize" }}
    >
      {status}
    </Chip>
  );
}

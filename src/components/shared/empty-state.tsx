import { Stack, Typography } from "@mui/joy";
import type { ReactNode } from "react";

export function EmptyState({ title, body }: { title: string; body?: ReactNode }) {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight={220} px={3} textAlign="center" gap={1}>
      <Typography level="title-md">{title}</Typography>
      {body ? (
        <Typography level="body-sm" textColor="text.tertiary">
          {body}
        </Typography>
      ) : null}
    </Stack>
  );
}

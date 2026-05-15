import { Stack, Typography } from "@mui/joy";
import type { ReactNode } from "react";
import { MAIN_BORDERS } from "@/shared/constants/app";

type RouteFeedbackProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function RouteFeedback({ title, description, children }: RouteFeedbackProps) {
  return (
    <Stack
      component="main"
      minHeight="100dvh"
      width="100%"
      maxWidth={{ xs: "100%", sm: 500 }}
      borderRight={{ xs: "none", sm: MAIN_BORDERS }}
      borderLeft={{ xs: "none", sm: MAIN_BORDERS }}
      bgcolor="background.body"
      margin="auto"
      alignItems="center"
      justifyContent="center"
      gap={2}
      p={3}
      textAlign="center"
    >
      {title || description ? (
        <Stack gap={0.75}>
          {title ? <Typography level="h3">{title}</Typography> : null}
          {description ? (
            <Typography level="body-sm" textColor="neutral.500">
              {description}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      {children}
    </Stack>
  );
}

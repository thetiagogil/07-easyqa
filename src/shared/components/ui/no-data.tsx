import InboxIcon from "@mui/icons-material/Inbox";
import { Stack, Typography } from "@mui/joy";
import type { ReactNode } from "react";

export const NoData = ({
  title = "Nothing here yet",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={1}
      p={4}
      textAlign="center"
    >
      <InboxIcon color="disabled" />
      <Typography level="title-sm">{title}</Typography>
      {description ? (
        <Typography level="body-sm" textColor="neutral.500" maxWidth={320}>
          {description}
        </Typography>
      ) : null}
      {action ? <Stack pt={1}>{action}</Stack> : null}
    </Stack>
  );
};

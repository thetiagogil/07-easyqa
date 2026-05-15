import InboxIcon from "@mui/icons-material/Inbox";
import { Stack, Typography } from "@mui/joy";

export function NoData({
  title = "Nothing here yet",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Stack alignItems="center" justifyContent="center" gap={1} p={4} textAlign="center">
      <InboxIcon color="disabled" />
      <Typography level="title-sm">{title}</Typography>
      {description ? (
        <Typography level="body-sm" textColor="neutral.500" maxWidth={320}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}

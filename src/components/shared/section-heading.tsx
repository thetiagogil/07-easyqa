import { Stack, Typography } from "@mui/joy";

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Stack gap={0.5}>
      <Typography level="title-md">{title}</Typography>
      {description ? (
        <Typography level="body-sm" textColor="neutral.500">
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}

import CircularProgress from "@mui/joy/CircularProgress";
import { Stack, Typography } from "@mui/joy";

type LoadingProps = {
  isLoading?: boolean;
  minHeight?: string | number;
  justifyContent?: string;
  variant?: "overlay";
  message?: string;
};

export function Loading({
  isLoading = true,
  minHeight = 80,
  justifyContent = "flex-start",
  variant,
  message,
}: LoadingProps) {
  if (!isLoading) return null;

  if (variant === "overlay") {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1300}
        bgcolor="rgba(12, 16, 14, 0.72)"
        gap={message ? 1.5 : 0}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress color="primary" size="lg" thickness={4} />
        {message ? (
          <Typography level="body-sm" textColor="neutral.300">
            {message}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      justifyContent={justifyContent}
      flexGrow={1}
      minHeight={minHeight}
      margin={2}
      gap={message ? 1.5 : 0}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularProgress color="primary" size="md" thickness={2} />
      {message ? (
        <Typography level="body-sm" textColor="neutral.500">
          {message}
        </Typography>
      ) : null}
    </Stack>
  );
}

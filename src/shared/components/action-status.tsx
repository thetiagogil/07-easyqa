import { Alert, Typography } from "@mui/joy";

type ActionStatusProps = {
  error?: string;
  success?: string;
  pending?: boolean;
  pendingMessage?: string;
  compact?: boolean;
};

export function ActionStatus({
  error,
  success,
  pending,
  pendingMessage = "Working...",
  compact = false,
}: ActionStatusProps) {
  if (pending) {
    if (compact) {
      return (
        <Typography
          level="body-xs"
          textColor="neutral.500"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          {pendingMessage}
        </Typography>
      );
    }

    return (
      <Alert
        color="neutral"
        variant="soft"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {pendingMessage}
      </Alert>
    );
  }

  if (error) {
    if (compact) {
      return (
        <Typography level="body-xs" color="danger" role="alert">
          {error}
        </Typography>
      );
    }

    return (
      <Alert color="danger" role="alert">
        {error}
      </Alert>
    );
  }

  if (success) {
    if (compact) {
      return (
        <Typography
          level="body-xs"
          color="success"
          role="status"
          aria-live="polite"
        >
          {success}
        </Typography>
      );
    }

    return (
      <Alert color="success" role="status" aria-live="polite">
        {success}
      </Alert>
    );
  }

  return null;
}

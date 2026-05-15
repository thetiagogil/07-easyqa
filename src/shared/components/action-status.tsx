import { Alert } from "@mui/joy";

type ActionStatusProps = {
  error?: string;
  success?: string;
  pending?: boolean;
  pendingMessage?: string;
};

export function ActionStatus({
  error,
  success,
  pending,
  pendingMessage = "Working...",
}: ActionStatusProps) {
  if (pending) {
    return (
      <Alert color="neutral" variant="soft" role="status" aria-live="polite" aria-busy="true">
        {pendingMessage}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert color="danger" role="alert">
        {error}
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert color="success" role="status" aria-live="polite">
        {success}
      </Alert>
    );
  }

  return null;
}

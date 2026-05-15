import { markNotificationsReadAction } from "@/features/notifications/server/actions";
import { SubmitButton } from "@/shared/components/ui/submit-button";

export function MarkReadButton({ disabled }: { disabled?: boolean }) {
  return (
    <form action={markNotificationsReadAction}>
      <SubmitButton
        size="sm"
        variant="soft"
        color="neutral"
        disabled={disabled}
        pendingLabel="Saving"
      >
        Mark read
      </SubmitButton>
    </form>
  );
}

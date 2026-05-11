import { Button } from "@mui/joy";
import { markNotificationsReadAction } from "@/lib/server/actions";

export function MarkReadButton({ disabled }: { disabled?: boolean }) {
  return (
    <form action={markNotificationsReadAction}>
      <Button type="submit" size="sm" variant="soft" color="neutral" disabled={disabled}>
        Mark read
      </Button>
    </form>
  );
}

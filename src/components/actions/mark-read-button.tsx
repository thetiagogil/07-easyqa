import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/joy";
import { markNotificationsReadAction } from "@/lib/easyqa/actions";

export function MarkReadButton({ disabled }: { disabled?: boolean }) {
  return (
    <form action={markNotificationsReadAction}>
      <Button type="submit" size="sm" variant="soft" color="neutral" disabled={disabled} startDecorator={<CheckIcon />}>
        Read all
      </Button>
    </form>
  );
}

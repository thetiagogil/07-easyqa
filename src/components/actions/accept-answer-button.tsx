import { Button } from "@mui/joy";
import { acceptAnswerAction } from "@/lib/easyqa/actions";

export function AcceptAnswerButton({ answerId, questionId }: { answerId: number; questionId: number }) {
  return (
    <form action={acceptAnswerAction.bind(null, answerId, questionId)}>
      <Button type="submit" size="sm" variant="outlined" color="success">
        Accept
      </Button>
    </form>
  );
}

import { Button } from "@mui/joy";
import { RouteFeedback } from "@/shared/components/route-feedback";

export default function NotFoundPage() {
  return (
    <RouteFeedback
      title="Page not found"
      description="This page or record does not exist."
    >
      <Button component="a" href="/">
        Go home
      </Button>
    </RouteFeedback>
  );
}

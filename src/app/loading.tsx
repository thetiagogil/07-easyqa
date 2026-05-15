import { RouteFeedback } from "@/shared/components/route-feedback";
import { Loading } from "@/shared/components/ui/loading";

export default function LoadingPage() {
  return (
    <RouteFeedback>
      <Loading minHeight={160} justifyContent="center" />
    </RouteFeedback>
  );
}

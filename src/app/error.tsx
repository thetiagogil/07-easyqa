"use client";

import { Button } from "@mui/joy";
import { RouteFeedback } from "@/shared/components/route-feedback";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  void error;

  return (
    <RouteFeedback
      title="Something went wrong"
      description="We couldn't load this view. Please try again."
    >
      <Button type="button" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </RouteFeedback>
  );
}

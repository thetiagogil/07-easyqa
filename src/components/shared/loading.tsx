import { Stack } from "@mui/joy";
import CircularProgress from "@mui/joy/CircularProgress";

interface LoadingProps {
  isLoading?: boolean;
  minHeight?: string | number;
  justifyContent?: string;
  variant?: "overlay";
}

export const Loading = ({
  isLoading = true,
  minHeight = 80,
  justifyContent = "flex-start",
  variant,
}: LoadingProps) => {
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
        bgcolor="rgba(9, 8, 24, 0.6)"
      >
        <CircularProgress color="primary" size="lg" role="status" thickness={4} aria-busy="true" />
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
    >
      <CircularProgress color="primary" size="md" role="status" thickness={2} aria-busy="true" />
    </Stack>
  );
};

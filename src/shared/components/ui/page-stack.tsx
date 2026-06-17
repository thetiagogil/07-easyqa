import { Stack, type StackProps } from "@mui/joy";

export const PageStack = ({ sx, ...props }: StackProps) => {
  const baseSx = {
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <Stack
      gap={2}
      p={{ xs: 2, sm: 2.5 }}
      sx={Array.isArray(sx) ? [baseSx, ...sx] : sx ? [baseSx, sx] : baseSx}
      {...props}
    />
  );
};

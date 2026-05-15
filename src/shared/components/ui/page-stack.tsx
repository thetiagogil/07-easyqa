import { Stack, type StackProps } from "@mui/joy";

export function PageStack({ sx, ...props }: StackProps) {
  return (
    <Stack
      gap={2}
      p={{ xs: 2, sm: 2.5 }}
      sx={[
        {
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}

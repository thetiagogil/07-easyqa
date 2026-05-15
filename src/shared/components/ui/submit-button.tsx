"use client";

import { Button, type ButtonProps } from "@mui/joy";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" loading={pending} disabled={pending || props.disabled}>
      {children}
    </Button>
  );
}

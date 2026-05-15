"use client";

import { Button, type ButtonProps } from "@mui/joy";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ButtonProps & {
  pendingLabel?: ReactNode;
};

export function SubmitButton({ children, pendingLabel, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      type="submit"
      loading={pending}
      disabled={pending || props.disabled}
      aria-busy={pending || undefined}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}

import { Button, type ButtonProps } from "@mui/joy";
import type { ReactNode } from "react";

export const AUTH_BUTTON_PROPS = {
  size: "sm",
  variant: "soft",
} as const satisfies Pick<ButtonProps, "size" | "variant">;

type AuthLinkButtonProps = Omit<ButtonProps<"a">, "component" | "href"> & {
  children?: ReactNode;
  href?: string;
};

export function AuthLinkButton({
  children = "log in",
  href = "/auth",
  ...props
}: AuthLinkButtonProps) {
  return (
    <Button {...AUTH_BUTTON_PROPS} {...props} component="a" href={href}>
      {children}
    </Button>
  );
}

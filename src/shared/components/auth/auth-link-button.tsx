"use client";

import { Button, type ButtonProps } from "@mui/joy";
import NextLink from "next/link";
import type { ReactNode } from "react";

export const AUTH_BUTTON_PROPS = {
  size: "sm",
  variant: "soft",
} as const satisfies Pick<ButtonProps, "size" | "variant">;

type AuthLinkButtonProps = Omit<
  ButtonProps<typeof NextLink>,
  "component" | "href"
> & {
  children?: ReactNode;
  href?: string;
};

export const AuthLinkButton = ({
  children = "log in",
  href = "/auth",
  ...props
}: AuthLinkButtonProps) => {
  return (
    <Button {...AUTH_BUTTON_PROPS} {...props} component={NextLink} href={href}>
      {children}
    </Button>
  );
};

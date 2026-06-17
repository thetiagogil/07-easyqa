"use client";

import { Button, IconButton, type ButtonProps } from "@mui/joy";
import type { IconButtonProps } from "@mui/joy/IconButton";
import NextLink from "next/link";

type LinkButtonProps = Omit<
  ButtonProps<typeof NextLink>,
  "component" | "href"
> & {
  href: string;
};

type LinkIconButtonProps = Omit<
  IconButtonProps<typeof NextLink>,
  "component" | "href"
> & {
  href: string;
};

export const LinkButton = ({ href, ...props }: LinkButtonProps) => {
  return <Button component={NextLink} href={href} {...props} />;
};

export const LinkIconButton = ({ href, ...props }: LinkIconButtonProps) => {
  return <IconButton component={NextLink} href={href} {...props} />;
};

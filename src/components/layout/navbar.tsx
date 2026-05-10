"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, IconButton, Link, Stack, Typography } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { MAIN_BORDERS } from "@/lib/constants";
import type { CurrentUser } from "@/types/easyqa";
import { ProfileAvatar } from "@/components/shared/profile-avatar";

export type NavbarProps = {
  title?: string;
  hasBackButton?: boolean;
  showLoginButton?: boolean;
  startItem?: ReactNode;
  centerItem?: ReactNode;
  endItem?: ReactNode;
  fullItem?: ReactNode;
};

type NavbarComponentProps = NavbarProps & {
  currentUser: CurrentUser | null;
};

const NavbarContainer = ({ children }: { children: ReactNode }) => (
  <Stack
    component="nav"
    position="sticky"
    top={0}
    bgcolor="background.body"
    height={56}
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    borderTop={{ xs: "", sm: MAIN_BORDERS }}
    borderBottom={MAIN_BORDERS}
    py={1}
    px={2}
    zIndex={10}
  >
    {children}
  </Stack>
);

const BackButton = ({ sx }: { sx?: SxProps }) => {
  return (
    <IconButton
      component={NextLink}
      href="/"
      color="neutral"
      size="sm"
      sx={{ ...sx, alignSelf: "center" }}
      aria-label="Go home"
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export function Navbar({
  title,
  startItem,
  centerItem,
  endItem,
  fullItem,
  hasBackButton,
  showLoginButton,
  currentUser,
}: NavbarComponentProps) {
  const profile = currentUser?.profile?.hasDisplayName ? currentUser.profile : null;

  if (fullItem) {
    return (
      <NavbarContainer>
        {hasBackButton ? <BackButton sx={{ mr: 2 }} /> : null}
        {fullItem}
      </NavbarContainer>
    );
  }

  return (
    <NavbarContainer>
      <Stack flexDirection="row" justifyContent="start" alignItems="center" flex={1} minWidth={0}>
        {startItem ? (
          startItem
        ) : hasBackButton ? (
          <BackButton />
        ) : profile ? (
          <Link component={NextLink} href={`/profile/${profile.id}`} underline="none">
            <ProfileAvatar profile={profile} size={32} />
          </Link>
        ) : null}
      </Stack>

      <Stack flexDirection="row" justifyContent="center" alignItems="center" flex={1} minWidth={0}>
        {centerItem ? centerItem : <Typography level="body-md">{title}</Typography>}
      </Stack>

      <Stack flexDirection="row" justifyContent="end" alignItems="center" flex={1} minWidth={0}>
        {endItem ??
          (showLoginButton && !currentUser ? (
            <Button component={NextLink} href="/auth" size="sm">
              Login
            </Button>
          ) : null)}
      </Stack>
    </NavbarContainer>
  );
}

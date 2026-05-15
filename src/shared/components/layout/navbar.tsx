"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Link, Stack, Typography } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { AuthLinkButton } from "@/shared/components/auth/auth-link-button";
import { MAIN_BORDERS } from "@/shared/constants/app";
import type { CurrentUser } from "@/types/easyqa";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";

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
    borderTop={{ xs: "none", sm: MAIN_BORDERS }}
    borderBottom={MAIN_BORDERS}
    py={1}
    px={2}
    gap={1}
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
        <Stack direction="row" alignItems="center" gap={1.5} width="100%">
          {hasBackButton ? <BackButton /> : null}
          {fullItem}
        </Stack>
      </NavbarContainer>
    );
  }

  return (
    <NavbarContainer>
      <Stack
        width="100%"
        minHeight={40}
        position="relative"
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          minWidth={0}
        >
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

        <Stack direction="row" justifyContent="center" alignItems="center" minWidth={0} px={7}>
          {centerItem ? (
            centerItem
          ) : (
            <Typography level="title-sm" fontWeight={800} noWrap sx={{ textTransform: "capitalize" }}>
              {title}
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          minWidth={0}
        >
          {endItem ??
            (showLoginButton && !currentUser ? (
              <AuthLinkButton>log in</AuthLinkButton>
            ) : null)}
        </Stack>
      </Stack>
    </NavbarContainer>
  );
}

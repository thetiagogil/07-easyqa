"use client";

import { MAIN_BORDERS } from "@/lib/constants";
import type { CurrentUser } from "@/types/easyqa";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, IconButton, Link, Stack } from "@mui/joy";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

type FooterProps = {
  currentUser: CurrentUser | null;
  unreadCount: number;
};

export function Footer({ currentUser, unreadCount }: FooterProps) {
  const pathname = usePathname();
  const profile = currentUser?.profile?.hasDisplayName
    ? currentUser.profile
    : null;
  const size = 22;

  const footerItems = [
    {
      label: "home",
      path: "/",
      icon: <HomeIcon style={{ fontSize: size }} />,
    },
    {
      label: "explore",
      path: "/explore",
      icon: <ExploreIcon style={{ fontSize: size }} />,
    },
    {
      label: "question",
      path: "/question/add",
      icon: (
        <IconButton
          component="span"
          color="primary"
          variant="solid"
          sx={{
            height: 42,
            width: 42,
            borderRadius: "100%",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.24)",
          }}
        >
          <AddRoundedIcon />
        </IconButton>
      ),
    },
    {
      label: "notifications",
      path: "/notifications",
      icon:
        unreadCount > 0 ? (
          <Badge badgeContent={unreadCount} size="sm" variant="soft">
            <NotificationsActiveIcon style={{ fontSize: size }} />
          </Badge>
        ) : (
          <NotificationsIcon style={{ fontSize: size }} />
        ),
    },
    {
      label: "settings",
      path: "/settings",
      icon: <SettingsIcon style={{ fontSize: size }} />,
    },
  ];

  if (!profile) {
    return (
      <Box
        position="sticky"
        bottom={0}
        borderBottom={{ xs: "none", sm: MAIN_BORDERS }}
        zIndex={10}
      />
    );
  }

  return (
    <Stack
      position="sticky"
      bottom={0}
      bgcolor="background.body"
      borderTop={MAIN_BORDERS}
      borderBottom={{ xs: "none", sm: MAIN_BORDERS }}
      zIndex={10}
    >
      <Stack component="nav" direction="row" py={0.75}>
        {footerItems.map((item) => (
          <Link
            key={item.path}
            component={NextLink}
            href={item.path}
            aria-label={item.label}
            sx={{
              color: pathname === item.path ? "primary.400" : "neutral.500",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 46,
              "&:hover": {
                color: "primary.300",
              },
            }}
          >
            {item.icon}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}

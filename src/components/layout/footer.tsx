"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, Button, Link, Stack } from "@mui/joy";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_BORDERS } from "@/lib/constants";
import type { CurrentUser } from "@/types/easyqa";

type FooterProps = {
  currentUser: CurrentUser | null;
  unreadCount: number;
};

export function Footer({ currentUser, unreadCount }: FooterProps) {
  const pathname = usePathname();
  const profile = currentUser?.profile?.hasDisplayName ? currentUser.profile : null;
  const size = 24;

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
        <Button
          component="span"
          sx={{
            height: 48,
            width: 48,
            borderRadius: "50%",
            boxShadow: "0px 0px 16px 0px #7ADC9E",
          }}
        >
          <AddRoundedIcon />
        </Button>
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
        borderBottom={{ xs: "", sm: MAIN_BORDERS }}
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
      borderBottom={{ xs: "", sm: MAIN_BORDERS }}
      zIndex={10}
    >
      <Stack component="nav" direction="row" py={1}>
        {footerItems.map((item) => (
          <Link
            key={item.path}
            component={NextLink}
            href={item.path}
            aria-label={item.label}
            sx={{
              color: pathname === item.path ? "primary.500" : "neutral.400",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                color: "primary.700",
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

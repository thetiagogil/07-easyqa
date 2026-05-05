import { useGetUnreadNotificationsCount } from "@/hooks/useNotificationApi";
import { MAIN_BORDERS } from "@/lib/constants";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, Button, Link, Stack } from "@mui/joy";
import { usePrivy } from "@privy-io/react-auth";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { data: unreadCount } = useGetUnreadNotificationsCount();

  const size = 24;

  const footerItems = [
    {
      label: "home",
      path: "/",
      icon: <HomeIcon sx={{ fontSize: size }} />,
    },
    {
      label: "explore",
      path: "/explore",
      icon: <ExploreIcon sx={{ fontSize: size }} />,
    },
    {
      label: "question",
      path: "/question/add",
      icon: (
        <Button
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
        (unreadCount ?? 0) > 0 ? (
          <Badge badgeContent={unreadCount} size="sm" variant="soft">
            <NotificationsActiveIcon sx={{ fontSize: size }} />
          </Badge>
        ) : (
          <NotificationsIcon sx={{ fontSize: size }} />
        ),
    },
    {
      label: "settings",
      path: "/settings",
      icon: <SettingsIcon sx={{ fontSize: size }} />,
    },
  ];

  return (
    <>
      {authenticated ? (
        <Stack
          position="sticky"
          bottom={0}
          bgcolor="background.body"
          borderTop={MAIN_BORDERS}
          borderBottom={{ xs: "", sm: MAIN_BORDERS }}
          zIndex={10}
        >
          <Stack component="nav" direction="row" py={1}>
            {footerItems.map((item, index) => (
              <Link
                key={index}
                component={NextLink}
                href={item.path}
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
      ) : (
        <Box position="sticky" bottom={0} borderBottom={{ xs: "", sm: MAIN_BORDERS }} zIndex={10} />
      )}
    </>
  );
};

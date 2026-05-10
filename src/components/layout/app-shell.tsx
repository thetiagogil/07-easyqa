import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, Box, Button, Link, Stack, Typography } from "@mui/joy";
import type { ReactNode } from "react";
import { APP_NAME, BORDERS } from "@/lib/constants";
import type { CurrentUser } from "@/types/easyqa";
import { ProfileAvatar } from "@/components/shared/profile-avatar";

type AppShellProps = {
  children: ReactNode;
  currentUser: CurrentUser | null;
  unreadCount: number;
};

export function AppShell({ children, currentUser, unreadCount }: AppShellProps) {
  const profile = currentUser?.profile;

  return (
    <Stack
      minHeight="100vh"
      maxWidth={{ xs: "100%", sm: 560 }}
      margin="auto"
      borderLeft={{ xs: 0, sm: BORDERS }}
      borderRight={{ xs: 0, sm: BORDERS }}
      borderColor="divider"
      bgcolor="background.body"
    >
      <Stack
        component="header"
        position="sticky"
        top={0}
        zIndex={20}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        height={58}
        borderBottom={BORDERS}
        borderColor="divider"
        bgcolor="background.body"
      >
        <Link component="a" href="/" underline="none" color="neutral">
          <Typography level="title-md" fontWeight={800} letterSpacing={0}>
            {APP_NAME}
          </Typography>
        </Link>

        {profile ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <Button component="a" href="/question/add" size="sm" startDecorator={<AddRoundedIcon />}>
              Ask
            </Button>
            <Link component="a" href={`/profile/${profile.id}`} underline="none">
              <ProfileAvatar profile={profile} size={34} />
            </Link>
          </Stack>
        ) : currentUser ? (
          <Button component="a" href="/setup" size="sm">
            Set up
          </Button>
        ) : (
          <Button component="a" href="/auth" size="sm">
            Sign in
          </Button>
        )}
      </Stack>

      <Box component="main" flex={1}>
        {children}
      </Box>

      {profile ? (
        <Stack
          component="nav"
          position="sticky"
          bottom={0}
          zIndex={20}
          direction="row"
          justifyContent="space-around"
          borderTop={BORDERS}
          borderColor="divider"
          bgcolor="background.body"
          py={1}
        >
          <NavIcon href="/" label="Home" icon={<HomeIcon />} />
          <NavIcon href="/explore" label="Explore" icon={<ExploreIcon />} />
          <NavIcon href="/question/add" label="Ask" icon={<AddRoundedIcon />} />
          <NavIcon
            href="/notifications"
            label="Notifications"
            icon={
              unreadCount > 0 ? (
                <Badge badgeContent={unreadCount} size="sm">
                  <NotificationsIcon />
                </Badge>
              ) : (
                <NotificationsIcon />
              )
            }
          />
          <NavIcon href="/settings" label="Settings" icon={<SettingsIcon />} />
        </Stack>
      ) : currentUser ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          py={1.5}
          borderTop={BORDERS}
          borderColor="divider"
        >
          <PersonIcon fontSize="small" />
          <Typography level="body-sm" textColor="text.tertiary">
            Complete your profile to ask, answer, vote, and follow.
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          py={1.5}
          borderTop={BORDERS}
          borderColor="divider"
        >
          <PersonIcon fontSize="small" />
          <Typography level="body-sm" textColor="text.tertiary">
            Sign in to ask, answer, vote, and follow.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

function NavIcon({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link
      component="a"
      href={href}
      aria-label={label}
      underline="none"
      color="neutral"
      sx={{
        minWidth: 44,
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "neutral.400",
        "&:hover": { color: "primary.400" },
      }}
    >
      {icon}
    </Link>
  );
}

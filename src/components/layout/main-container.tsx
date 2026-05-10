import { Stack } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MAIN_BORDERS } from "@/lib/constants";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/easyqa/data";
import { Footer } from "./footer";
import { Navbar, type NavbarProps } from "./navbar";

type MainContainerProps = {
  children: ReactNode;
  navbarProps?: NavbarProps;
  noPad?: boolean;
  sx?: SxProps;
};

export async function MainContainer({
  children,
  navbarProps,
  noPad,
  sx,
}: MainContainerProps) {
  const currentUser = await getCurrentUser();
  if (currentUser && !currentUser.profile?.hasDisplayName) {
    redirect("/setup");
  }

  const unreadCount = currentUser?.profile?.hasDisplayName
    ? await getUnreadNotificationCount(currentUser.id)
    : 0;

  return (
    <Stack
      position="sticky"
      top={0}
      minHeight="100vh"
      width="100%"
      maxWidth={{ xs: "100%", sm: 500 }}
      borderRight={{ xs: "", sm: MAIN_BORDERS }}
      borderLeft={{ xs: "", sm: MAIN_BORDERS }}
      margin="auto"
    >
      <Navbar {...navbarProps} currentUser={currentUser} />
      <Stack component="main" flexGrow={1} p={noPad ? 0 : 2} sx={sx}>
        {children}
      </Stack>
      <Footer currentUser={currentUser} unreadCount={unreadCount} />
    </Stack>
  );
}

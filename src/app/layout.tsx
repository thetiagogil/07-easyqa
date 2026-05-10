import { AppShell } from "@/components/layout/app-shell";
import { APP_NAME } from "@/lib/constants";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/easyqa/data";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "A focused question and answer app backed by Supabase Auth and RLS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <RootFrame>{children}</RootFrame>
        </Providers>
      </body>
    </html>
  );
}

async function RootFrame({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  const unreadCount = currentUser?.profile
    ? await getUnreadNotificationCount(currentUser.id)
    : 0;

  return (
    <AppShell currentUser={currentUser} unreadCount={unreadCount}>
      {children}
    </AppShell>
  );
}

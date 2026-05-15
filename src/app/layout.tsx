import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "A focused question and answer app backed by Supabase Auth and RLS.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

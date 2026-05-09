import "@/styles/globals.css";
import type { Metadata } from "next";
import type { WithChildren } from "@/types";
import { Providers } from "./providers";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: WithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

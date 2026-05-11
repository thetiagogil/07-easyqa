"use client";

import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import type { ReactNode } from "react";
import { ThemeRegistry } from "@/components/providers/theme-registry";
import { theme } from "@/styles/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeRegistry options={{ key: "joy" }}>
      <CssVarsProvider
        theme={theme}
        defaultMode="dark"
        disableTransitionOnChange
      >
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </ThemeRegistry>
  );
}

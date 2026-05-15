"use client";

import CssBaseline from "@mui/joy/CssBaseline";
import GlobalStyles from "@mui/joy/GlobalStyles";
import { CssVarsProvider } from "@mui/joy/styles";
import type { ReactNode } from "react";
import { ThemeRegistry } from "@/shared/components/providers/theme-registry";
import { theme } from "@/shared/theme/theme";

const globalStyles = {
  "*": {
    boxSizing: "border-box",
    padding: 0,
    margin: 0,
  },
  html: {
    minHeight: "100%",
  },
  body: {
    minHeight: "100%",
    background: "var(--joy-palette-background-body)",
  },
  "::-webkit-scrollbar": {
    width: 4,
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--joy-palette-primary-700)",
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeRegistry options={{ key: "joy" }}>
      <CssVarsProvider
        theme={theme}
        defaultMode="dark"
        disableTransitionOnChange
      >
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {children}
      </CssVarsProvider>
    </ThemeRegistry>
  );
}

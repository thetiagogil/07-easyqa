"use client";

import createCache, {
  type Options as EmotionCacheOptions,
} from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { useServerInsertedHTML } from "next/navigation";
import { useState, type ReactNode } from "react";

const theme = extendTheme({
  fontFamily: {
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    code: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        background: {
          body: "rgb(9, 8, 24)",
        },
        success: {
          500: "#22c55e",
        },
        danger: {
          500: "#ef4444",
        },
        warning: {
          500: "#f59e0b",
        },
      },
    },
  },
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "8px",
  },
  components: {
    JoyStack: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.neutral[700],
          transition: "0.3s",
        }),
      },
      defaultProps: {
        color: "secondary",
      },
    },
    JoyListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.neutral[700],
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.body,
        }),
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.body,
        }),
      },
    },
  },
});

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

function ThemeRegistry({
  children,
  options,
}: {
  children: ReactNode;
  options: EmotionCacheOptions;
}) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;

    const previousInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }

      return previousInsert(...args);
    };

    const flush = () => {
      const previouslyInserted = inserted;
      inserted = [];
      return previouslyInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";

    for (const name of names) {
      const insertedStyle = cache.inserted[name];
      if (typeof insertedStyle === "string") {
        styles += insertedStyle;
      }
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

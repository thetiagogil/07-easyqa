"use client";

import { APP_RADIUS } from "@/lib/constants";
import { extendTheme } from "@mui/joy/styles";

export const theme = extendTheme({
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
        neutral: {
          50: "#f8f7ff",
          100: "#ece9ff",
          200: "#d7d1ff",
          300: "#b9afe8",
          400: "#968bbd",
          500: "#776c99",
          600: "#5d537b",
          700: "#403858",
          800: "#29233d",
          900: "#171326",
        },
        background: {
          body: "rgb(9, 8, 24)",
          surface: "rgb(13, 12, 31)",
          level1: "rgb(18, 16, 42)",
          level2: "rgb(25, 22, 56)",
          level3: "rgb(35, 30, 74)",
          popup: "rgb(18, 16, 42)",
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
        divider: "rgba(185, 175, 232, 0.18)",
      },
    },
  },
  radius: {
    xs: APP_RADIUS,
    sm: APP_RADIUS,
    md: APP_RADIUS,
    lg: APP_RADIUS,
    xl: APP_RADIUS,
  },
  components: {
    JoyStack: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
      defaultProps: {
        color: "secondary",
      },
    },
    JoyListItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    JoyList: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoyListDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.divider,
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 700,
          borderRadius: APP_RADIUS,
          transition: "0.3s",
          borderColor: theme.palette.divider,
          "&:hover": {
            borderColor: theme.palette.divider,
          },
        }),
      },
    },
    JoyIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          transition: "0.3s",
          borderColor: theme.palette.divider,
          "&:hover": {
            borderColor: theme.palette.divider,
          },
        }),
      },
    },
    JoyLink: {
      styleOverrides: {
        root: {
          transition: "0.3s",
        },
      },
    },
    JoyTab: {
      styleOverrides: {
        root: {
          transition: "0.3s",
        },
      },
    },
    JoyChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          transition: "0.3s",
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoyCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoySheet: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          backgroundColor: theme.palette.background.level1,
          borderColor: theme.palette.divider,
          boxShadow: "none",
        }),
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          backgroundColor: theme.palette.background.level1,
          borderColor: theme.palette.divider,
          boxShadow: "none",
        }),
      },
    },
    JoySelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          backgroundColor: theme.palette.background.level1,
          borderColor: theme.palette.divider,
          boxShadow: "none",
        }),
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoyModalDialog: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
    JoyAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: APP_RADIUS,
          borderColor: theme.palette.divider,
        }),
      },
    },
  },
});

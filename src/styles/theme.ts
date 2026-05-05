"use client";
import { extendTheme } from "@mui/joy";

export const theme = extendTheme({
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
        /* neutral: {
          50: "#ffffff",
          100: "#e7e6fa",
          200: "#d1d0f0",
          300: "#a09ed3",
          400: "#635b9c",
          500: "#443c7c",
          600: "#342a5e",
          700: "#2c244e",
          800: "#25203d",
          900: "#1e1b2e",
        }, */
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
  },
});

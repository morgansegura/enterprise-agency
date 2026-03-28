import type { DesignTokens } from "./types";

/**
 * Platform Default Design Tokens
 *
 * Professional defaults for the token-based design system.
 * Inspired by Tailwind, Radix, and modern design systems.
 *
 * These are the baseline tokens that all tenants start with.
 * Tenants can override any of these values with custom tokens.
 */
export const platformDefaults: DesignTokens = {
  colors: {
    // Primary brand color — Jira/Atlassian blue
    primary: {
      50: "#deebff",
      100: "#b3d4ff",
      200: "#4c9aff",
      300: "#2684ff",
      400: "#0065ff",
      500: "#0052cc",
      600: "#0747a6",
      700: "#003884",
      800: "#002a66",
      900: "#091e42",
      950: "#061730",
    },

    // Secondary — Jira warm slate
    secondary: {
      50: "#fafbfc",
      100: "#f4f5f7",
      200: "#dfe1e6",
      300: "#c1c7d0",
      400: "#97a0af",
      500: "#6b778c",
      600: "#505f79",
      700: "#344563",
      800: "#172b4d",
      900: "#091e42",
      950: "#061730",
    },

    // Accent — teal/cyan for secondary actions
    accent: {
      50: "#e6fcff",
      100: "#b3f5ff",
      200: "#79e2f2",
      300: "#00c7e6",
      400: "#00b8d9",
      500: "#00a3bf",
      600: "#008da6",
      700: "#006b8a",
      800: "#00526e",
      900: "#003d52",
      950: "#002b3d",
    },

    // Neutral — Jira warm slate (same as secondary)
    neutral: {
      50: "#fafbfc",
      100: "#f4f5f7",
      200: "#dfe1e6",
      300: "#c1c7d0",
      400: "#b3bac5",
      500: "#97a0af",
      600: "#6b778c",
      700: "#505f79",
      800: "#344563",
      900: "#172b4d",
      950: "#091e42",
    },

    // UI semantic colors — shadcn/Tailwind compatible
    ui: {
      background: "#ffffff",
      foreground: "#172b4d",
      card: "#ffffff",
      cardForeground: "#172b4d",
      popover: "#ffffff",
      popoverForeground: "#172b4d",
      muted: "#f4f5f7",
      mutedForeground: "#6b778c",
      border: "#dfe1e6",
      input: "#dfe1e6",
      ring: "#0052cc",
      primary: "#0052cc",
      primaryForeground: "#ffffff",
      secondary: "#f4f5f7",
      secondaryForeground: "#172b4d",
      accent: "#deebff",
      accentForeground: "#172b4d",
    },

    // Semantic colors — Jira status colors
    semantic: {
      success: "#00875a",
      successForeground: "#ffffff",
      warning: "#ff991f",
      warningForeground: "#172b4d",
      error: "#de350b",
      errorForeground: "#ffffff",
      info: "#0065ff",
      infoForeground: "#ffffff",
      destructive: "#de350b",
      destructiveForeground: "#ffffff",
    },
  },

  // Font Configuration
  fonts: {
    definitions: [
      {
        id: "primary",
        family: "Inter",
        weights: [400, 500, 600, 700],
        category: "sans-serif",
      },
      {
        id: "secondary",
        family: "Inter",
        weights: [400, 500, 600],
        category: "sans-serif",
      },
      {
        id: "accent",
        family: "Inter",
        weights: [500, 600],
        category: "sans-serif",
      },
    ],
    roles: {
      heading: "primary",
      body: "secondary",
      button: "accent",
      link: "accent",
      caption: "secondary",
      navigation: "primary",
    },
  },

  typography: {
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
      serif: [
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },

    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },

    fontWeight: {
      thin: "100",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },

    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  spacing: {
    0: "0px",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  borderRadius: {
    none: "0px",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "0 0 #0000",
  },

  transitions: {
    none: "0ms",
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
};

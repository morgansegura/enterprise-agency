import type { SectionTokens } from "./section-tokens";

/**
 * Platform Default Section Tokens
 * Professional section styling for optimal vertical rhythm
 * All values customizable per-tenant
 */
export const sectionDefaults: SectionTokens = {
  // ==========================================
  // SPACING SCALE
  // Vertical rhythm - the heartbeat of the design
  // ==========================================
  spacing: {
    none: {
      top: "0",
      bottom: "0",
    },
    xs: {
      top: "2rem", // 32px
      bottom: "2rem",
    },
    sm: {
      top: "3rem", // 48px
      bottom: "3rem",
    },
    md: {
      top: "4rem", // 64px
      bottom: "4rem",
    },
    lg: {
      top: "6rem", // 96px
      bottom: "6rem",
    },
    xl: {
      top: "8rem", // 128px
      bottom: "8rem",
    },
    "2xl": {
      top: "10rem", // 160px
      bottom: "10rem",
    },
    "3xl": {
      top: "12rem", // 192px
      bottom: "12rem",
    },
  },

  // ==========================================
  // MOBILE SPACING (Tighter)
  // ==========================================
  spacingMobile: {
    xs: { top: "1.5rem", bottom: "1.5rem" }, // 24px
    sm: { top: "2rem", bottom: "2rem" }, // 32px
    md: { top: "3rem", bottom: "3rem" }, // 48px
    lg: { top: "4rem", bottom: "4rem" }, // 64px
    xl: { top: "5rem", bottom: "5rem" }, // 80px
    "2xl": { top: "6rem", bottom: "6rem" }, // 96px
    "3xl": { top: "8rem", bottom: "8rem" }, // 128px
  },

  // ==========================================
  // TABLET SPACING (Between mobile and desktop)
  // ==========================================
  spacingTablet: {
    xs: { top: "1.75rem", bottom: "1.75rem" }, // 28px
    sm: { top: "2.5rem", bottom: "2.5rem" }, // 40px
    md: { top: "3.5rem", bottom: "3.5rem" }, // 56px
    lg: { top: "5rem", bottom: "5rem" }, // 80px
    xl: { top: "6.5rem", bottom: "6.5rem" }, // 104px
    "2xl": { top: "8rem", bottom: "8rem" }, // 128px
    "3xl": { top: "10rem", bottom: "10rem" }, // 160px
  },

  // ==========================================
  // CONTAINER WIDTHS
  // ==========================================
  width: {
    narrow: "768px", // Reading-friendly
    container: "1280px", // Standard container
    wide: "1536px", // Wide layouts
    full: "100%", // Full bleed
    prose: "65ch", // Optimal reading width (characters)
  },

  // ==========================================
  // HORIZONTAL PADDING (Gutters)
  // ==========================================
  paddingX: {
    default: "2rem", // 32px
    mobile: "1.5rem", // 24px
    tablet: "2rem", // 32px
  },

  // ==========================================
  // MIN/MAX HEIGHT
  // ==========================================
  height: {
    min: {
      xs: "10rem", // 160px
      sm: "20rem", // 320px
      md: "30rem", // 480px
      lg: "40rem", // 640px
      xl: "50rem", // 800px
      screen: "100vh", // Full viewport
    },
    max: {
      none: "none",
      screen: "100vh",
    },
  },

  // ==========================================
  // BACKGROUNDS - SOLID COLORS
  // ==========================================
  background: {
    none: "transparent",
    white: "#ffffff",
    gray: "var(--muted)",
    muted: "var(--muted)",
    accent: "var(--accent)",
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    dark: "#0a0a0a",
  },

  // ==========================================
  // GRADIENTS
  // ==========================================
  gradient: {
    // Linear gradients
    "primary-to-secondary":
      "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
    "light-to-dark": "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
    "top-fade":
      "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%)",
    "bottom-fade":
      "linear-gradient(0deg, rgba(0,0,0,0.05) 0%, transparent 100%)",

    // Radial gradients
    radial:
      "radial-gradient(circle at center, var(--primary) 0%, var(--secondary) 100%)",
    "radial-center":
      "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
  },

  // ==========================================
  // BACKGROUND IMAGES
  // ==========================================
  backgroundImage: {
    attachment: {
      scroll: "scroll",
      fixed: "fixed", // parallax
    },
    position: {
      center: "center",
      top: "top",
      bottom: "bottom",
    },
    size: {
      cover: "cover",
      contain: "contain",
      auto: "auto",
    },
    repeat: {
      noRepeat: "no-repeat",
      repeat: "repeat",
      repeatX: "repeat-x",
      repeatY: "repeat-y",
    },
  },

  // ==========================================
  // OVERLAYS
  // ==========================================
  overlay: {
    none: "transparent",
    light: "#ffffff",
    dark: "#000000",
    primary: "var(--primary)",
    opacity: {
      "10": "0.1",
      "20": "0.2",
      "30": "0.3",
      "40": "0.4",
      "50": "0.5",
      "60": "0.6",
      "70": "0.7",
      "80": "0.8",
      "90": "0.9",
    },
  },

  // ==========================================
  // BORDERS
  // ==========================================
  border: {
    width: {
      none: "0",
      thin: "1px",
      medium: "2px",
      thick: "4px",
    },
    style: {
      solid: "solid",
      dashed: "dashed",
      dotted: "dotted",
    },
    color: {
      default: "var(--border)",
      muted: "var(--muted)",
      accent: "var(--accent)",
      primary: "var(--primary)",
    },
  },

  // ==========================================
  // DIVIDERS
  // ==========================================
  divider: {
    height: "1px",
    width: {
      full: "100%",
      container: "1280px",
      narrow: "768px",
    },
    style: {
      solid: "solid",
      dashed: "dashed",
      dotted: "dotted",
      gradient:
        "linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%)",
    },
    color: {
      default: "var(--border)",
      muted: "var(--muted-foreground)",
      accent: "var(--accent)",
    },
    opacity: "0.5",
  },

  // ==========================================
  // SHADOWS
  // ==========================================
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },

  // ==========================================
  // BORDER RADIUS
  // ==========================================
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // ==========================================
  // BACKDROP EFFECTS
  // ==========================================
  backdrop: {
    blur: {
      none: "none",
      sm: "blur(4px)",
      md: "blur(8px)",
      lg: "blur(16px)",
      xl: "blur(24px)",
    },
  },

  // ==========================================
  // CONTENT ALIGNMENT
  // ==========================================
  align: {
    horizontal: {
      left: "flex-start",
      center: "center",
      right: "flex-end",
      justify: "space-between",
    },
    vertical: {
      top: "flex-start",
      center: "center",
      bottom: "flex-end",
      stretch: "stretch",
    },
  },

  // ==========================================
  // TEXT ALIGNMENT
  // ==========================================
  textAlign: {
    left: "left",
    center: "center",
    right: "right",
  },

  // ==========================================
  // ANIMATIONS & TRANSITIONS
  // ==========================================
  transition: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    timing: "ease-in-out",
  },

  // ==========================================
  // Z-INDEX LAYERS
  // ==========================================
  zIndex: {
    base: "1",
    overlay: "10",
    sticky: "20",
  },

  // ==========================================
  // PATTERN OVERLAYS
  // ==========================================
  pattern: {
    none: "none",
    dots: {
      size: "1px",
      spacing: "20px",
      color: "var(--muted-foreground)",
      opacity: "0.1",
    },
    grid: {
      size: "1px",
      color: "var(--muted-foreground)",
      opacity: "0.1",
    },
    lines: {
      width: "1px",
      spacing: "40px",
      color: "var(--muted-foreground)",
      opacity: "0.1",
      angle: "45deg",
    },
  },

  // ==========================================
  // RESPONSIVE BREAKPOINTS
  // ==========================================
  breakpoints: {
    mobile: "768px", // max-width
    tablet: "1024px", // max-width
    desktop: "1024px", // min-width
  },
};

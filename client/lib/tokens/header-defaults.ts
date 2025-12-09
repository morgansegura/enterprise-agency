import type { HeaderTokens } from "./header-tokens";

/**
 * Platform Default Header Tokens
 * Professional, modern defaults inspired by Tailwind + shadcn design system
 * These serve as the baseline for all tenants
 */
export const headerDefaults: HeaderTokens = {
  // ==========================================
  // LAYOUT & STRUCTURE
  // ==========================================

  height: {
    default: "80px",
    shrunk: "64px",
    mobile: "72px",
  },

  maxWidth: {
    narrow: "768px", // max-w-3xl
    container: "1280px", // max-w-7xl
    full: "100%",
  },

  padding: {
    x: {
      default: "2rem", // 32px
      mobile: "1rem", // 16px
    },
    y: {
      default: "1rem", // 16px
      shrunk: "0.5rem", // 8px
      mobile: "0.75rem", // 12px
    },
  },

  gap: {
    default: "1rem", // 16px
    mobile: "0.5rem", // 8px
  },

  // ==========================================
  // BEHAVIOR & ANIMATION
  // ==========================================

  scroll: {
    threshold: "10px",
    shrinkThreshold: "50px",
  },

  transition: {
    duration: {
      default: "200ms",
      slow: "300ms",
    },
    timing: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out
  },

  zIndex: {
    header: "1000",
    dropdown: "1100",
    mobileNav: "1200",
  },

  transform: {
    hideDistance: "-100%",
  },

  // ==========================================
  // VISUAL STYLING
  // ==========================================

  background: {
    default: "var(--background)",
    scrolled: "var(--card)",
    transparent: "transparent",
    blur: "rgba(255, 255, 255, 0.8)",
  },

  border: {
    width: "1px",
    color: {
      default: "var(--border)",
      scrolled: "var(--border)",
      transparent: "transparent",
    },
    radius: "0",
  },

  shadow: {
    none: "none",
    default: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    scrolled: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },

  blur: {
    none: "0",
    default: "8px",
    strong: "16px",
  },

  opacity: {
    transparent: "0",
    translucent: "0.95",
    opaque: "1",
  },

  // ==========================================
  // LOGO
  // ==========================================

  logo: {
    height: {
      default: "40px",
      shrunk: "32px",
      mobile: "36px",
    },
    maxWidth: "200px",
    gap: "0.5rem",
  },

  // ==========================================
  // NAVIGATION
  // ==========================================

  nav: {
    gap: "0.5rem", // 8px between nav items

    link: {
      fontSize: "1rem", // 16px
      fontWeight: "500", // medium
      lineHeight: "1.5",
      padding: {
        x: "0.75rem", // 12px
        y: "0.5rem", // 8px
      },
      borderRadius: "0.375rem", // 6px (rounded-md)
    },

    color: {
      default: "var(--foreground)",
      hover: "var(--primary)",
      active: "var(--primary)",
    },

    bg: {
      default: "transparent",
      hover: "var(--accent)",
      active: "var(--accent)",
    },

    border: {
      width: "0",
      color: {
        default: "transparent",
        hover: "transparent",
        active: "var(--primary)",
      },
    },

    dropdown: {
      width: "220px",
      padding: "0.5rem", // 8px
      gap: "0.25rem", // 4px
      bg: "var(--popover)",
      border: {
        width: "1px",
        color: "var(--border)",
        radius: "0.5rem", // 8px (rounded-lg)
      },
      shadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      animation: {
        duration: "200ms",
        timing: "cubic-bezier(0.16, 1, 0.3, 1)", // ease-out
        slideDistance: "8px",
      },
      item: {
        padding: {
          x: "0.75rem", // 12px
          y: "0.5rem", // 8px
        },
        borderRadius: "0.375rem", // 6px
        color: {
          default: "var(--foreground)",
          hover: "var(--accent-foreground)",
        },
        bg: {
          default: "transparent",
          hover: "var(--accent)",
        },
      },
    },
  },

  // ==========================================
  // ACTIONS (Buttons, Icons)
  // ==========================================

  actions: {
    gap: "0.75rem", // 12px

    iconButton: {
      size: "40px",
      padding: "0.5rem", // 8px
      borderRadius: "0.375rem", // 6px
      color: {
        default: "var(--foreground)",
        hover: "var(--foreground)",
      },
      bg: {
        default: "transparent",
        hover: "var(--accent)",
      },
    },

    button: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      padding: {
        x: "1rem", // 16px
        y: "0.5rem", // 8px
      },
      borderRadius: "0.375rem", // 6px
    },

    badge: {
      size: "18px",
      fontSize: "10px",
      fontWeight: "700",
      offset: {
        top: "-4px",
        right: "-4px",
      },
      bg: "var(--primary)",
      color: "var(--primary-foreground)",
    },
  },

  // ==========================================
  // MOBILE
  // ==========================================

  mobile: {
    breakpoint: "1024px", // lg breakpoint

    toggle: {
      size: "40px",
      padding: "0.5rem",
      iconSize: "24px",
    },

    drawer: {
      width: "280px",
      bg: "var(--background)",
      padding: "1.5rem", // 24px
    },

    navItem: {
      fontSize: "1rem", // 16px
      fontWeight: "500",
      padding: {
        x: "1rem", // 16px
        y: "0.75rem", // 12px
      },
      gap: "0.25rem", // 4px
      borderRadius: "0.375rem", // 6px
      color: {
        default: "var(--foreground)",
        hover: "var(--accent-foreground)",
        active: "var(--primary)",
      },
      bg: {
        default: "transparent",
        hover: "var(--accent)",
        active: "var(--accent)",
      },
    },

    submenu: {
      indent: "1rem", // 16px
      borderColor: "var(--border)",
    },
  },

  // ==========================================
  // TEMPLATE-SPECIFIC OVERRIDES
  // ==========================================

  templates: {
    centered: {
      logoMarginBottom: "1rem", // 16px
      navMarginTop: "1rem", // 16px
    },

    split: {
      navJustify: "center",
    },

    minimal: {
      padding: {
        x: "1rem",
        y: "0.75rem",
      },
    },
  },
};

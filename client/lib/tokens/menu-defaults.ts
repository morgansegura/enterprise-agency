import type { MenuTokens } from "./menu-tokens";

/**
 * Platform Default Menu Tokens
 * Professional menu styling inspired by Tailwind + shadcn
 * All values customizable per-tenant
 */
export const menuDefaults: MenuTokens = {
  // ==========================================
  // LAYOUT & SPACING
  // ==========================================
  gap: {
    horizontal: "0.5rem", // 8px
    vertical: "0.25rem", // 4px
  },

  // ==========================================
  // MENU ITEMS (Links)
  // ==========================================
  item: {
    fontSize: "0.875rem", // 14px
    fontWeight: "500",
    lineHeight: "1.25rem", // 20px
    padding: {
      x: "0.75rem", // 12px
      y: "0.5rem", // 8px
    },
    borderRadius: "0.375rem", // 6px
    border: {
      width: "0px",
      color: {
        default: "transparent",
        hover: "transparent",
        active: "transparent",
      },
    },
  },

  // ==========================================
  // COLORS - Default State
  // ==========================================
  color: {
    default: "var(--foreground)",
    hover: "var(--primary)",
    active: "var(--primary)",
  },

  background: {
    default: "transparent",
    hover: "var(--accent)",
    active: "var(--accent)",
  },

  // ==========================================
  // STYLE VARIANTS
  // ==========================================
  variants: {
    // Pills - rounded background
    pills: {
      borderRadius: "9999px", // Full round
      background: {
        default: "transparent",
        hover: "var(--accent)",
        active: "var(--primary)",
      },
    },

    // Underline - bottom border
    underline: {
      borderWidth: "2px",
      borderColor: {
        default: "transparent",
        hover: "var(--primary)",
        active: "var(--primary)",
      },
      offset: "0.25rem", // 4px from text
    },

    // Bordered - full border
    bordered: {
      borderWidth: "1px",
      borderColor: {
        default: "var(--border)",
        hover: "var(--primary)",
        active: "var(--primary)",
      },
    },

    // Minimal - text only
    minimal: {
      padding: {
        x: "0.5rem", // 8px
        y: "0.25rem", // 4px
      },
    },
  },

  // ==========================================
  // DROPDOWN MENUS
  // ==========================================
  dropdown: {
    width: "14rem", // 224px
    padding: "0.5rem", // 8px
    gap: "0.25rem", // 4px
    background: "var(--popover)",
    border: {
      width: "1px",
      color: "var(--border)",
      radius: "0.5rem", // 8px
    },
    shadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",

    // Animation
    animation: {
      duration: "200ms",
      timing: "ease-out",
      slideDistance: "8px",
    },

    // Dropdown items
    item: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      padding: {
        x: "0.75rem", // 12px
        y: "0.5rem", // 8px
      },
      borderRadius: "0.375rem", // 6px
      color: {
        default: "var(--popover-foreground)",
        hover: "var(--primary)",
      },
      background: {
        default: "transparent",
        hover: "var(--accent)",
      },
    },
  },

  // ==========================================
  // MEGA MENU
  // ==========================================
  megaMenu: {
    width: "100%",
    maxWidth: "1280px", // container width
    padding: "2rem", // 32px
    gap: "2rem", // 32px
    background: "var(--popover)",
    border: {
      width: "1px",
      color: "var(--border)",
      radius: "0.75rem", // 12px
    },
    shadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",

    // Column headings
    heading: {
      fontSize: "0.875rem", // 14px
      fontWeight: "600",
      color: "var(--foreground)",
      marginBottom: "0.75rem", // 12px
    },

    // Column items
    item: {
      fontSize: "0.875rem", // 14px
      padding: {
        x: "0.5rem", // 8px
        y: "0.375rem", // 6px
      },
    },
  },

  // ==========================================
  // BADGES
  // ==========================================
  badge: {
    fontSize: "0.75rem", // 12px
    fontWeight: "600",
    padding: {
      x: "0.5rem", // 8px
      y: "0.125rem", // 2px
    },
    borderRadius: "9999px", // Full round
    marginLeft: "0.5rem", // 8px

    // Badge variants
    new: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
    },
    hot: {
      background: "var(--destructive)",
      color: "var(--destructive-foreground)",
    },
    sale: {
      background: "#16a34a", // green-600
      color: "#ffffff",
    },
  },

  // ==========================================
  // ICONS
  // ==========================================
  icon: {
    size: "1rem", // 16px
    marginLeft: "0.5rem", // 8px
    marginRight: "0.5rem", // 8px
    color: {
      default: "currentColor",
      hover: "currentColor",
    },
  },

  // ==========================================
  // MOBILE MENU (Vertical/Drawer)
  // ==========================================
  mobile: {
    fontSize: "1rem", // 16px
    fontWeight: "500",
    padding: {
      x: "1rem", // 16px
      y: "0.75rem", // 12px
    },
    gap: "0.25rem", // 4px
    borderRadius: "0.5rem", // 8px

    // Mobile submenu
    submenu: {
      indent: "1rem", // 16px
      borderLeft: {
        width: "2px",
        color: "var(--border)",
      },
      background: "var(--muted)",
    },
  },

  // ==========================================
  // CONTEXT-SPECIFIC OVERRIDES
  // ==========================================
  contexts: {
    // Header context - slightly smaller
    header: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      color: {
        default: "var(--foreground)",
        hover: "var(--primary)",
        active: "var(--primary)",
      },
    },

    // Footer context - muted
    footer: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      color: {
        default: "var(--muted-foreground)",
        hover: "var(--foreground)",
        active: "var(--foreground)",
      },
    },

    // Sidebar context - larger, full width
    sidebar: {
      fontSize: "0.9375rem", // 15px
      fontWeight: "500",
      padding: {
        x: "1rem", // 16px
        y: "0.625rem", // 10px
      },
    },
  },
};

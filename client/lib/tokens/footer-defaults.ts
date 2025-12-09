import type { FooterTokens } from "./footer-tokens";

/**
 * Platform Default Footer Tokens
 * Professional footer styling inspired by Tailwind + shadcn
 * All values customizable per-tenant
 */
export const footerDefaults: FooterTokens = {
  // ==========================================
  // LAYOUT & STRUCTURE
  // ==========================================
  padding: {
    x: {
      default: "2rem", // 32px
      mobile: "1.5rem", // 24px
    },
    y: {
      default: "4rem", // 64px
      mobile: "3rem", // 48px
    },
  },

  gap: {
    sections: "3rem", // 48px between sections/columns
    mobile: "2rem", // 32px on mobile
  },

  maxWidth: {
    narrow: "768px",
    container: "1280px",
    full: "100%",
  },

  // ==========================================
  // VISUAL STYLING
  // ==========================================
  background: {
    default: "var(--muted)",
    secondary: "var(--background)", // Bottom bar
  },

  border: {
    width: "1px",
    color: {
      default: "var(--border)",
      top: "var(--border)",
    },
  },

  // ==========================================
  // SECTIONS & COLUMNS
  // ==========================================
  section: {
    padding: {
      y: "2rem", // 32px
    },
    gap: "1rem", // 16px within section
  },

  columns: {
    gap: "2rem", // 32px between columns
    minWidth: "200px",
  },

  // ==========================================
  // SECTION HEADINGS
  // ==========================================
  heading: {
    fontSize: "0.875rem", // 14px
    fontWeight: "600",
    lineHeight: "1.25rem", // 20px
    color: "var(--foreground)",
    marginBottom: "1rem", // 16px
    textTransform: "uppercase",
  },

  // ==========================================
  // LINKS
  // ==========================================
  link: {
    fontSize: "0.875rem", // 14px
    fontWeight: "400",
    lineHeight: "2rem", // 32px (increased for better spacing)
    color: {
      default: "var(--muted-foreground)",
      hover: "var(--foreground)",
    },
    textDecoration: {
      default: "none",
      hover: "underline",
    },
  },

  // ==========================================
  // TEXT (Copyright, descriptions)
  // ==========================================
  text: {
    fontSize: "0.875rem", // 14px
    fontWeight: "400",
    lineHeight: "1.5rem", // 24px
    color: "var(--muted-foreground)",
  },

  // ==========================================
  // SOCIAL LINKS
  // ==========================================
  social: {
    gap: "0.75rem", // 12px
    iconSize: "1.25rem", // 20px
    color: {
      default: "var(--muted-foreground)",
      hover: "var(--foreground)",
    },
    background: {
      default: "transparent",
      hover: "var(--accent)",
    },
    borderRadius: "0.375rem", // 6px
    padding: "0.5rem", // 8px
  },

  // ==========================================
  // BOTTOM BAR (Copyright section)
  // ==========================================
  bottomBar: {
    padding: {
      y: "1.5rem", // 24px
    },
    fontSize: "0.875rem", // 14px
    fontWeight: "400",
    color: "var(--muted-foreground)",
    background: "var(--background)",
    borderTop: {
      width: "1px",
      color: "var(--border)",
    },
  },

  // ==========================================
  // CTA SECTION (Newsletter, etc.)
  // ==========================================
  cta: {
    padding: {
      y: "2.5rem", // 40px
    },
    background: "var(--accent)",
    borderRadius: "0.75rem", // 12px
    title: {
      fontSize: "1.25rem", // 20px
      fontWeight: "600",
      color: "var(--foreground)",
      marginBottom: "0.5rem", // 8px
    },
    description: {
      fontSize: "0.875rem", // 14px
      color: "var(--muted-foreground)",
      marginBottom: "1.5rem", // 24px
    },
  },

  // ==========================================
  // TEMPLATE VARIATIONS
  // ==========================================
  templates: {
    // Centered footer
    centered: {
      logoMarginBottom: "2rem", // 32px
      textAlign: "center",
    },

    // Stacked footer
    stacked: {
      sectionGap: "3rem", // 48px
    },

    // Minimal footer
    minimal: {
      padding: {
        y: "2rem", // 32px
      },
    },
  },
};

/**
 * Header Design Tokens Schema
 * Comprehensive token system for all header variations and behaviors
 */

export interface HeaderTokens {
  // ==========================================
  // LAYOUT & STRUCTURE
  // ==========================================

  /** Header container heights */
  height: {
    default: string; // Normal header height (e.g., "80px")
    shrunk: string; // Height when scrolled/shrunk (e.g., "64px")
    mobile: string; // Mobile header height (e.g., "72px")
  };

  /** Container max-widths */
  maxWidth: {
    narrow: string; // Narrow container (e.g., "768px")
    container: string; // Standard container (e.g., "1280px")
    full: string; // Full width (e.g., "100%")
  };

  /** Header padding */
  padding: {
    x: {
      default: string; // Horizontal padding desktop (e.g., "2rem")
      mobile: string; // Horizontal padding mobile (e.g., "1rem")
    };
    y: {
      default: string; // Vertical padding desktop (e.g., "1rem")
      shrunk: string; // Vertical padding when shrunk (e.g., "0.5rem")
      mobile: string; // Vertical padding mobile (e.g., "0.75rem")
    };
  };

  /** Gap between major header sections (logo, nav, actions) */
  gap: {
    default: string; // Gap between sections (e.g., "1rem")
    mobile: string; // Gap on mobile (e.g., "0.5rem")
  };

  // ==========================================
  // BEHAVIOR & ANIMATION
  // ==========================================

  /** Scroll behavior thresholds */
  scroll: {
    threshold: string; // When to trigger scroll behaviors (e.g., "10px")
    shrinkThreshold: string; // When to shrink header (e.g., "50px")
  };

  /** Transition timings */
  transition: {
    duration: {
      default: string; // Standard transition (e.g., "200ms")
      slow: string; // Slower transition for show/hide (e.g., "300ms")
    };
    timing: string; // Easing function (e.g., "ease-in-out")
  };

  /** Z-index layers */
  zIndex: {
    header: string; // Header z-index (e.g., "1000")
    dropdown: string; // Dropdown z-index (e.g., "1100")
    mobileNav: string; // Mobile nav drawer (e.g., "1200")
  };

  /** Transform values */
  transform: {
    hideDistance: string; // How far to translate when hiding (e.g., "-100%")
  };

  // ==========================================
  // VISUAL STYLING
  // ==========================================

  /** Background colors */
  background: {
    default: string; // Default background (e.g., "var(--background)")
    scrolled: string; // Background when scrolled (e.g., "var(--card)")
    transparent: string; // Transparent state (e.g., "transparent")
    blur: string; // Blur background (e.g., "rgba(255, 255, 255, 0.8)")
  };

  /** Border styling */
  border: {
    width: string; // Border width (e.g., "1px")
    color: {
      default: string; // Default border (e.g., "var(--border)")
      scrolled: string; // Border when scrolled (e.g., "var(--border)")
      transparent: string; // Transparent border (e.g., "transparent")
    };
    radius: string; // Border radius if needed (e.g., "0")
  };

  /** Shadow depths */
  shadow: {
    none: string; // No shadow
    default: string; // Default shadow (e.g., "0 1px 3px rgba(0,0,0,0.1)")
    scrolled: string; // Shadow when scrolled (e.g., "0 4px 6px rgba(0,0,0,0.1)")
    large: string; // Large shadow for emphasis (e.g., "0 10px 15px rgba(0,0,0,0.1)")
  };

  /** Backdrop blur amount */
  blur: {
    none: string; // No blur
    default: string; // Standard blur (e.g., "8px")
    strong: string; // Strong blur (e.g., "16px")
  };

  /** Opacity values */
  opacity: {
    transparent: string; // Fully transparent (e.g., "0")
    translucent: string; // Semi-transparent (e.g., "0.95")
    opaque: string; // Fully opaque (e.g., "1")
  };

  // ==========================================
  // LOGO
  // ==========================================

  logo: {
    /** Logo sizing */
    height: {
      default: string; // Normal logo height (e.g., "40px")
      shrunk: string; // Shrunk logo height (e.g., "32px")
      mobile: string; // Mobile logo height (e.g., "36px")
    };
    /** Logo max width to prevent overly wide logos */
    maxWidth: string; // e.g., "200px"
    /** Gap between logo and text if using both */
    gap: string; // e.g., "0.5rem"
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  nav: {
    /** Gap between nav items */
    gap: string; // e.g., "0.5rem"

    /** Link styling */
    link: {
      fontSize: string; // e.g., "1rem"
      fontWeight: string; // e.g., "500"
      lineHeight: string; // e.g., "1.5"
      padding: {
        x: string; // e.g., "0.75rem"
        y: string; // e.g., "0.5rem"
      };
      borderRadius: string; // e.g., "0.375rem"
    };

    /** Link colors */
    color: {
      default: string; // e.g., "var(--foreground)"
      hover: string; // e.g., "var(--primary)"
      active: string; // e.g., "var(--primary)"
    };

    /** Link background colors */
    bg: {
      default: string; // e.g., "transparent"
      hover: string; // e.g., "var(--accent)"
      active: string; // e.g., "var(--accent)"
    };

    /** Link borders */
    border: {
      width: string; // e.g., "0px" or "1px"
      color: {
        default: string;
        hover: string;
        active: string;
      };
    };

    /** Dropdown menus */
    dropdown: {
      width: string; // e.g., "220px"
      padding: string; // e.g., "0.5rem"
      gap: string; // Gap between dropdown items (e.g., "0.25rem")
      bg: string; // e.g., "var(--popover)"
      border: {
        width: string;
        color: string;
        radius: string;
      };
      shadow: string; // e.g., "var(--shadow-lg)"
      animation: {
        duration: string; // e.g., "200ms"
        timing: string; // e.g., "ease-out"
        slideDistance: string; // e.g., "8px"
      };
      item: {
        padding: {
          x: string;
          y: string;
        };
        borderRadius: string;
        color: {
          default: string;
          hover: string;
        };
        bg: {
          default: string;
          hover: string;
        };
      };
    };
  };

  // ==========================================
  // ACTIONS (Buttons, Icons)
  // ==========================================

  actions: {
    /** Gap between action items */
    gap: string; // e.g., "0.75rem"

    /** Icon button sizing */
    iconButton: {
      size: string; // e.g., "40px"
      padding: string; // e.g., "0.5rem"
      borderRadius: string; // e.g., "0.375rem"
      color: {
        default: string;
        hover: string;
      };
      bg: {
        default: string;
        hover: string;
      };
    };

    /** CTA button styling */
    button: {
      fontSize: string; // e.g., "0.875rem"
      fontWeight: string; // e.g., "500"
      padding: {
        x: string; // e.g., "1rem"
        y: string; // e.g., "0.5rem"
      };
      borderRadius: string; // e.g., "0.375rem"
    };

    /** Badge styling (cart count, notifications) */
    badge: {
      size: string; // e.g., "18px"
      fontSize: string; // e.g., "10px"
      fontWeight: string; // e.g., "700"
      offset: {
        top: string; // e.g., "-4px"
        right: string; // e.g., "-4px"
      };
      bg: string; // e.g., "var(--primary)"
      color: string; // e.g., "var(--primary-foreground)"
    };
  };

  // ==========================================
  // MOBILE
  // ==========================================

  mobile: {
    /** Breakpoint where mobile menu activates */
    breakpoint: string; // e.g., "1024px" (lg breakpoint)

    /** Mobile menu toggle button */
    toggle: {
      size: string; // e.g., "40px"
      padding: string; // e.g., "0.5rem"
      iconSize: string; // e.g., "24px"
    };

    /** Mobile drawer/sheet */
    drawer: {
      width: string; // e.g., "280px"
      bg: string; // e.g., "var(--background)"
      padding: string; // e.g., "1.5rem"
    };

    /** Mobile nav items */
    navItem: {
      fontSize: string; // e.g., "1rem"
      fontWeight: string; // e.g., "500"
      padding: {
        x: string; // e.g., "1rem"
        y: string; // e.g., "0.75rem"
      };
      gap: string; // Gap between items (e.g., "0.25rem")
      borderRadius: string; // e.g., "0.375rem"
      color: {
        default: string;
        hover: string;
        active: string;
      };
      bg: {
        default: string;
        hover: string;
        active: string;
      };
    };

    /** Mobile submenu indent */
    submenu: {
      indent: string; // e.g., "1rem"
      borderColor: string; // e.g., "var(--border)"
    };
  };

  // ==========================================
  // TEMPLATE-SPECIFIC OVERRIDES
  // ==========================================

  templates: {
    /** Centered template adjustments */
    centered: {
      logoMarginBottom: string; // e.g., "1rem"
      navMarginTop: string; // e.g., "1rem"
    };

    /** Split template adjustments */
    split: {
      navJustify: string; // e.g., "center"
    };

    /** Minimal template adjustments */
    minimal: {
      padding: {
        x: string;
        y: string;
      };
    };
  };
}

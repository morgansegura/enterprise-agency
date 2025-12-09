/**
 * Section Token Schema
 * Complete token-based section styling system
 * Sections control vertical spacing, containers, backgrounds, and layout rhythm
 */

export interface SectionTokens {
  // ==========================================
  // SPACING SCALE
  // Vertical rhythm for the entire site
  // ==========================================
  spacing: {
    none: {
      top: string;
      bottom: string;
    };
    xs: {
      top: string;
      bottom: string;
    };
    sm: {
      top: string;
      bottom: string;
    };
    md: {
      top: string;
      bottom: string;
    };
    lg: {
      top: string;
      bottom: string;
    };
    xl: {
      top: string;
      bottom: string;
    };
    "2xl": {
      top: string;
      bottom: string;
    };
    "3xl": {
      top: string;
      bottom: string;
    };
  };

  // ==========================================
  // RESPONSIVE SPACING OVERRIDES
  // Mobile/Tablet spacing adjustments
  // ==========================================
  spacingMobile: {
    xs: { top: string; bottom: string };
    sm: { top: string; bottom: string };
    md: { top: string; bottom: string };
    lg: { top: string; bottom: string };
    xl: { top: string; bottom: string };
    "2xl": { top: string; bottom: string };
    "3xl": { top: string; bottom: string };
  };

  spacingTablet: {
    xs: { top: string; bottom: string };
    sm: { top: string; bottom: string };
    md: { top: string; bottom: string };
    lg: { top: string; bottom: string };
    xl: { top: string; bottom: string };
    "2xl": { top: string; bottom: string };
    "3xl": { top: string; bottom: string };
  };

  // ==========================================
  // CONTAINER WIDTHS
  // Max-width constraints for content
  // ==========================================
  width: {
    narrow: string; // 768px
    container: string; // 1280px
    wide: string; // 1536px
    full: string; // 100%
    prose: string; // 65ch - optimal reading width
  };

  // ==========================================
  // HORIZONTAL PADDING
  // Padding left/right (gutter)
  // ==========================================
  paddingX: {
    default: string;
    mobile: string;
    tablet: string;
  };

  // ==========================================
  // MIN/MAX HEIGHT
  // ==========================================
  height: {
    min: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      screen: string; // 100vh
    };
    max: {
      none: string;
      screen: string;
    };
  };

  // ==========================================
  // BACKGROUNDS - SOLID COLORS
  // ==========================================
  background: {
    none: string;
    white: string;
    gray: string;
    muted: string;
    accent: string;
    primary: string;
    secondary: string;
    dark: string;
  };

  // ==========================================
  // BACKGROUNDS - GRADIENTS
  // ==========================================
  gradient: {
    // Linear gradients
    "primary-to-secondary": string;
    "light-to-dark": string;
    "top-fade": string;
    "bottom-fade": string;

    // Radial gradients
    radial: string;
    "radial-center": string;
  };

  // ==========================================
  // BACKGROUND IMAGES
  // ==========================================
  backgroundImage: {
    attachment: {
      scroll: string;
      fixed: string; // parallax effect
    };
    position: {
      center: string;
      top: string;
      bottom: string;
    };
    size: {
      cover: string;
      contain: string;
      auto: string;
    };
    repeat: {
      noRepeat: string;
      repeat: string;
      repeatX: string;
      repeatY: string;
    };
  };

  // ==========================================
  // OVERLAYS
  // For background images
  // ==========================================
  overlay: {
    none: string;
    light: string; // white overlay
    dark: string; // black overlay
    primary: string;
    opacity: {
      "10": string;
      "20": string;
      "30": string;
      "40": string;
      "50": string;
      "60": string;
      "70": string;
      "80": string;
      "90": string;
    };
  };

  // ==========================================
  // BORDERS
  // Top and bottom borders
  // ==========================================
  border: {
    width: {
      none: string;
      thin: string; // 1px
      medium: string; // 2px
      thick: string; // 4px
    };
    style: {
      solid: string;
      dashed: string;
      dotted: string;
    };
    color: {
      default: string;
      muted: string;
      accent: string;
      primary: string;
    };
  };

  // ==========================================
  // DIVIDERS
  // Visual separators between sections
  // ==========================================
  divider: {
    height: string;
    width: {
      full: string;
      container: string;
      narrow: string;
    };
    style: {
      solid: string;
      dashed: string;
      dotted: string;
      gradient: string;
    };
    color: {
      default: string;
      muted: string;
      accent: string;
    };
    opacity: string;
  };

  // ==========================================
  // SHADOWS
  // ==========================================
  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    inner: string;
  };

  // ==========================================
  // BORDER RADIUS
  // Corner rounding (top/bottom can differ)
  // ==========================================
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    full: string;
  };

  // ==========================================
  // BACKDROP EFFECTS
  // ==========================================
  backdrop: {
    blur: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };

  // ==========================================
  // CONTENT ALIGNMENT
  // ==========================================
  align: {
    horizontal: {
      left: string;
      center: string;
      right: string;
      justify: string;
    };
    vertical: {
      top: string;
      center: string;
      bottom: string;
      stretch: string;
    };
  };

  // ==========================================
  // TEXT ALIGNMENT
  // ==========================================
  textAlign: {
    left: string;
    center: string;
    right: string;
  };

  // ==========================================
  // ANIMATIONS & TRANSITIONS
  // ==========================================
  transition: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    timing: string;
  };

  // ==========================================
  // Z-INDEX LAYERS
  // ==========================================
  zIndex: {
    base: string;
    overlay: string;
    sticky: string;
  };

  // ==========================================
  // PATTERN OVERLAYS
  // Decorative background patterns
  // ==========================================
  pattern: {
    none: string;
    dots: {
      size: string;
      spacing: string;
      color: string;
      opacity: string;
    };
    grid: {
      size: string;
      color: string;
      opacity: string;
    };
    lines: {
      width: string;
      spacing: string;
      color: string;
      opacity: string;
      angle: string; // diagonal lines
    };
  };

  // ==========================================
  // RESPONSIVE BREAKPOINTS
  // For reference in CSS media queries
  // ==========================================
  breakpoints: {
    mobile: string; // max-width
    tablet: string; // max-width
    desktop: string; // min-width
  };
}

/**
 * Apply Design Tokens to DOM
 *
 * Comprehensive utility to apply all design tokens as CSS custom properties
 * on the document root. Used by:
 * - TenantProvider (on page load)
 * - GlobalSettingsDrawer (after save)
 *
 * This ensures consistent token application across the builder.
 */

import type { ColorSettingsData } from "@/components/settings/color-settings-panel";
import type { TypographySettingsData } from "@/components/settings/typography-settings-panel";
import type { AnimationSettingsData } from "@/components/settings/animation-settings-panel";
import type { ComponentSettingsData } from "@/components/settings/component-settings-panel";
import type { LoadingSettingsData } from "@/components/settings/loading-settings-panel";

// ============================================================================
// Types
// ============================================================================

export interface TokensToApply {
  // Legacy semantic colors (direct hex values)
  semantic?: Record<string, string>;

  // Color scales (primary, secondary, accent, neutral with shades)
  colors?: Record<string, Record<string, string>>;

  // Typography tokens
  typography?: {
    fontFamily?: Record<string, string | string[]>;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string | number>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
  };

  // Font configuration
  fonts?: {
    definitions?: Array<{
      id: string;
      family: string;
      category: string;
      weights?: number[];
    }>;
    roles?: Record<string, string>;
  };

  // Spacing scale
  spacing?: Record<string, string>;

  // Border radius scale
  borderRadius?: Record<string, string>;

  // Shadow scale
  shadows?: Record<string, string>;

  // Transition scale
  transitions?: Record<string, string>;

  // Component-specific tokens
  components?: Record<string, Record<string, unknown>>;

  // New comprehensive settings
  colorSettings?: ColorSettingsData;
  typographySettings?: TypographySettingsData;
  animationSettings?: AnimationSettingsData;
  componentSettings?: ComponentSettingsData;
  loadingSettings?: LoadingSettingsData;
}

// ============================================================================
// CSS Variable Mappings
// ============================================================================

/**
 * Maps semantic color keys to CSS variable names
 * These use the standard shadcn/ui naming convention
 */
const SEMANTIC_TO_CSS_VAR: Record<string, string> = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  success: "--success",
  successForeground: "--success-foreground",
  warning: "--warning",
  warningForeground: "--warning-foreground",
  info: "--info",
  infoForeground: "--info-foreground",
};

/**
 * Font size scale mapping (Tailwind naming to CSS values)
 */
const FONT_SIZE_MAP: Record<string, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

/**
 * Font weight mapping (Tailwind naming to numeric values)
 */
const FONT_WEIGHT_MAP: Record<string, string> = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

/**
 * Line height mapping (Tailwind naming to values)
 */
const LINE_HEIGHT_MAP: Record<string, string> = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

/**
 * Letter spacing mapping (Tailwind naming to values)
 */
const LETTER_SPACING_MAP: Record<string, string> = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

// ============================================================================
// Main Function
// ============================================================================

/**
 * Apply tokens to the DOM
 *
 * Sets CSS custom properties on document.documentElement for all token types.
 * This enables runtime theming without CSS rebuilds.
 *
 * @param tokens - Token object containing all design tokens
 */
export function applyTokensToDOM(tokens: TokensToApply): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const setVar = (name: string, value: string | number) => {
    root.style.setProperty(name, String(value));
  };

  // ========================================
  // 1. Semantic Colors (legacy format)
  // ========================================
  if (tokens.semantic) {
    Object.entries(tokens.semantic).forEach(([key, value]) => {
      const cssVar = SEMANTIC_TO_CSS_VAR[key];
      if (cssVar && value) {
        setVar(cssVar, value);
      }
    });
  }

  // ========================================
  // 2. Color Scales (primary-50, primary-100, etc.)
  // ========================================
  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([colorName, scale]) => {
      if (scale && typeof scale === "object") {
        Object.entries(scale).forEach(([shade, value]) => {
          setVar(`--color-${colorName}-${shade}`, value);
        });
      }
    });
  }

  // ========================================
  // 3. New Color Settings (comprehensive)
  // ========================================
  if (tokens.colorSettings) {
    const { brand, status, ui, link, chart } = tokens.colorSettings;

    // Brand colors
    if (brand) {
      setVar("--brand-primary", brand.primary);
      setVar("--brand-secondary", brand.secondary);
      setVar("--brand-accent", brand.accent);

      // Also set as semantic for compatibility
      setVar("--primary", brand.primary);
      setVar("--secondary", brand.secondary);
      setVar("--accent", brand.accent);
    }

    // Status colors
    if (status) {
      setVar("--success", status.success);
      setVar("--success-foreground", status.successForeground);
      setVar("--warning", status.warning);
      setVar("--warning-foreground", status.warningForeground);
      setVar("--error", status.error);
      setVar("--error-foreground", status.errorForeground);
      setVar("--info", status.info);
      setVar("--info-foreground", status.infoForeground);
      // Alias destructive to error
      setVar("--destructive", status.error);
      setVar("--destructive-foreground", status.errorForeground);
    }

    // UI colors
    if (ui) {
      setVar("--background", ui.background);
      setVar("--foreground", ui.foreground);
      setVar("--card", ui.card);
      setVar("--card-foreground", ui.cardForeground);
      setVar("--popover", ui.popover);
      setVar("--popover-foreground", ui.popoverForeground);
      setVar("--muted", ui.muted);
      setVar("--muted-foreground", ui.mutedForeground);
      setVar("--border", ui.border);
      setVar("--input", ui.input);
      setVar("--ring", ui.ring);
    }

    // Link colors
    if (link) {
      setVar("--link", link.default);
      setVar("--link-hover", link.hover);
      setVar("--link-visited", link.visited);
      setVar("--link-active", link.active);
    }

    // Chart colors
    if (chart) {
      setVar("--chart-1", chart.chart1);
      setVar("--chart-2", chart.chart2);
      setVar("--chart-3", chart.chart3);
      setVar("--chart-4", chart.chart4);
      setVar("--chart-5", chart.chart5);
      setVar("--chart-6", chart.chart6);
    }
  }

  // ========================================
  // 4. Typography (legacy format)
  // ========================================
  if (tokens.typography) {
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } =
      tokens.typography;

    // Font families
    if (fontFamily) {
      Object.entries(fontFamily).forEach(([key, value]) => {
        const fontValue = Array.isArray(value) ? value.join(", ") : value;
        setVar(`--font-${key}`, fontValue);
      });
    }

    // Font sizes
    if (fontSize) {
      Object.entries(fontSize).forEach(([key, value]) => {
        setVar(`--font-size-${key}`, value);
      });
    }

    // Font weights
    if (fontWeight) {
      Object.entries(fontWeight).forEach(([key, value]) => {
        setVar(`--font-weight-${key}`, String(value));
      });
    }

    // Line heights
    if (lineHeight) {
      Object.entries(lineHeight).forEach(([key, value]) => {
        setVar(`--line-height-${key}`, value);
      });
    }

    // Letter spacing
    if (letterSpacing) {
      Object.entries(letterSpacing).forEach(([key, value]) => {
        setVar(`--letter-spacing-${key}`, value);
      });
    }
  }

  // ========================================
  // 5. Typography Settings (comprehensive)
  // ========================================
  if (tokens.typographySettings) {
    const { fonts, roles, baseFontSize, headings, body } =
      tokens.typographySettings;

    // Base font size (affects all rem values)
    if (baseFontSize) {
      setVar("--font-size-base-px", `${baseFontSize}px`);
      root.style.fontSize = `${baseFontSize}px`;
    }

    // Font definitions -> CSS variables
    if (fonts) {
      fonts.forEach((font) => {
        const fallback =
          font.category === "serif"
            ? "Georgia, serif"
            : font.category === "monospace"
              ? "'SF Mono', Monaco, monospace"
              : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        setVar(`--font-${font.id}`, `"${font.family}", ${fallback}`);
      });
    }

    // Font role assignments
    if (roles && fonts) {
      Object.entries(roles).forEach(([role, fontId]) => {
        if (fontId === "system") {
          setVar(
            `--font-role-${role}`,
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          );
        } else {
          const font = fonts.find((f) => f.id === fontId);
          if (font) {
            const fallback =
              font.category === "serif"
                ? "Georgia, serif"
                : font.category === "monospace"
                  ? "'SF Mono', Monaco, monospace"
                  : "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            setVar(`--font-role-${role}`, `"${font.family}", ${fallback}`);
          }
        }
      });
    }

    // Heading styles
    if (headings) {
      Object.entries(headings).forEach(([level, style]) => {
        const prefix = `--heading-${level}`;
        setVar(
          `${prefix}-font-size`,
          FONT_SIZE_MAP[style.fontSize] || style.fontSize,
        );
        setVar(
          `${prefix}-font-weight`,
          FONT_WEIGHT_MAP[style.fontWeight] || style.fontWeight,
        );
        setVar(
          `${prefix}-line-height`,
          LINE_HEIGHT_MAP[style.lineHeight] || style.lineHeight,
        );
        setVar(
          `${prefix}-letter-spacing`,
          LETTER_SPACING_MAP[style.letterSpacing] || style.letterSpacing,
        );
        if (style.textTransform) {
          setVar(`${prefix}-text-transform`, style.textTransform);
        }
      });
    }

    // Body styles
    if (body) {
      Object.entries(body).forEach(([size, style]) => {
        const prefix = `--body-${size}`;
        setVar(
          `${prefix}-font-size`,
          FONT_SIZE_MAP[style.fontSize] || style.fontSize,
        );
        setVar(
          `${prefix}-font-weight`,
          FONT_WEIGHT_MAP[style.fontWeight] || style.fontWeight,
        );
        setVar(
          `${prefix}-line-height`,
          LINE_HEIGHT_MAP[style.lineHeight] || style.lineHeight,
        );
        setVar(
          `${prefix}-letter-spacing`,
          LETTER_SPACING_MAP[style.letterSpacing] || style.letterSpacing,
        );
      });
    }
  }

  // ========================================
  // 6. Spacing
  // ========================================
  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      setVar(`--spacing-${key}`, value);
    });
  }

  // ========================================
  // 7. Border Radius
  // ========================================
  if (tokens.borderRadius) {
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      setVar(`--radius-${key}`, value);
      // Also set without prefix for compatibility
      if (key === "base") {
        setVar("--radius", value);
      }
    });
  }

  // ========================================
  // 8. Shadows
  // ========================================
  if (tokens.shadows) {
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      setVar(`--shadow-${key}`, value);
    });
  }

  // ========================================
  // 9. Transitions
  // ========================================
  if (tokens.transitions) {
    Object.entries(tokens.transitions).forEach(([key, value]) => {
      setVar(`--transition-${key}`, value);
    });
  }

  // ========================================
  // 10. Animation Settings
  // ========================================
  if (tokens.animationSettings) {
    const { timing, presets, reducedMotion, defaultDuration, defaultTiming } =
      tokens.animationSettings;

    // Reduced motion preference
    if (reducedMotion) {
      setVar("--animation-duration-multiplier", "0");
    } else {
      setVar("--animation-duration-multiplier", "1");
    }

    // Default animation values
    if (defaultDuration) {
      setVar("--animation-duration-default", defaultDuration);
    }
    if (defaultTiming) {
      setVar("--animation-timing-default", defaultTiming);
    }

    // Timing functions
    if (timing) {
      setVar("--ease-linear", timing.linear);
      setVar("--ease-in", timing.easeIn);
      setVar("--ease-out", timing.easeOut);
      setVar("--ease-in-out", timing.easeInOut);
      setVar("--ease-bounce", timing.bounce);
      setVar("--ease-elastic", timing.elastic);
    }

    // Animation presets
    if (presets) {
      // Fade animations
      if (presets.fadeIn) {
        setVar("--anim-fade-in-duration", presets.fadeIn.duration);
        setVar("--anim-fade-in-timing", presets.fadeIn.timing);
      }
      if (presets.fadeOut) {
        setVar("--anim-fade-out-duration", presets.fadeOut.duration);
        setVar("--anim-fade-out-timing", presets.fadeOut.timing);
      }
      // Slide animations
      if (presets.slideUp) {
        setVar("--anim-slide-up-duration", presets.slideUp.duration);
        setVar("--anim-slide-up-distance", presets.slideUp.distance);
      }
      if (presets.slideDown) {
        setVar("--anim-slide-down-duration", presets.slideDown.duration);
        setVar("--anim-slide-down-distance", presets.slideDown.distance);
      }
      // Scale animations
      if (presets.scaleIn) {
        setVar("--anim-scale-in-duration", presets.scaleIn.duration);
        if (presets.scaleIn.from)
          setVar("--anim-scale-in-from", presets.scaleIn.from);
      }
    }
  }

  // ========================================
  // 11. Component Settings
  // ========================================
  if (tokens.componentSettings) {
    const { dropdown, modal, drawer, tabs, tooltip, badge, avatar, nav } =
      tokens.componentSettings;

    // Dropdown
    if (dropdown) {
      setVar("--dropdown-border-radius", dropdown.borderRadius);
      setVar("--dropdown-shadow", dropdown.shadow);
      setVar("--dropdown-min-width", dropdown.minWidth);
      setVar("--dropdown-max-height", dropdown.maxHeight);
      setVar("--dropdown-padding", dropdown.padding);
      setVar("--dropdown-item-padding-x", dropdown.itemPaddingX);
      setVar("--dropdown-item-padding-y", dropdown.itemPaddingY);
      setVar("--dropdown-item-border-radius", dropdown.itemBorderRadius);
      setVar("--dropdown-animation-duration", dropdown.animationDuration);
    }

    // Modal
    if (modal) {
      setVar("--modal-border-radius", modal.borderRadius);
      setVar("--modal-shadow", modal.shadow);
      setVar("--modal-overlay-opacity", modal.overlayOpacity);
      setVar("--modal-backdrop-blur", modal.backdropBlur);
      setVar("--modal-padding-x", modal.paddingX);
      setVar("--modal-padding-y", modal.paddingY);
      setVar("--modal-animation-duration", modal.animationDuration);
      if (modal.sizes) {
        setVar("--modal-size-sm", modal.sizes.sm);
        setVar("--modal-size-md", modal.sizes.md);
        setVar("--modal-size-lg", modal.sizes.lg);
        setVar("--modal-size-xl", modal.sizes.xl);
        setVar("--modal-size-full", modal.sizes.full);
      }
    }

    // Drawer
    if (drawer) {
      setVar("--drawer-border-radius", drawer.borderRadius);
      setVar("--drawer-shadow", drawer.shadow);
      setVar("--drawer-overlay-opacity", drawer.overlayOpacity);
      setVar("--drawer-backdrop-blur", drawer.backdropBlur);
      setVar("--drawer-padding-x", drawer.paddingX);
      setVar("--drawer-padding-y", drawer.paddingY);
      setVar("--drawer-animation-duration", drawer.animationDuration);
      if (drawer.sizes) {
        setVar("--drawer-size-sm", drawer.sizes.sm);
        setVar("--drawer-size-md", drawer.sizes.md);
        setVar("--drawer-size-lg", drawer.sizes.lg);
        setVar("--drawer-size-xl", drawer.sizes.xl);
      }
      if (drawer.mobile) {
        setVar(
          "--drawer-mobile-fullscreen",
          drawer.mobile.fullScreen ? "1" : "0",
        );
        setVar(
          "--drawer-mobile-swipe-to-close",
          drawer.mobile.swipeToClose ? "1" : "0",
        );
        setVar("--drawer-mobile-position", drawer.mobile.position);
      }
    }

    // Tabs
    if (tabs) {
      setVar("--tabs-list-border-radius", tabs.listBorderRadius);
      setVar("--tabs-list-padding", tabs.listPadding);
      setVar("--tabs-trigger-padding-x", tabs.triggerPaddingX);
      setVar("--tabs-trigger-padding-y", tabs.triggerPaddingY);
      setVar("--tabs-trigger-border-radius", tabs.triggerBorderRadius);
      setVar("--tabs-indicator-height", tabs.indicatorHeight);
      setVar("--tabs-animation-duration", tabs.animationDuration);
      setVar("--tabs-variant", tabs.variant);
    }

    // Tooltip
    if (tooltip) {
      setVar("--tooltip-border-radius", tooltip.borderRadius);
      setVar("--tooltip-padding-x", tooltip.paddingX);
      setVar("--tooltip-padding-y", tooltip.paddingY);
      setVar("--tooltip-max-width", tooltip.maxWidth);
      setVar("--tooltip-shadow", tooltip.shadow);
      setVar("--tooltip-show-arrow", tooltip.showArrow ? "1" : "0");
      setVar("--tooltip-animation-delay", tooltip.animationDelay);
    }

    // Badge
    if (badge) {
      setVar("--badge-border-radius", badge.borderRadius);
      setVar("--badge-padding-x", badge.paddingX);
      setVar("--badge-padding-y", badge.paddingY);
      setVar("--badge-font-size", badge.fontSize);
      setVar("--badge-font-weight", badge.fontWeight);
      setVar("--badge-text-transform", badge.textTransform);
    }

    // Avatar
    if (avatar) {
      setVar("--avatar-border-radius", avatar.borderRadius);
      setVar("--avatar-border-width", avatar.borderWidth);
      if (avatar.sizes) {
        setVar("--avatar-size-sm", avatar.sizes.sm);
        setVar("--avatar-size-md", avatar.sizes.md);
        setVar("--avatar-size-lg", avatar.sizes.lg);
        setVar("--avatar-size-xl", avatar.sizes.xl);
      }
    }

    // Navigation
    if (nav) {
      setVar("--nav-height", nav.height);
      setVar("--nav-padding-x", nav.paddingX);
      setVar("--nav-shadow", nav.shadow);
      setVar("--nav-sticky", nav.sticky ? "sticky" : "relative");
      setVar("--nav-backdrop-blur", nav.backdropBlur);
      setVar("--nav-mobile-menu-position", nav.mobileMenuPosition);
      setVar("--nav-mobile-animation", nav.mobileAnimation);
    }
  }

  // ========================================
  // 12. Loading Settings
  // ========================================
  if (tokens.loadingSettings) {
    const { skeleton, imagePlaceholder, pageLoader, inlineLoader } =
      tokens.loadingSettings;

    if (skeleton) {
      setVar("--skeleton-animation", skeleton.defaultAnimation);
      setVar("--skeleton-text-lines", String(skeleton.textLines));
      setVar("--skeleton-last-line-width", skeleton.lastLineWidth);
    }

    if (imagePlaceholder) {
      setVar("--image-placeholder-animation", imagePlaceholder.animation);
      setVar(
        "--image-placeholder-aspect-ratio",
        imagePlaceholder.defaultAspectRatio,
      );
      setVar(
        "--image-placeholder-show-icon",
        imagePlaceholder.showIcon ? "1" : "0",
      );
      setVar("--image-placeholder-icon-size", `${imagePlaceholder.iconSize}px`);
    }

    if (pageLoader) {
      setVar("--page-loader-variant", pageLoader.variant);
      setVar("--page-loader-show-label", pageLoader.showLabel ? "1" : "0");
      setVar("--page-loader-label-text", `"${pageLoader.labelText}"`);
      setVar(
        "--page-loader-fullscreen",
        pageLoader.fullscreen ? "fixed" : "absolute",
      );
      setVar("--page-loader-use-logo", pageLoader.useLogo ? "1" : "0");
    }

    if (inlineLoader) {
      setVar("--inline-loader-variant", inlineLoader.variant);
      setVar("--inline-loader-size", inlineLoader.size);
    }
  }

  // ========================================
  // 13. Generic Components (legacy format)
  // ========================================
  if (tokens.components) {
    Object.entries(tokens.components).forEach(([component, settings]) => {
      if (settings && typeof settings === "object") {
        Object.entries(settings).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setVar(`--${component}-${kebabCase(key)}`, String(value));
          }
        });
      }
    });
  }

  // ========================================
  // 14. Load Google Fonts
  // ========================================
  if (tokens.fonts?.definitions || tokens.typographySettings?.fonts) {
    const fonts =
      tokens.typographySettings?.fonts || tokens.fonts?.definitions || [];
    loadGoogleFonts(fonts);
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Load Google Fonts dynamically
 */
function loadGoogleFonts(
  fonts: Array<{ family: string; weights?: number[] }>,
): void {
  if (typeof document === "undefined") return;

  fonts.forEach((font) => {
    const linkId = `google-font-${font.family.replace(/\s+/g, "-")}`;

    // Skip if already loaded
    if (document.getElementById(linkId)) return;

    // Create link element
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";

    // Build weights string
    const weights = font.weights?.length ? font.weights.join(";") : "400;700";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@${weights}&display=swap`;

    document.head.appendChild(link);
  });
}

/**
 * Remove all applied token CSS variables
 * Useful for resetting to defaults
 */
export function clearTokensFromDOM(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Remove all inline style properties that start with --
  Array.from(root.style).forEach((prop) => {
    if (prop.startsWith("--")) {
      root.style.removeProperty(prop);
    }
  });
}

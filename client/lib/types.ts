/**
 * Global type definitions for the component system
 * Used across UI components, blocks, and layouts
 */

// ========================================
// Typography
// ========================================

/** Text alignment options */
export type TextAlign = "left" | "center" | "right" | "justify";

/** Text size options - complete Tailwind scale */
export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

/** Heading size options - same as TextSize for consistency */
export type HeadingSize = TextSize;

/** Font weight options */
export type FontWeight =
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

/** HTML heading levels */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Text color variants */
export type TextVariant = "default" | "muted" | "lead" | "subtle";

/** Heading color variants */
export type HeadingVariant = "default" | "primary" | "muted";

// ========================================
// Layout & Spacing
// ========================================

/** Spacing scale for padding/margins */
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Width constraints */
export type Width = "narrow" | "wide" | "full";

/** Header positioning behavior */
export type HeaderPosition = "static" | "sticky" | "fixed" | "absolute";

// ========================================
// Visual Styling
// ========================================

/** Background variants */
export type BackgroundVariant =
  | "none"
  | "white"
  | "gray"
  | "dark"
  | "primary"
  | "secondary";

/** Common HTML container elements */
export type ContainerElement = "div" | "section" | "article" | "aside" | "main";

/** Text elements */
export type TextElement = "p" | "span" | "div";

// ========================================
// Component Props
// ========================================

/** Base props that most components accept */
export type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

// ========================================
// Theme System
// ========================================

/** Section pattern options */
export type SectionPattern = "none" | "dots" | "grid" | "lines";

/** Theme preferences for church-specific customization */
export type ThemePreferences = {
  /** Default border radius size (references Tailwind scale) */
  defaultRadius: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Default shadow size (references Tailwind scale) */
  defaultShadow: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Header style preference */
  headerStyle: "minimal" | "bold";
};

/** Complete theme configuration */
export type ThemeConfig = {
  /** Font family variables (reference CSS custom properties) */
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  /** Church-specific design preferences */
  preferences: ThemePreferences;
};

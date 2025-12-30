/**
 * Design Token System Types
 *
 * Complete type definitions for the token-based design system.
 * All design decisions are codified as tokens that generate CSS variables.
 *
 * Shared between builder and client for type safety.
 */

// =============================================================================
// Color Types
// =============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ColorTokens {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  semantic: SemanticColors;
}

// =============================================================================
// Font Types
// =============================================================================

export interface FontFamily {
  sans?: string[];
  serif?: string[];
  mono?: string[];
  /** Tenant-specific fonts (for website customization) */
  base?: string;
  heading?: string;
}

/**
 * Font Definition - a specific font to be loaded
 */
export interface FontDefinition {
  /** Unique identifier for this font slot */
  id: "primary" | "secondary" | "accent";
  /** Google Font family name (e.g., "Roboto Condensed") */
  family: string;
  /** Font weights to load */
  weights: number[];
  /** Optional: Font category for fallback */
  category?: "sans-serif" | "serif" | "monospace" | "display" | "handwriting";
}

/**
 * Font Role - which font to use for each UI element type
 */
export type FontRole = "primary" | "secondary" | "accent" | "system";

/**
 * Font Roles Configuration - maps UI elements to font definitions
 */
export interface FontRoles {
  /** Headings (H1-H6) */
  heading: FontRole;
  /** Body text, paragraphs */
  body: FontRole;
  /** Buttons */
  button: FontRole;
  /** Links */
  link: FontRole;
  /** Captions, small text */
  caption: FontRole;
  /** Navigation items */
  navigation: FontRole;
}

/**
 * Complete Font Configuration
 */
export interface FontConfig {
  /** Font definitions (1-3 fonts) */
  definitions: FontDefinition[];
  /** Role assignments */
  roles: FontRoles;
}

// =============================================================================
// Typography Scale Types
// =============================================================================

export interface FontSizeScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
  /** Semantic font size for theming */
  heading?: string;
}

export interface FontWeightScale {
  thin: string;
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
}

export interface LineHeightScale {
  none: string;
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

export interface LetterSpacingScale {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

export interface TypographyTokens {
  fontFamily: FontFamily;
  fontSize: FontSizeScale;
  fontWeight: FontWeightScale;
  lineHeight: LineHeightScale;
  letterSpacing: LetterSpacingScale;
}

// =============================================================================
// Spacing Scale Types
// =============================================================================

export interface SpacingScale {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

// =============================================================================
// Border & Effect Scale Types
// =============================================================================

export interface BorderRadiusScale {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  full: string;
}

export interface ShadowScale {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  inner: string;
  none: string;
}

export interface TransitionScale {
  none: string;
  fast: string;
  base: string;
  slow: string;
  slower: string;
}

// =============================================================================
// Component Token Types
// =============================================================================

/**
 * Per-size button settings - each size is fully independent
 */
export interface ButtonSizeComponentSettings {
  /** Horizontal padding */
  paddingX: string;
  /** Vertical padding */
  paddingY: string;
  /** Gap between icon and text */
  gap: string;
  /** Minimum height */
  minHeight: string;
  /** Font size */
  fontSize: string;
  /** Font weight */
  fontWeight: string;
  /** Letter spacing */
  letterSpacing: string;
  /** Line height */
  lineHeight: string;
  /** Text transform (uppercase, capitalize, none) */
  textTransform: string;
  /** Border radius */
  borderRadius: string;
  /** Transition duration */
  transitionDuration: string;
}

export interface ButtonComponentSettings {
  /** Size variants - each size is fully independent */
  sizes: {
    xs: ButtonSizeComponentSettings;
    sm: ButtonSizeComponentSettings;
    md: ButtonSizeComponentSettings;
    lg: ButtonSizeComponentSettings;
    xl: ButtonSizeComponentSettings;
  };
}

export interface InputComponentSettings {
  /** Border radius */
  borderRadius: string;
  /** Border width (Tailwind border-width key) */
  borderWidth: string;
  /** Horizontal padding */
  paddingX: string;
  /** Vertical padding */
  paddingY: string;
  /** Font size */
  fontSize: string;
  /** Font weight */
  fontWeight: string;
  /** Transition duration */
  transitionDuration: string;
}

export interface CardComponentSettings {
  /** Container border radius */
  borderRadius: string;
  /** Container border width */
  borderWidth: string;
  /** Container shadow (Tailwind shadow key) */
  shadow: string;
  /** Header horizontal padding */
  headerPaddingX: string;
  /** Header vertical padding */
  headerPaddingY: string;
  /** Content horizontal padding */
  contentPaddingX: string;
  /** Content vertical padding */
  contentPaddingY: string;
  /** Footer horizontal padding */
  footerPaddingX: string;
  /** Footer vertical padding */
  footerPaddingY: string;
  /** Show header border */
  headerBorder: boolean;
  /** Show footer border */
  footerBorder: boolean;
  /** Title font size */
  titleFontSize: string;
  /** Title font weight */
  titleFontWeight: string;
  /** Title line height */
  titleLineHeight: string;
  /** Title letter spacing */
  titleLetterSpacing: string;
  /** Description font size */
  descriptionFontSize: string;
  /** Description font weight */
  descriptionFontWeight: string;
  /** Description line height */
  descriptionLineHeight: string;
  /** Hover shadow */
  hoverShadow: string;
  /** Transition duration */
  transitionDuration: string;
}

export interface ComponentTokens {
  buttons?: Partial<ButtonComponentSettings>;
  inputs?: Partial<InputComponentSettings>;
  cards?: Partial<CardComponentSettings>;
}

// =============================================================================
// Complete Design Token System
// =============================================================================

/**
 * Complete Design Token System
 */
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  fonts?: FontConfig;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  transitions: TransitionScale;
  components?: ComponentTokens;
}

/**
 * Tenant-level token configuration
 * Allows overriding platform defaults
 */
export interface TenantTokenConfig {
  useCustomTokens?: boolean;
  tokens?: Partial<DesignTokens>;
}

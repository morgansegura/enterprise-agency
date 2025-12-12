/**
 * Design Token System Types
 *
 * Complete type definitions for the token-based design system.
 * All design decisions are codified as tokens that generate CSS variables.
 */

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

export interface FontFamily {
  sans?: string[];
  serif?: string[];
  mono?: string[];
  // Tenant-specific fonts (for website customization)
  base?: string;
  heading?: string;
}

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
  // Semantic font sizes for theming
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

/**
 * UI Component Settings
 * All values use Tailwind token keys (e.g., "sm", "md", "lg" for radius, "4", "6" for spacing)
 */

/**
 * Per-size button settings - each size is fully independent
 */
export interface ButtonSizeComponentSettings {
  // Spacing
  paddingX: string;
  paddingY: string;
  gap: string;
  minHeight: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textTransform: string;
  // Shape
  borderRadius: string;
  // Effects
  transitionDuration: string;
}

export interface ButtonComponentSettings {
  // Size variants - each size is fully independent
  sizes: {
    xs: ButtonSizeComponentSettings;
    sm: ButtonSizeComponentSettings;
    md: ButtonSizeComponentSettings;
    lg: ButtonSizeComponentSettings;
    xl: ButtonSizeComponentSettings;
  };
}

export interface InputComponentSettings {
  // Shape
  borderRadius: string;
  borderWidth: string; // Tailwind border-width key
  // Spacing
  paddingX: string;
  paddingY: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  // Effects
  transitionDuration: string;
}

export interface CardComponentSettings {
  // Container Shape
  borderRadius: string;
  borderWidth: string;
  shadow: string; // Tailwind shadow key
  // Section Spacing
  headerPaddingX: string;
  headerPaddingY: string;
  contentPaddingX: string;
  contentPaddingY: string;
  footerPaddingX: string;
  footerPaddingY: string;
  // Section borders
  headerBorder: boolean;
  footerBorder: boolean;
  // Title Typography
  titleFontSize: string;
  titleFontWeight: string;
  titleLineHeight: string;
  titleLetterSpacing: string;
  // Description Typography
  descriptionFontSize: string;
  descriptionFontWeight: string;
  descriptionLineHeight: string;
  // Hover Effects
  hoverShadow: string;
  transitionDuration: string;
}

export interface ComponentTokens {
  buttons?: Partial<ButtonComponentSettings>;
  inputs?: Partial<InputComponentSettings>;
  cards?: Partial<CardComponentSettings>;
}

/**
 * Complete Design Token System
 */
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
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

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
  // Status colors with foregrounds
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
  info: string;
  infoForeground: string;
  // Destructive (alias for error, commonly used)
  destructive: string;
  destructiveForeground: string;
}

/**
 * UI Semantic Colors - functional color assignments
 */
export interface UIColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
}

/**
 * Link colors for different states
 */
export interface LinkColors {
  default: string;
  hover: string;
  visited: string;
  active: string;
}

/**
 * Selection/highlight colors
 */
export interface SelectionColors {
  background: string;
  foreground: string;
}

/**
 * Chart/data visualization colors
 */
export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
}

export interface ColorTokens {
  // Brand color scales (auto-generated from base colors)
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  // Semantic/status colors
  semantic: SemanticColors;
  // UI colors (for shadcn/Tailwind compatibility)
  ui?: UIColors;
  // Link colors
  link?: LinkColors;
  // Selection/highlight
  selection?: SelectionColors;
  // Chart colors for data visualization
  chart?: ChartColors;
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
// Animation & Motion Types
// =============================================================================

/**
 * Animation timing functions
 */
export interface TimingFunctions {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  elastic: string;
}

/**
 * Animation preset configuration
 */
export interface AnimationPreset {
  duration: string;
  timing: string;
  delay?: string;
}

/**
 * Complete animation tokens
 */
export interface AnimationTokens {
  /** Timing functions */
  timing: TimingFunctions;
  /** Preset animations */
  presets: {
    fadeIn: AnimationPreset;
    fadeOut: AnimationPreset;
    slideUp: AnimationPreset & { distance: string };
    slideDown: AnimationPreset & { distance: string };
    slideLeft: AnimationPreset & { distance: string };
    slideRight: AnimationPreset & { distance: string };
    scaleIn: AnimationPreset & { from: string };
    scaleOut: AnimationPreset & { to: string };
    bounce: AnimationPreset;
    pulse: AnimationPreset;
    spin: AnimationPreset;
  };
  /** Respect reduced motion preference */
  reducedMotion: boolean;
}

// =============================================================================
// Extended Component Types
// =============================================================================

/**
 * Dropdown/Menu component settings
 */
export interface DropdownComponentSettings {
  borderRadius: string;
  borderWidth: string;
  shadow: string;
  minWidth: string;
  maxHeight: string;
  padding: string;
  itemPaddingX: string;
  itemPaddingY: string;
  itemBorderRadius: string;
  itemFontSize: string;
  separatorMarginY: string;
  animationDuration: string;
  animationSlideDistance: string;
}

/**
 * Modal/Dialog component settings
 */
export interface ModalComponentSettings {
  borderRadius: string;
  shadow: string;
  overlayColor: string;
  overlayOpacity: string;
  backdropBlur: string;
  sizes: {
    sm: { width: string; maxWidth: string };
    md: { width: string; maxWidth: string };
    lg: { width: string; maxWidth: string };
    xl: { width: string; maxWidth: string };
    full: { width: string; maxWidth: string };
  };
  headerPaddingX: string;
  headerPaddingY: string;
  contentPaddingX: string;
  contentPaddingY: string;
  footerPaddingX: string;
  footerPaddingY: string;
  footerGap: string;
  animationDuration: string;
  animationScaleFrom: string;
}

/**
 * Drawer/Sheet component settings
 */
export interface DrawerComponentSettings {
  borderRadius: string;
  shadow: string;
  overlayColor: string;
  overlayOpacity: string;
  backdropBlur: string;
  sizes: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  headerPaddingX: string;
  headerPaddingY: string;
  headerMinHeight: string;
  contentPaddingX: string;
  contentPaddingY: string;
  footerPaddingX: string;
  footerPaddingY: string;
  animationDuration: string;
  /** Mobile-specific settings */
  mobile: {
    fullScreen: boolean;
    swipeToClose: boolean;
    showHandle: boolean;
    handleWidth: string;
    handleHeight: string;
  };
}

/**
 * Tabs component settings
 */
export interface TabsComponentSettings {
  listBackground: string;
  listBorderRadius: string;
  listPadding: string;
  listGap: string;
  triggerPaddingX: string;
  triggerPaddingY: string;
  triggerFontSize: string;
  triggerFontWeight: string;
  triggerBorderRadius: string;
  indicatorHeight: string;
  indicatorBorderRadius: string;
  animationDuration: string;
}

/**
 * Tooltip component settings
 */
export interface TooltipComponentSettings {
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
  fontWeight: string;
  maxWidth: string;
  shadow: string;
  arrowSize: string;
  showArrow: boolean;
  animationDuration: string;
  animationDelay: string;
}

/**
 * Badge component settings
 */
export interface BadgeComponentSettings {
  sizes: {
    sm: { paddingX: string; paddingY: string; fontSize: string };
    md: { paddingX: string; paddingY: string; fontSize: string };
    lg: { paddingX: string; paddingY: string; fontSize: string };
  };
  borderRadius: string;
  fontWeight: string;
  letterSpacing: string;
  textTransform: string;
}

/**
 * Avatar component settings
 */
export interface AvatarComponentSettings {
  sizes: {
    xs: { size: string; fontSize: string };
    sm: { size: string; fontSize: string };
    md: { size: string; fontSize: string };
    lg: { size: string; fontSize: string };
    xl: { size: string; fontSize: string };
    "2xl": { size: string; fontSize: string };
  };
  borderRadius: string;
  borderWidth: string;
}

/**
 * Navigation component settings
 */
export interface NavComponentSettings {
  desktop: {
    height: string;
    paddingX: string;
    paddingY: string;
    shadow: string;
    sticky: boolean;
    backdropBlur: string;
    linkPaddingX: string;
    linkPaddingY: string;
    linkFontSize: string;
    linkFontWeight: string;
    dropdownGap: string;
    dropdownOffset: string;
  };
  mobile: {
    height: string;
    paddingX: string;
    hamburgerSize: string;
    menuPosition: "left" | "right" | "full";
    menuAnimation: "slide" | "fade" | "none";
    linkPaddingX: string;
    linkPaddingY: string;
    linkFontSize: string;
    linkFontWeight: string;
  };
}

/**
 * Footer component settings
 */
export interface FooterComponentSettings {
  paddingX: string;
  paddingY: string;
  linkFontSize: string;
  headingFontSize: string;
  headingFontWeight: string;
  headingMarginBottom: string;
  columnGap: string;
  rowGap: string;
}

/**
 * Icon size settings
 */
export interface IconComponentSettings {
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
  strokeWidth: {
    thin: string;
    normal: string;
    thick: string;
  };
}

// =============================================================================
// Mobile & Responsive Types
// =============================================================================

/**
 * Breakpoint definitions
 */
export interface BreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

/**
 * Mobile-specific settings
 */
export interface MobileTokens {
  breakpoints: BreakpointTokens;
  touchTargetMin: string;
  mobilePadding: string;
  tabletPadding: string;
  scaleDownTypography: boolean;
  minFontSize: string;
  navigationStyle: "hamburger" | "bottom-tabs" | "slide-out";
  bottomNavHeight: string;
  bottomNavIconSize: string;
  bottomNavShowLabels: boolean;
  drawerDefaultPosition: "bottom" | "left" | "right";
  useBottomSheet: boolean;
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
  // Core components
  buttons?: Partial<ButtonComponentSettings>;
  inputs?: Partial<InputComponentSettings>;
  cards?: Partial<CardComponentSettings>;
  // UI components
  dropdown?: Partial<DropdownComponentSettings>;
  modal?: Partial<ModalComponentSettings>;
  drawer?: Partial<DrawerComponentSettings>;
  tabs?: Partial<TabsComponentSettings>;
  tooltip?: Partial<TooltipComponentSettings>;
  badge?: Partial<BadgeComponentSettings>;
  avatar?: Partial<AvatarComponentSettings>;
  // Layout components
  nav?: Partial<NavComponentSettings>;
  footer?: Partial<FooterComponentSettings>;
  // Icons
  icon?: Partial<IconComponentSettings>;
}

// =============================================================================
// Complete Design Token System
// =============================================================================

/**
 * Complete Design Token System
 */
export interface DesignTokens {
  // Color system
  colors: ColorTokens;
  // Typography system
  typography: TypographyTokens;
  fonts?: FontConfig;
  // Spacing & layout
  spacing: SpacingScale;
  // Visual effects
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  transitions: TransitionScale;
  // Animation & motion
  animations?: AnimationTokens;
  // Component tokens
  components?: ComponentTokens;
  // Mobile & responsive
  mobile?: MobileTokens;
}

/**
 * Tenant-level token configuration
 * Allows overriding platform defaults
 */
export interface TenantTokenConfig {
  useCustomTokens?: boolean;
  tokens?: Partial<DesignTokens>;
}

// =============================================================================
// Theme Presets
// =============================================================================

/**
 * Theme preset - a pre-configured theme
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category:
    | "modern"
    | "classic"
    | "playful"
    | "corporate"
    | "minimal"
    | "custom";
  preview: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: string;
  };
  tokens: Partial<DesignTokens>;
}

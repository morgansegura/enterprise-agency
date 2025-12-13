/**
 * Enterprise Design Token System
 *
 * A comprehensive, multi-layered design token architecture that enables
 * complete website customization while maintaining consistency and scalability.
 *
 * Architecture:
 * 1. Primitive Tokens - Raw Tailwind values (spacing-4, text-base, etc.)
 * 2. Semantic Tokens - Meaningful names (body-text, card-padding, etc.)
 * 3. Component Tokens - Component-specific overrides
 * 4. Theme Tokens - Brand-level customizations
 */

// ============================================================================
// LAYER 1: PRIMITIVE TOKENS (Tailwind Scale)
// ============================================================================

/**
 * Spacing primitives - Used for padding, margin, gap
 * Maps to Tailwind's spacing scale
 */
export const primitiveSpacing = {
  "0": { value: "0px", px: 0 },
  px: { value: "1px", px: 1 },
  "0.5": { value: "0.125rem", px: 2 },
  "1": { value: "0.25rem", px: 4 },
  "1.5": { value: "0.375rem", px: 6 },
  "2": { value: "0.5rem", px: 8 },
  "2.5": { value: "0.625rem", px: 10 },
  "3": { value: "0.75rem", px: 12 },
  "3.5": { value: "0.875rem", px: 14 },
  "4": { value: "1rem", px: 16 },
  "5": { value: "1.25rem", px: 20 },
  "6": { value: "1.5rem", px: 24 },
  "7": { value: "1.75rem", px: 28 },
  "8": { value: "2rem", px: 32 },
  "9": { value: "2.25rem", px: 36 },
  "10": { value: "2.5rem", px: 40 },
  "11": { value: "2.75rem", px: 44 },
  "12": { value: "3rem", px: 48 },
  "14": { value: "3.5rem", px: 56 },
  "16": { value: "4rem", px: 64 },
  "20": { value: "5rem", px: 80 },
  "24": { value: "6rem", px: 96 },
  "28": { value: "7rem", px: 112 },
  "32": { value: "8rem", px: 128 },
  "36": { value: "9rem", px: 144 },
  "40": { value: "10rem", px: 160 },
  "44": { value: "11rem", px: 176 },
  "48": { value: "12rem", px: 192 },
  "52": { value: "13rem", px: 208 },
  "56": { value: "14rem", px: 224 },
  "60": { value: "15rem", px: 240 },
  "64": { value: "16rem", px: 256 },
  "72": { value: "18rem", px: 288 },
  "80": { value: "20rem", px: 320 },
  "96": { value: "24rem", px: 384 },
} as const;

/**
 * Typography scale - Font sizes with recommended line heights
 */
export const primitiveTypography = {
  fontSize: {
    xs: { value: "0.75rem", px: 12, lineHeight: "1rem" },
    sm: { value: "0.875rem", px: 14, lineHeight: "1.25rem" },
    base: { value: "1rem", px: 16, lineHeight: "1.5rem" },
    lg: { value: "1.125rem", px: 18, lineHeight: "1.75rem" },
    xl: { value: "1.25rem", px: 20, lineHeight: "1.75rem" },
    "2xl": { value: "1.5rem", px: 24, lineHeight: "2rem" },
    "3xl": { value: "1.875rem", px: 30, lineHeight: "2.25rem" },
    "4xl": { value: "2.25rem", px: 36, lineHeight: "2.5rem" },
    "5xl": { value: "3rem", px: 48, lineHeight: "1" },
    "6xl": { value: "3.75rem", px: 60, lineHeight: "1" },
    "7xl": { value: "4.5rem", px: 72, lineHeight: "1" },
    "8xl": { value: "6rem", px: 96, lineHeight: "1" },
    "9xl": { value: "8rem", px: 128, lineHeight: "1" },
  },
  fontWeight: {
    thin: { value: "100", label: "Thin" },
    extralight: { value: "200", label: "Extra Light" },
    light: { value: "300", label: "Light" },
    normal: { value: "400", label: "Normal" },
    medium: { value: "500", label: "Medium" },
    semibold: { value: "600", label: "Semibold" },
    bold: { value: "700", label: "Bold" },
    extrabold: { value: "800", label: "Extra Bold" },
    black: { value: "900", label: "Black" },
  },
  lineHeight: {
    none: { value: "1", label: "None" },
    tight: { value: "1.25", label: "Tight" },
    snug: { value: "1.375", label: "Snug" },
    normal: { value: "1.5", label: "Normal" },
    relaxed: { value: "1.625", label: "Relaxed" },
    loose: { value: "2", label: "Loose" },
  },
  letterSpacing: {
    tighter: { value: "-0.05em", label: "Tighter" },
    tight: { value: "-0.025em", label: "Tight" },
    normal: { value: "0em", label: "Normal" },
    wide: { value: "0.025em", label: "Wide" },
    wider: { value: "0.05em", label: "Wider" },
    widest: { value: "0.1em", label: "Widest" },
  },
} as const;

/**
 * Border primitives
 */
export const primitiveBorder = {
  radius: {
    none: { value: "0px", label: "None" },
    sm: { value: "0.125rem", px: 2, label: "Small" },
    DEFAULT: { value: "0.25rem", px: 4, label: "Default" },
    md: { value: "0.375rem", px: 6, label: "Medium" },
    lg: { value: "0.5rem", px: 8, label: "Large" },
    xl: { value: "0.75rem", px: 12, label: "Extra Large" },
    "2xl": { value: "1rem", px: 16, label: "2X Large" },
    "3xl": { value: "1.5rem", px: 24, label: "3X Large" },
    full: { value: "9999px", label: "Full (Pill)" },
  },
  width: {
    "0": { value: "0px", label: "None" },
    DEFAULT: { value: "1px", label: "Default" },
    "2": { value: "2px", label: "2px" },
    "4": { value: "4px", label: "4px" },
    "8": { value: "8px", label: "8px" },
  },
} as const;

/**
 * Shadow primitives
 */
export const primitiveShadow = {
  none: { value: "0 0 #0000", label: "None" },
  sm: { value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", label: "Small" },
  DEFAULT: {
    value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    label: "Default",
  },
  md: {
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    label: "Medium",
  },
  lg: {
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    label: "Large",
  },
  xl: {
    value:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    label: "Extra Large",
  },
  "2xl": { value: "0 25px 50px -12px rgb(0 0 0 / 0.25)", label: "2X Large" },
  inner: { value: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)", label: "Inner" },
} as const;

/**
 * Transition primitives
 */
export const primitiveTransition = {
  duration: {
    "0": { value: "0ms", label: "None" },
    "75": { value: "75ms", label: "75ms" },
    "100": { value: "100ms", label: "100ms" },
    "150": { value: "150ms", label: "150ms" },
    "200": { value: "200ms", label: "200ms" },
    "300": { value: "300ms", label: "300ms" },
    "500": { value: "500ms", label: "500ms" },
    "700": { value: "700ms", label: "700ms" },
    "1000": { value: "1000ms", label: "1000ms" },
  },
  timing: {
    linear: { value: "linear", label: "Linear" },
    in: { value: "cubic-bezier(0.4, 0, 1, 1)", label: "Ease In" },
    out: { value: "cubic-bezier(0, 0, 0.2, 1)", label: "Ease Out" },
    "in-out": { value: "cubic-bezier(0.4, 0, 0.2, 1)", label: "Ease In-Out" },
  },
} as const;

// ============================================================================
// LAYER 2: SEMANTIC TOKENS (Meaningful Names)
// ============================================================================

/**
 * Semantic spacing tokens - Map meaningful names to primitive values
 */
export const semanticSpacing = {
  // Component-level spacing
  component: {
    xs: "1", // 4px - Very tight spacing
    sm: "2", // 8px - Small elements
    md: "3", // 12px - Default spacing
    lg: "4", // 16px - Comfortable spacing
    xl: "6", // 24px - Large spacing
    "2xl": "8", // 32px - Very large spacing
  },
  // Section-level spacing
  section: {
    sm: "8", // 32px
    md: "12", // 48px
    lg: "16", // 64px
    xl: "24", // 96px
    "2xl": "32", // 128px
  },
  // Gap between items
  gap: {
    xs: "1", // 4px
    sm: "2", // 8px
    md: "4", // 16px
    lg: "6", // 24px
    xl: "8", // 32px
  },
} as const;

/**
 * Semantic typography tokens
 */
export const semanticTypography = {
  // Body text styles
  body: {
    xs: { fontSize: "xs", lineHeight: "normal", letterSpacing: "normal" },
    sm: { fontSize: "sm", lineHeight: "normal", letterSpacing: "normal" },
    base: { fontSize: "base", lineHeight: "relaxed", letterSpacing: "normal" },
    lg: { fontSize: "lg", lineHeight: "relaxed", letterSpacing: "normal" },
  },
  // Heading styles
  heading: {
    h6: {
      fontSize: "lg",
      fontWeight: "semibold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h5: {
      fontSize: "xl",
      fontWeight: "semibold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h4: {
      fontSize: "2xl",
      fontWeight: "bold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h3: {
      fontSize: "3xl",
      fontWeight: "bold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h2: {
      fontSize: "4xl",
      fontWeight: "bold",
      lineHeight: "none",
      letterSpacing: "tight",
    },
    h1: {
      fontSize: "5xl",
      fontWeight: "extrabold",
      lineHeight: "none",
      letterSpacing: "tight",
    },
    display: {
      fontSize: "6xl",
      fontWeight: "extrabold",
      lineHeight: "none",
      letterSpacing: "tighter",
    },
  },
  // Label styles (forms, captions)
  label: {
    sm: { fontSize: "xs", fontWeight: "medium", letterSpacing: "wide" },
    base: { fontSize: "sm", fontWeight: "medium", letterSpacing: "normal" },
    lg: { fontSize: "base", fontWeight: "medium", letterSpacing: "normal" },
  },
} as const;

// ============================================================================
// LAYER 3: COMPONENT TOKENS (Component-specific)
// ============================================================================

/**
 * Button component tokens with all customizable properties
 */
export interface ButtonTokens {
  // Size variants
  size: {
    xs: ButtonSizeTokens;
    sm: ButtonSizeTokens;
    md: ButtonSizeTokens;
    lg: ButtonSizeTokens;
    xl: ButtonSizeTokens;
  };
  // Style settings
  borderRadius: string;
  fontWeight: string;
  letterSpacing: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  // Transition
  transitionDuration: string;
  transitionTiming: string;
  // Focus ring
  focusRingWidth: string;
  focusRingOffset: string;
}

export interface ButtonSizeTokens {
  paddingX: string;
  paddingY: string;
  fontSize: string;
  gap: string; // Icon gap
  minHeight: string;
}

/**
 * Input component tokens
 */
export interface InputTokens {
  // Size variants
  size: {
    sm: InputSizeTokens;
    md: InputSizeTokens;
    lg: InputSizeTokens;
  };
  // Style settings
  borderRadius: string;
  borderWidth: string;
  fontSize: string;
  fontWeight: string;
  // Focus
  focusRingWidth: string;
  focusRingOffset: string;
  // Transition
  transitionDuration: string;
}

export interface InputSizeTokens {
  paddingX: string;
  paddingY: string;
  fontSize: string;
  minHeight: string;
}

/**
 * Card component tokens
 */
export interface CardTokens {
  // Container
  borderRadius: string;
  borderWidth: string;
  shadow: string;
  // Sections
  header: {
    paddingX: string;
    paddingY: string;
    borderBottom: boolean;
  };
  content: {
    paddingX: string;
    paddingY: string;
  };
  footer: {
    paddingX: string;
    paddingY: string;
    borderTop: boolean;
  };
  // Typography
  title: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  description: {
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  // Hover effects
  hoverShadow: string;
  hoverScale: string;
  transitionDuration: string;
}

/**
 * Badge/Tag component tokens
 */
export interface BadgeTokens {
  size: {
    sm: { paddingX: string; paddingY: string; fontSize: string };
    md: { paddingX: string; paddingY: string; fontSize: string };
    lg: { paddingX: string; paddingY: string; fontSize: string };
  };
  borderRadius: string;
  fontWeight: string;
  letterSpacing: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
}

/**
 * Avatar component tokens
 */
export interface AvatarTokens {
  size: {
    xs: { dimension: string; fontSize: string };
    sm: { dimension: string; fontSize: string };
    md: { dimension: string; fontSize: string };
    lg: { dimension: string; fontSize: string };
    xl: { dimension: string; fontSize: string };
    "2xl": { dimension: string; fontSize: string };
  };
  borderRadius: string;
  borderWidth: string;
}

// ============================================================================
// DEFAULT COMPONENT TOKEN VALUES
// ============================================================================

export const defaultButtonTokens: ButtonTokens = {
  size: {
    xs: {
      paddingX: "2",
      paddingY: "1",
      fontSize: "xs",
      gap: "1",
      minHeight: "6",
    },
    sm: {
      paddingX: "3",
      paddingY: "1.5",
      fontSize: "sm",
      gap: "1.5",
      minHeight: "8",
    },
    md: {
      paddingX: "4",
      paddingY: "2",
      fontSize: "sm",
      gap: "2",
      minHeight: "10",
    },
    lg: {
      paddingX: "6",
      paddingY: "2.5",
      fontSize: "base",
      gap: "2",
      minHeight: "12",
    },
    xl: {
      paddingX: "8",
      paddingY: "3",
      fontSize: "lg",
      gap: "3",
      minHeight: "14",
    },
  },
  borderRadius: "md",
  fontWeight: "medium",
  letterSpacing: "normal",
  textTransform: "none",
  transitionDuration: "150",
  transitionTiming: "in-out",
  focusRingWidth: "2",
  focusRingOffset: "2",
};

export const defaultInputTokens: InputTokens = {
  size: {
    sm: { paddingX: "2.5", paddingY: "1.5", fontSize: "sm", minHeight: "8" },
    md: { paddingX: "3", paddingY: "2", fontSize: "sm", minHeight: "10" },
    lg: { paddingX: "4", paddingY: "2.5", fontSize: "base", minHeight: "12" },
  },
  borderRadius: "md",
  borderWidth: "DEFAULT",
  fontSize: "sm",
  fontWeight: "normal",
  focusRingWidth: "2",
  focusRingOffset: "0",
  transitionDuration: "150",
};

export const defaultCardTokens: CardTokens = {
  borderRadius: "lg",
  borderWidth: "DEFAULT",
  shadow: "sm",
  header: {
    paddingX: "6",
    paddingY: "4",
    borderBottom: true,
  },
  content: {
    paddingX: "6",
    paddingY: "4",
  },
  footer: {
    paddingX: "6",
    paddingY: "4",
    borderTop: true,
  },
  title: {
    fontSize: "lg",
    fontWeight: "semibold",
    lineHeight: "tight",
    letterSpacing: "tight",
  },
  description: {
    fontSize: "sm",
    fontWeight: "normal",
    lineHeight: "normal",
  },
  hoverShadow: "md",
  hoverScale: "1",
  transitionDuration: "200",
};

export const defaultBadgeTokens: BadgeTokens = {
  size: {
    sm: { paddingX: "2", paddingY: "0.5", fontSize: "xs" },
    md: { paddingX: "2.5", paddingY: "0.5", fontSize: "xs" },
    lg: { paddingX: "3", paddingY: "1", fontSize: "sm" },
  },
  borderRadius: "full",
  fontWeight: "medium",
  letterSpacing: "normal",
  textTransform: "none",
};

export const defaultAvatarTokens: AvatarTokens = {
  size: {
    xs: { dimension: "6", fontSize: "xs" },
    sm: { dimension: "8", fontSize: "sm" },
    md: { dimension: "10", fontSize: "base" },
    lg: { dimension: "12", fontSize: "lg" },
    xl: { dimension: "16", fontSize: "xl" },
    "2xl": { dimension: "20", fontSize: "2xl" },
  },
  borderRadius: "full",
  borderWidth: "2",
};

// ============================================================================
// UI SELECT OPTIONS (for settings panels)
// ============================================================================

export const spacingSelectOptions = [
  { value: "0", label: "0", description: "0px" },
  { value: "0.5", label: "0.5", description: "2px" },
  { value: "1", label: "1", description: "4px" },
  { value: "1.5", label: "1.5", description: "6px" },
  { value: "2", label: "2", description: "8px" },
  { value: "2.5", label: "2.5", description: "10px" },
  { value: "3", label: "3", description: "12px" },
  { value: "3.5", label: "3.5", description: "14px" },
  { value: "4", label: "4", description: "16px" },
  { value: "5", label: "5", description: "20px" },
  { value: "6", label: "6", description: "24px" },
  { value: "7", label: "7", description: "28px" },
  { value: "8", label: "8", description: "32px" },
  { value: "9", label: "9", description: "36px" },
  { value: "10", label: "10", description: "40px" },
  { value: "12", label: "12", description: "48px" },
  { value: "14", label: "14", description: "56px" },
  { value: "16", label: "16", description: "64px" },
];

export const fontSizeSelectOptions = [
  { value: "xs", label: "xs", description: "12px" },
  { value: "sm", label: "sm", description: "14px" },
  { value: "base", label: "base", description: "16px" },
  { value: "lg", label: "lg", description: "18px" },
  { value: "xl", label: "xl", description: "20px" },
  { value: "2xl", label: "2xl", description: "24px" },
  { value: "3xl", label: "3xl", description: "30px" },
  { value: "4xl", label: "4xl", description: "36px" },
  { value: "5xl", label: "5xl", description: "48px" },
  { value: "6xl", label: "6xl", description: "60px" },
  { value: "7xl", label: "7xl", description: "72px" },
  { value: "8xl", label: "8xl", description: "96px" },
  { value: "9xl", label: "9xl", description: "128px" },
];

export const fontWeightSelectOptions = [
  { value: "thin", label: "Thin", description: "100" },
  { value: "extralight", label: "Extra Light", description: "200" },
  { value: "light", label: "Light", description: "300" },
  { value: "normal", label: "Normal", description: "400" },
  { value: "medium", label: "Medium", description: "500" },
  { value: "semibold", label: "Semibold", description: "600" },
  { value: "bold", label: "Bold", description: "700" },
  { value: "extrabold", label: "Extra Bold", description: "800" },
  { value: "black", label: "Black", description: "900" },
];

export const lineHeightSelectOptions = [
  { value: "none", label: "none", description: "1" },
  { value: "tight", label: "tight", description: "1.25" },
  { value: "snug", label: "snug", description: "1.375" },
  { value: "normal", label: "normal", description: "1.5" },
  { value: "relaxed", label: "relaxed", description: "1.625" },
  { value: "loose", label: "loose", description: "2" },
];

export const letterSpacingSelectOptions = [
  { value: "tighter", label: "tighter", description: "-0.05em" },
  { value: "tight", label: "tight", description: "-0.025em" },
  { value: "normal", label: "normal", description: "0em" },
  { value: "wide", label: "wide", description: "0.025em" },
  { value: "wider", label: "wider", description: "0.05em" },
  { value: "widest", label: "widest", description: "0.1em" },
];

export const borderRadiusSelectOptions = [
  { value: "none", label: "none", description: "0px" },
  { value: "sm", label: "sm", description: "2px" },
  { value: "DEFAULT", label: "default", description: "4px" },
  { value: "md", label: "md", description: "6px" },
  { value: "lg", label: "lg", description: "8px" },
  { value: "xl", label: "xl", description: "12px" },
  { value: "2xl", label: "2xl", description: "16px" },
  { value: "3xl", label: "3xl", description: "24px" },
  { value: "full", label: "full", description: "9999px" },
];

export const borderWidthSelectOptions = [
  { value: "0", label: "0", description: "0px" },
  { value: "DEFAULT", label: "1", description: "1px" },
  { value: "2", label: "2", description: "2px" },
  { value: "4", label: "4", description: "4px" },
  { value: "8", label: "8", description: "8px" },
];

export const shadowSelectOptions = [
  { value: "none", label: "none", description: "No shadow" },
  { value: "sm", label: "sm", description: "Subtle" },
  { value: "DEFAULT", label: "default", description: "Default" },
  { value: "md", label: "md", description: "Medium" },
  { value: "lg", label: "lg", description: "Large" },
  { value: "xl", label: "xl", description: "Extra Large" },
  { value: "2xl", label: "2xl", description: "2X Large" },
  { value: "inner", label: "inner", description: "Inner shadow" },
];

export const transitionDurationSelectOptions = [
  { value: "0", label: "0", description: "None" },
  { value: "75", label: "75", description: "75ms" },
  { value: "100", label: "100", description: "100ms" },
  { value: "150", label: "150", description: "150ms" },
  { value: "200", label: "200", description: "200ms" },
  { value: "300", label: "300", description: "300ms" },
  { value: "500", label: "500", description: "500ms" },
  { value: "700", label: "700", description: "700ms" },
  { value: "1000", label: "1000", description: "1s" },
];

export const transitionTimingSelectOptions = [
  { value: "linear", label: "Linear", description: "Constant speed" },
  { value: "in", label: "Ease In", description: "Start slow" },
  { value: "out", label: "Ease Out", description: "End slow" },
  { value: "in-out", label: "Ease In-Out", description: "Smooth" },
];

export const textTransformSelectOptions = [
  { value: "none", label: "None", description: "Normal" },
  { value: "uppercase", label: "Uppercase", description: "ALL CAPS" },
  { value: "lowercase", label: "Lowercase", description: "all lower" },
  { value: "capitalize", label: "Capitalize", description: "Title Case" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert a Tailwind spacing key to CSS value
 */
export function getSpacingValue(key: string): string {
  const spacing = primitiveSpacing[key as keyof typeof primitiveSpacing];
  return spacing?.value ?? key;
}

/**
 * Convert a Tailwind font size key to CSS value
 */
export function getFontSizeValue(key: string): string {
  const fontSize =
    primitiveTypography.fontSize[
      key as keyof typeof primitiveTypography.fontSize
    ];
  return fontSize?.value ?? key;
}

/**
 * Convert a Tailwind font weight key to CSS value
 */
export function getFontWeightValue(key: string): string {
  const fontWeight =
    primitiveTypography.fontWeight[
      key as keyof typeof primitiveTypography.fontWeight
    ];
  return fontWeight?.value ?? key;
}

/**
 * Convert a Tailwind line height key to CSS value
 */
export function getLineHeightValue(key: string): string {
  const lineHeight =
    primitiveTypography.lineHeight[
      key as keyof typeof primitiveTypography.lineHeight
    ];
  return lineHeight?.value ?? key;
}

/**
 * Convert a Tailwind letter spacing key to CSS value
 */
export function getLetterSpacingValue(key: string): string {
  const letterSpacing =
    primitiveTypography.letterSpacing[
      key as keyof typeof primitiveTypography.letterSpacing
    ];
  return letterSpacing?.value ?? key;
}

/**
 * Convert a Tailwind border radius key to CSS value
 */
export function getBorderRadiusValue(key: string): string {
  const borderRadius =
    primitiveBorder.radius[key as keyof typeof primitiveBorder.radius];
  return borderRadius?.value ?? key;
}

/**
 * Convert a Tailwind border width key to CSS value
 */
export function getBorderWidthValue(key: string): string {
  const borderWidth =
    primitiveBorder.width[key as keyof typeof primitiveBorder.width];
  return borderWidth?.value ?? key;
}

/**
 * Convert a Tailwind shadow key to CSS value
 */
export function getShadowValue(key: string): string {
  const shadow = primitiveShadow[key as keyof typeof primitiveShadow];
  return shadow?.value ?? key;
}

/**
 * Convert a Tailwind transition duration key to CSS value
 */
export function getTransitionDurationValue(key: string): string {
  const duration =
    primitiveTransition.duration[
      key as keyof typeof primitiveTransition.duration
    ];
  return duration?.value ?? key;
}

/**
 * Convert a Tailwind transition timing key to CSS value
 */
export function getTransitionTimingValue(key: string): string {
  const timing =
    primitiveTransition.timing[key as keyof typeof primitiveTransition.timing];
  return timing?.value ?? key;
}

// ============================================================================
// THEME PRESETS
// ============================================================================

export type ThemePreset =
  | "modern"
  | "classic"
  | "playful"
  | "corporate"
  | "minimal";

export const themePresets: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    button: Partial<ButtonTokens>;
    input: Partial<InputTokens>;
    card: Partial<CardTokens>;
  }
> = {
  modern: {
    name: "Modern",
    description:
      "Clean, contemporary design with subtle shadows and rounded corners",
    button: {
      borderRadius: "lg",
      fontWeight: "medium",
      textTransform: "none",
    },
    input: {
      borderRadius: "lg",
      borderWidth: "DEFAULT",
    },
    card: {
      borderRadius: "xl",
      shadow: "md",
      borderWidth: "0",
    },
  },
  classic: {
    name: "Classic",
    description: "Timeless design with traditional styling",
    button: {
      borderRadius: "DEFAULT",
      fontWeight: "semibold",
      textTransform: "none",
    },
    input: {
      borderRadius: "DEFAULT",
      borderWidth: "DEFAULT",
    },
    card: {
      borderRadius: "DEFAULT",
      shadow: "sm",
      borderWidth: "DEFAULT",
    },
  },
  playful: {
    name: "Playful",
    description: "Fun, friendly design with bold rounded elements",
    button: {
      borderRadius: "full",
      fontWeight: "bold",
      textTransform: "none",
    },
    input: {
      borderRadius: "xl",
      borderWidth: "2",
    },
    card: {
      borderRadius: "2xl",
      shadow: "lg",
      borderWidth: "0",
    },
  },
  corporate: {
    name: "Corporate",
    description: "Professional, business-oriented design",
    button: {
      borderRadius: "sm",
      fontWeight: "semibold",
      textTransform: "uppercase",
      letterSpacing: "wide",
    },
    input: {
      borderRadius: "sm",
      borderWidth: "DEFAULT",
    },
    card: {
      borderRadius: "md",
      shadow: "sm",
      borderWidth: "DEFAULT",
    },
  },
  minimal: {
    name: "Minimal",
    description: "Ultra-clean design with sharp edges",
    button: {
      borderRadius: "none",
      fontWeight: "medium",
      textTransform: "none",
    },
    input: {
      borderRadius: "none",
      borderWidth: "DEFAULT",
    },
    card: {
      borderRadius: "none",
      shadow: "none",
      borderWidth: "DEFAULT",
    },
  },
};

/**
 * Theme Presets
 *
 * Curated color/typography combinations users can apply to their site
 * with one click. Each preset writes to the tenant's themeConfig.semantic
 * field which the client TokenProvider injects as CSS variables.
 *
 * Override anything you want at the section/container/block level —
 * those values cascade on top of the preset.
 */

export interface ThemePresetColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructive: string;
}

export interface ThemePresetFonts {
  heading: string;
  body: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: "professional" | "creative" | "minimal" | "bold" | "warm";
  colors: ThemePresetColors;
  fonts: ThemePresetFonts;
}

// =============================================================================
// Presets
// =============================================================================

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean and professional with blue accents",
    category: "professional",
    colors: {
      primary: "#2563eb",
      primaryForeground: "#ffffff",
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",
      accent: "#3b82f6",
      accentForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
      destructive: "#ef4444",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Sophisticated dark theme with electric blue",
    category: "bold",
    colors: {
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#1e293b",
      secondaryForeground: "#f8fafc",
      accent: "#06b6d4",
      accentForeground: "#ffffff",
      background: "#0f172a",
      foreground: "#f8fafc",
      card: "#1e293b",
      cardForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      border: "#334155",
      destructive: "#f87171",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens with warm earth tones",
    category: "warm",
    colors: {
      primary: "#15803d",
      primaryForeground: "#ffffff",
      secondary: "#f0fdf4",
      secondaryForeground: "#14532d",
      accent: "#84cc16",
      accentForeground: "#1a2e05",
      background: "#fefce8",
      foreground: "#1c1917",
      card: "#ffffff",
      cardForeground: "#1c1917",
      muted: "#f5f5f4",
      mutedForeground: "#78716c",
      border: "#e7e5e4",
      destructive: "#dc2626",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Source Sans 3",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges and soft creams",
    category: "warm",
    colors: {
      primary: "#ea580c",
      primaryForeground: "#ffffff",
      secondary: "#fff7ed",
      secondaryForeground: "#7c2d12",
      accent: "#f59e0b",
      accentForeground: "#ffffff",
      background: "#fffbeb",
      foreground: "#1c1917",
      card: "#ffffff",
      cardForeground: "#1c1917",
      muted: "#fef3c7",
      mutedForeground: "#78716c",
      border: "#fde68a",
      destructive: "#dc2626",
    },
    fonts: {
      heading: "Fraunces",
      body: "Inter",
    },
  },
  {
    id: "rose",
    name: "Rose Gold",
    description: "Elegant pinks with warm metallics",
    category: "creative",
    colors: {
      primary: "#db2777",
      primaryForeground: "#ffffff",
      secondary: "#fdf2f8",
      secondaryForeground: "#831843",
      accent: "#f472b6",
      accentForeground: "#ffffff",
      background: "#fffafc",
      foreground: "#1f2937",
      card: "#ffffff",
      cardForeground: "#1f2937",
      muted: "#fce7f3",
      mutedForeground: "#6b7280",
      border: "#fbcfe8",
      destructive: "#dc2626",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
    },
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Pure black and white with sharp typography",
    category: "minimal",
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#f5f5f5",
      secondaryForeground: "#000000",
      accent: "#262626",
      accentForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#000000",
      card: "#ffffff",
      cardForeground: "#000000",
      muted: "#f5f5f5",
      mutedForeground: "#737373",
      border: "#e5e5e5",
      destructive: "#dc2626",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool teals and ocean blues",
    category: "professional",
    colors: {
      primary: "#0891b2",
      primaryForeground: "#ffffff",
      secondary: "#ecfeff",
      secondaryForeground: "#164e63",
      accent: "#06b6d4",
      accentForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#0c4a6e",
      card: "#ffffff",
      cardForeground: "#0c4a6e",
      muted: "#f0f9ff",
      mutedForeground: "#0369a1",
      border: "#bae6fd",
      destructive: "#ef4444",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "vibrant-purple",
    name: "Vibrant Purple",
    description: "Bold purples with energetic accents",
    category: "creative",
    colors: {
      primary: "#7c3aed",
      primaryForeground: "#ffffff",
      secondary: "#f5f3ff",
      secondaryForeground: "#4c1d95",
      accent: "#a855f7",
      accentForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#1e1b4b",
      card: "#ffffff",
      cardForeground: "#1e1b4b",
      muted: "#f5f3ff",
      mutedForeground: "#6b7280",
      border: "#ddd6fe",
      destructive: "#ef4444",
    },
    fonts: {
      heading: "Outfit",
      body: "Inter",
    },
  },
];

/**
 * Get a preset by ID
 */
export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(
  category: ThemePreset["category"],
): ThemePreset[] {
  return THEME_PRESETS.filter((p) => p.category === category);
}

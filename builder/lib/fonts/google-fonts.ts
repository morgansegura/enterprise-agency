/**
 * Curated Google Fonts List
 *
 * A selection of popular, high-quality Google Fonts organized by category.
 * These fonts are optimized for web use and cover most design needs.
 */

export interface GoogleFont {
  family: string;
  category: "sans-serif" | "serif" | "monospace" | "display" | "handwriting";
  weights: number[];
  popular?: boolean;
}

/**
 * Curated list of ~40 popular Google Fonts
 */
export const googleFonts: GoogleFont[] = [
  // Sans-serif (most common for web)
  {
    family: "Inter",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    popular: true,
  },
  {
    family: "Roboto",
    category: "sans-serif",
    weights: [300, 400, 500, 700],
    popular: true,
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    popular: true,
  },
  {
    family: "Lato",
    category: "sans-serif",
    weights: [300, 400, 700, 900],
    popular: true,
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    popular: true,
  },
  {
    family: "Poppins",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
    popular: true,
  },
  {
    family: "Source Sans 3",
    category: "sans-serif",
    weights: [300, 400, 600, 700],
  },
  {
    family: "Nunito",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "Raleway",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "Work Sans",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },
  { family: "DM Sans", category: "sans-serif", weights: [400, 500, 700] },
  {
    family: "Manrope",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
  },
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
  },
  {
    family: "Outfit",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "Space Grotesk",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },

  // Condensed Sans-serif (great for headings)
  {
    family: "Roboto Condensed",
    category: "sans-serif",
    weights: [300, 400, 700],
    popular: true,
  },
  {
    family: "Oswald",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "Barlow Condensed",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
  },

  // Serif (elegant, traditional)
  {
    family: "Playfair Display",
    category: "serif",
    weights: [400, 500, 600, 700],
    popular: true,
  },
  {
    family: "Merriweather",
    category: "serif",
    weights: [300, 400, 700],
    popular: true,
  },
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700] },
  {
    family: "Source Serif 4",
    category: "serif",
    weights: [300, 400, 600, 700],
  },
  { family: "PT Serif", category: "serif", weights: [400, 700] },
  { family: "Libre Baskerville", category: "serif", weights: [400, 700] },
  { family: "Crimson Text", category: "serif", weights: [400, 600, 700] },
  { family: "EB Garamond", category: "serif", weights: [400, 500, 600, 700] },
  {
    family: "Cormorant Garamond",
    category: "serif",
    weights: [300, 400, 500, 600, 700],
  },
  { family: "Fraunces", category: "serif", weights: [300, 400, 500, 600, 700] },

  // Display (bold, impactful for headings)
  { family: "Bebas Neue", category: "display", weights: [400] },
  { family: "Anton", category: "display", weights: [400] },
  { family: "Abril Fatface", category: "display", weights: [400] },
  { family: "Righteous", category: "display", weights: [400] },
  { family: "Permanent Marker", category: "display", weights: [400] },

  // Monospace (code, technical)
  {
    family: "Fira Code",
    category: "monospace",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "JetBrains Mono",
    category: "monospace",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "Source Code Pro",
    category: "monospace",
    weights: [300, 400, 500, 600, 700],
  },
  {
    family: "IBM Plex Mono",
    category: "monospace",
    weights: [300, 400, 500, 600, 700],
  },

  // Handwriting (casual, personal)
  { family: "Caveat", category: "handwriting", weights: [400, 500, 600, 700] },
  {
    family: "Dancing Script",
    category: "handwriting",
    weights: [400, 500, 600, 700],
  },
  { family: "Pacifico", category: "handwriting", weights: [400] },
];

/**
 * Get fonts by category
 */
export function getFontsByCategory(
  category: GoogleFont["category"],
): GoogleFont[] {
  return googleFonts.filter((font) => font.category === category);
}

/**
 * Get popular fonts
 */
export function getPopularFonts(): GoogleFont[] {
  return googleFonts.filter((font) => font.popular);
}

/**
 * Find a font by family name
 */
export function findFont(family: string): GoogleFont | undefined {
  return googleFonts.find(
    (font) => font.family.toLowerCase() === family.toLowerCase(),
  );
}

/**
 * Build Google Fonts URL for loading
 */
export function buildGoogleFontsUrl(
  fonts: Array<{ family: string; weights: number[] }>,
): string {
  if (fonts.length === 0) return "";

  const families = fonts
    .map((font) => {
      const family = font.family.replace(/ /g, "+");
      const weights = font.weights.join(";");
      return `family=${family}:wght@${weights}`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Get fallback stack for a category
 */
export function getFallbackStack(category: GoogleFont["category"]): string {
  switch (category) {
    case "sans-serif":
      return "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    case "serif":
      return "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
    case "monospace":
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    case "display":
      return "ui-sans-serif, system-ui, sans-serif";
    case "handwriting":
      return "cursive, ui-sans-serif, sans-serif";
    default:
      return "sans-serif";
  }
}

/**
 * Build full font-family value with fallbacks
 */
export function buildFontFamily(
  family: string,
  category: GoogleFont["category"],
): string {
  const fallback = getFallbackStack(category);
  return `'${family}', ${fallback}`;
}

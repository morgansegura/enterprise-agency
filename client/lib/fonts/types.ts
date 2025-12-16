/**
 * Font System Types
 *
 * Types for the dynamic font loading system.
 * These types match the builder's font configuration.
 */

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
  /** Font category for fallback */
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

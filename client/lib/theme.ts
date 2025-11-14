/**
 * Theme utilities
 * Provides access to theme configuration throughout the app
 */

import { theme } from "./site-config";
import type { ThemeConfig } from "./types";

/**
 * Get the current theme configuration
 */
export function getTheme(): ThemeConfig {
  return theme;
}

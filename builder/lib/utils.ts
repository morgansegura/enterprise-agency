/**
 * Utility Functions for Builder
 *
 * Re-exports from @enterprise/tokens for backward compatibility.
 */

export { cn, type ClassValue } from "@enterprise/tokens";

/**
 * Generate initials from a string — first letter of each word, up to `max` characters.
 * "Web and Funnel" → "WaF", "Enterprise Agency" → "EA"
 */
export function initials(text: string, max = 4): string {
  return text
    .split(/\s+/)
    .slice(0, max)
    .map((w) => w[0])
    .join("");
}

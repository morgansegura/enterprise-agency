/**
 * @enterprise/tokens
 *
 * Comprehensive Tailwind CSS token system for the page builder.
 *
 * This package provides:
 * - Primitives: Raw Tailwind CSS values (colors, spacing, typography, etc.)
 * - Semantic: Abstracted scales that map to primitives
 * - Components: Property schemas for Section, Container, Text, Heading, Button, Image
 *
 * Usage:
 * ```typescript
 * // Import primitives
 * import { colors, spacing, fontSize } from '@enterprise/tokens/primitives';
 *
 * // Import semantic scales
 * import { sizeScale, radiusScale, shadowScale } from '@enterprise/tokens/semantic';
 *
 * // Import component schemas
 * import { SectionProperties, containerDefaults } from '@enterprise/tokens/components';
 * ```
 */

// =============================================================================
// Primitives (All Tailwind CSS values)
// =============================================================================

export * from "./primitives";

// =============================================================================
// Semantic (Abstracted scales)
// =============================================================================

export * from "./semantic";

// =============================================================================
// Components (Property schemas)
// =============================================================================

export * from "./components";

// =============================================================================
// Version
// =============================================================================

export const VERSION = "0.1.0";

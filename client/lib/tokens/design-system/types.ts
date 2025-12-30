/**
 * Design Token System Types
 *
 * Re-exports from @enterprise/tokens for backward compatibility.
 * All design token types are now in the shared tokens package.
 */

export {
  // Color types
  type ColorScale,
  type SemanticColors,
  type ColorTokens,
  // Font types
  type FontFamily,
  type FontDefinition,
  type FontRole,
  type FontRoles,
  type FontConfig,
  // Typography scale types
  type FontSizeScale,
  type FontWeightScale,
  type LineHeightScale,
  type LetterSpacingScale,
  type TypographyTokens,
  // Spacing types
  type SpacingScale,
  // Border & effect types
  type BorderRadiusScale,
  type ShadowScale,
  type TransitionScale,
  // Component types
  type ButtonSizeComponentSettings,
  type ButtonComponentSettings,
  type InputComponentSettings,
  type CardComponentSettings,
  type ComponentTokens,
  // Complete system
  type DesignTokens,
  type TenantTokenConfig,
} from "@enterprise/tokens";

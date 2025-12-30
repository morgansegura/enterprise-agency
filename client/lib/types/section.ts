/**
 * Section & Container Type Definitions
 *
 * Re-exports from @enterprise/tokens for backward compatibility.
 * All architecture types are now in the shared tokens package.
 *
 * @see /docs/architecture/page-structure.md
 */

export {
  // Spacing & Size Types
  type Spacing,
  type ExtendedSpacing,
  type BorderSize,
  type BorderRadius,
  type ShadowSize,
  type MinHeight,
  type Overflow,
  type ContainerMaxWidth,
  type SectionWidth,
  type Width,
  // Alignment Types
  type HorizontalAlign,
  type VerticalAlign,
  type JustifyContent,
  type AlignItems,
  type TextAlign,
  // Background Types
  type BackgroundVariant,
  type GradientStop,
  type GradientConfig,
  type TailwindGradientConfig,
  type ImageBackgroundConfig,
  type SectionBackground,
  // Visibility Types
  type BreakpointVisibility,
  // Container Layout Types
  type LayoutType,
  type FlexDirection,
  type ContainerLayout,
  // Core Architecture Types
  type Block,
  type Container,
  type SectionElement,
  type Section,
  // Typography Types
  type TextSize,
  type HeadingSize,
  type FontWeight,
  type HeadingLevel,
  type TextVariant,
  type HeadingVariant,
  // Utilities
  isSectionBackgroundObject,
  normalizeBackground,
  getBackgroundDataValue,
  isLegacyGradientConfig,
  isTailwindGradientConfig,
} from "@enterprise/tokens";

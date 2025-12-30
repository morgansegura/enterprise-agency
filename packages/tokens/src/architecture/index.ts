/**
 * Architecture Types
 *
 * Section → Container → Block architecture types for the page builder.
 */

export {
  // Spacing & Size
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
  // Alignment
  type HorizontalAlign,
  type VerticalAlign,
  type JustifyContent,
  type AlignItems,
  type TextAlign,
  // Background
  type BackgroundVariant,
  type GradientStop,
  type GradientConfig,
  type TailwindGradientConfig,
  type ImageBackgroundConfig,
  type SectionBackground,
  // Visibility
  type BreakpointVisibility,
  // Layout
  type LayoutType,
  type FlexDirection,
  type ContainerLayout,
  // Core Architecture
  type Block,
  type Container,
  type SectionElement,
  type Section,
  // Typography
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
} from "./types";

// Block types
export {
  // Responsive
  type ResponsiveColumns,
  type BlockAlignItems,
  type BlockJustifyContent,
  // Content block data
  type HeadingBlockData,
  type TextBlockData,
  type RichTextBlockData,
  type ImageBlockData,
  type ButtonBlockData,
  type CardBlockData,
  type VideoBlockData,
  type AudioBlockData,
  type ListBlockData,
  type QuoteBlockData,
  type AccordionBlockData,
  type TabsBlockData,
  type DividerBlockData,
  type SpacerBlockData,
  type EmbedBlockData,
  type IconBlockData,
  type StatsBlockData,
  type MapBlockData,
  // E-commerce block data
  type ProductGridBlockData,
  type ProductDetailBlockData,
  type CartBlockData,
  type CheckoutBlockData,
  // Container block data
  type GridLayoutData,
  type FlexLayoutData,
  type StackLayoutData,
  type ContainerLayoutData,
  // Block unions
  type ContentBlock,
  type ShallowContainerBlock,
  type DeepContainerBlock,
  type RootBlock,
  // Type guards
  isContainerBlock,
  isContentBlock,
} from "./blocks";

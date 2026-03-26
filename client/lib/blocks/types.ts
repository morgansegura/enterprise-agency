/**
 * Block System Type Definitions
 *
 * Re-exports from @enterprise/tokens for backward compatibility.
 * All block types are now in the shared tokens package.
 *
 * @see /docs/architecture/page-structure.md
 */

export {
  // Responsive
  type ResponsiveColumns,
  type BlockAlignItems as AlignItems,
  type BlockJustifyContent as JustifyContent,
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
  type StatItem,
  type StatsBlockData,
  type MapMarker,
  type MapBlockData,
  // Composite block data
  type HeroBlockData,
  type TestimonialItem,
  type TestimonialBlockData,
  type PricingTier,
  type PricingBlockData,
  type TeamMember,
  type TeamBlockData,
  type LogoBarBlockData,
  type CtaBlockData,
  // E-commerce block data
  type ProductGridBlockData,
  type ProductDetailBlockData,
  type CartBlockData,
  type CheckoutBlockData,
  // Container block data
  type GridLayoutData,
  type FlexLayoutData,
  type StackLayoutData,
  type ColumnsLayoutData,
  type ContainerLayoutData,
  // Block unions
  type ContentBlock,
  type ShallowContainerBlock,
  type DeepContainerBlock,
  type RootBlock,
  // Type guards
  isContainerBlock,
  isContentBlock,
} from "@enterprise/tokens";

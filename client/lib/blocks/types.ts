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
} from "@enterprise/tokens";

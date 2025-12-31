/**
 * @enterprise/blocks
 *
 * CMS content block renderers for the Enterprise platform.
 * Provides shared block components that render consistently
 * across builder and client apps.
 */

// Types
export type {
  BlockRendererProps,
  Block,
  Breakpoint,
  ContainerBlockData,
} from "./types";

// Content blocks
export {
  HeadingBlock,
  TextBlock,
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  ImageBlock,
  QuoteBlock,
  IconBlock,
  RichTextBlock,
  ListBlock,
} from "./content-blocks";

// Container blocks
export {
  ContainerBlock,
  GridBlock,
  FlexBlock,
  StackBlock,
} from "./container-blocks";

// Renderer utilities
export {
  blockRenderers,
  containerBlockTypes,
  isContainerBlock,
  getBlockRenderer,
} from "./renderer";

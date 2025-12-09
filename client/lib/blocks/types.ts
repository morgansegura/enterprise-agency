/**
 * Block System Type Definitions
 *
 * This file defines the complete block architecture supporting:
 * - Content blocks (leaf nodes): heading, text, image, etc.
 * - Container blocks (composable): grid, flex, stack
 * - 3-4 level nesting maximum
 * - Type-safe composition
 */

import type { Spacing } from "@/lib/types";

// ========================================
// Responsive Configuration
// ========================================

/** Responsive column configuration */
export type ResponsiveColumns = {
  /** Mobile devices (default) */
  mobile?: 1 | 2;
  /** Tablet devices (md breakpoint) */
  tablet?: 1 | 2 | 3 | 4;
  /** Desktop devices (lg breakpoint) */
  desktop?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Alignment options for flex/grid */
export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";

/** Justify content options */
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

// ========================================
// Content Block Data Types (Leaf Nodes)
// ========================================

/** Heading block data */
export type HeadingBlockData = {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  variant?: "default" | "primary" | "muted";
};

/** Text block data */
export type TextBlockData = {
  content: string;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  align?: "left" | "center" | "right" | "justify";
  variant?: "default" | "muted" | "lead" | "subtle";
};

/** Rich text block data (TipTap HTML output) */
export type RichTextBlockData = {
  html: string;
  align?: "left" | "center" | "right" | "justify";
};

/** Image block data */
export type ImageBlockData = {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  objectFit?: "contain" | "cover" | "fill" | "none";
};

/** Button block data */
export type ButtonBlockData = {
  text: string;
  href?: string;
  onClick?: string; // Action identifier
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

/** Card block data */
export type CardBlockData = {
  title?: string;
  description?: string;
  image?: ImageBlockData;
  imagePosition?: "top" | "left" | "background";
  actions?: ButtonBlockData[];
  variant?: "default" | "elevated" | "outlined";
};

/** Video block data */
export type VideoBlockData = {
  url: string; // YouTube/Vimeo URL or video file path
  provider?: "youtube" | "vimeo" | "native"; // Auto-detected if not provided
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9";
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  caption?: string;
};

/** Audio block data */
export type AudioBlockData = {
  url: string; // Audio file URL
  title?: string;
  artist?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
};

/** List block data */
export type ListBlockData = {
  items: string[];
  ordered?: boolean;
  style?: "default" | "disc" | "circle" | "square" | "decimal" | "none";
  spacing?: "tight" | "normal" | "relaxed";
};

/** Quote block data */
export type QuoteBlockData = {
  quote: string;
  author?: string;
  role?: string;
  avatar?: ImageBlockData;
  variant?: "default" | "bordered" | "card";
};

/** Accordion block data */
export type AccordionBlockData = {
  items: {
    title: string;
    content: string;
    defaultOpen?: boolean;
  }[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
};

/** Tabs block data */
export type TabsBlockData = {
  tabs: {
    label: string;
    content: string;
  }[];
  defaultTab?: number;
  variant?: "default" | "pills" | "underline";
};

/** Divider block data */
export type DividerBlockData = {
  style?: "solid" | "dashed" | "dotted";
  weight?: "thin" | "normal" | "thick";
  spacing?: "sm" | "md" | "lg";
  variant?: "default" | "gradient";
};

/** Spacer block data */
export type SpacerBlockData = {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
};

/** Embed block data */
export type EmbedBlockData = {
  url: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  height?: number;
};

/** Icon block data */
export type IconBlockData = {
  icon: string; // Icon name or SVG path
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  text?: string;
  position?: "top" | "left" | "right" | "bottom";
};

/** Stats block data */
export type StatsBlockData = {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  variant?: "default" | "card" | "minimal";
};

/** Map block data */
export type MapBlockData = {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: number;
  provider?: "google" | "openstreetmap";
};

// ========================================
// E-Commerce Block Data Types
// ========================================

/** Product grid block data - displays a grid of products */
export type ProductGridBlockData = {
  /** Category ID to filter products (optional) */
  categoryId?: string;
  /** Number of products to display */
  limit?: number;
  /** Number of columns */
  columns?: ResponsiveColumns | number;
  /** Only show featured products */
  featured?: boolean;
  /** Gap between items */
  gap?: Spacing;
  /** Show product price */
  showPrice?: boolean;
  /** Show add to cart button */
  showAddToCart?: boolean;
  /** Card variant */
  variant?: "default" | "minimal" | "detailed";
};

/** Product detail block data - displays a single product */
export type ProductDetailBlockData = {
  /** Product ID or slug to display */
  productId?: string;
  productSlug?: string;
  /** Layout variant */
  layout?: "horizontal" | "vertical";
  /** Show image gallery */
  showGallery?: boolean;
  /** Show variant selector */
  showVariants?: boolean;
  /** Show quantity selector */
  showQuantity?: boolean;
  /** Show add to cart button */
  showAddToCart?: boolean;
  /** Show description */
  showDescription?: boolean;
};

/** Cart block data - displays the shopping cart */
export type CartBlockData = {
  /** Compact mode for sidebar/header */
  compact?: boolean;
  /** Show checkout button */
  showCheckout?: boolean;
  /** Show continue shopping link */
  showContinueShopping?: boolean;
  /** Checkout button text */
  checkoutButtonText?: string;
  /** Empty cart message */
  emptyMessage?: string;
};

/** Checkout block data - displays checkout form */
export type CheckoutBlockData = {
  /** Show order summary */
  showOrderSummary?: boolean;
  /** Collect shipping address */
  collectShipping?: boolean;
  /** Collect billing address */
  collectBilling?: boolean;
  /** Allow different billing address */
  allowDifferentBilling?: boolean;
  /** Success redirect URL */
  successUrl?: string;
  /** Cancel redirect URL */
  cancelUrl?: string;
};

// ========================================
// Container Block Data Types
// ========================================

/** Grid layout configuration */
export type GridLayoutData = {
  columns: ResponsiveColumns | number;
  gap?: Spacing;
  align?: AlignItems;
  justify?: JustifyContent;
};

/** Flex layout configuration */
export type FlexLayoutData = {
  direction?: "row" | "col";
  wrap?: boolean;
  gap?: Spacing;
  align?: AlignItems;
  justify?: JustifyContent;
};

/** Stack layout configuration (vertical flex) */
export type StackLayoutData = {
  gap?: Spacing;
  align?: AlignItems;
};

/** Container layout configuration (width constraints without layout logic) */
export type ContainerLayoutData = {
  width?: "narrow" | "wide" | "full";
  spacing?: Spacing;
};

// ========================================
// Nesting Levels
// ========================================

/**
 * Level 4 - Content Blocks Only (Leaf Nodes)
 * These blocks cannot have children
 */
export type ContentBlock =
  | { _type: "heading-block"; _key: string; data: HeadingBlockData }
  | { _type: "text-block"; _key: string; data: TextBlockData }
  | { _type: "rich-text-block"; _key: string; data: RichTextBlockData }
  | { _type: "image-block"; _key: string; data: ImageBlockData }
  | { _type: "button-block"; _key: string; data: ButtonBlockData }
  | { _type: "card-block"; _key: string; data: CardBlockData }
  | { _type: "video-block"; _key: string; data: VideoBlockData }
  | { _type: "audio-block"; _key: string; data: AudioBlockData }
  | { _type: "list-block"; _key: string; data: ListBlockData }
  | { _type: "quote-block"; _key: string; data: QuoteBlockData }
  | { _type: "accordion-block"; _key: string; data: AccordionBlockData }
  | { _type: "tabs-block"; _key: string; data: TabsBlockData }
  | { _type: "divider-block"; _key: string; data: DividerBlockData }
  | { _type: "spacer-block"; _key: string; data: SpacerBlockData }
  | { _type: "embed-block"; _key: string; data: EmbedBlockData }
  | { _type: "icon-block"; _key: string; data: IconBlockData }
  | { _type: "stats-block"; _key: string; data: StatsBlockData }
  | { _type: "map-block"; _key: string; data: MapBlockData }
  | {
      _type: "logo-block";
      _key: string;
      logo: string;
      size?: string;
      alignment?: string;
      clickable?: boolean;
    }
  | { _type: "product-grid-block"; _key: string; data: ProductGridBlockData }
  | {
      _type: "product-detail-block";
      _key: string;
      data: ProductDetailBlockData;
    }
  | { _type: "cart-block"; _key: string; data: CartBlockData }
  | { _type: "checkout-block"; _key: string; data: CheckoutBlockData };

/**
 * Level 3 - Shallow Container Blocks
 * Can contain ONLY ContentBlocks (one level of nesting)
 */
export type ShallowContainerBlock =
  | {
      _type: "container-block";
      _key: string;
      data: ContainerLayoutData;
      blocks: ContentBlock[];
    }
  | {
      _type: "grid-block";
      _key: string;
      data: GridLayoutData;
      blocks: ContentBlock[];
    }
  | {
      _type: "flex-block";
      _key: string;
      data: FlexLayoutData;
      blocks: ContentBlock[];
    }
  | {
      _type: "stack-block";
      _key: string;
      data: StackLayoutData;
      blocks: ContentBlock[];
    };

/**
 * Level 2 - Deep Container Blocks
 * Can contain ContentBlocks OR ShallowContainerBlocks (two levels of nesting)
 */
export type DeepContainerBlock =
  | {
      _type: "container-block";
      _key: string;
      data: ContainerLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    }
  | {
      _type: "grid-block";
      _key: string;
      data: GridLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    }
  | {
      _type: "flex-block";
      _key: string;
      data: FlexLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    }
  | {
      _type: "stack-block";
      _key: string;
      data: StackLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    };

/**
 * Level 1 - Root Blocks (Section Level)
 * Can contain any block type, creating maximum 4 levels of nesting:
 * Section > DeepContainer > ShallowContainer > Content
 */
export type RootBlock =
  | ContentBlock
  | ShallowContainerBlock
  | DeepContainerBlock;

/**
 * Type guard to check if a block is a container block
 */
export function isContainerBlock(
  block: RootBlock,
): block is ShallowContainerBlock | DeepContainerBlock {
  return "blocks" in block;
}

/**
 * Type guard to check if a block is a content block
 */
export function isContentBlock(block: RootBlock): block is ContentBlock {
  return !("blocks" in block);
}

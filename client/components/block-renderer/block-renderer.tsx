import type { RootBlock } from "@/lib/blocks";
import { isContainerBlock } from "@/lib/blocks";

// Content blocks
import { HeadingBlock } from "@/components/block/heading-block";
import { TextBlock } from "@/components/block/text-block";
import { RichTextBlock } from "@/components/block/rich-text-block";
import { ImageBlock } from "@/components/block/image-block";
import { ButtonBlock } from "@/components/block/button-block";
import { CardBlock } from "@/components/block/card-block";
import { VideoBlock } from "@/components/block/video-block";
import { AudioBlock } from "@/components/block/audio-block";
import { ListBlock } from "@/components/block/list-block";
import { QuoteBlock } from "@/components/block/quote-block";
import { AccordionBlock } from "@/components/block/accordion-block";
import { TabsBlock } from "@/components/block/tabs-block";
import { DividerBlock } from "@/components/block/divider-block";
import { SpacerBlock } from "@/components/block/spacer-block";
import { EmbedBlock } from "@/components/block/embed-block";
import { IconBlock } from "@/components/block/icon-block";
import { StatsBlock } from "@/components/block/stats-block";
import { MapBlock } from "@/components/block/map-block";
import { LogoBlock } from "@/components/block/logo-block";

// E-Commerce blocks
import { ProductGridBlock } from "@/components/block/product-grid-block";
import { ProductDetailBlock } from "@/components/block/product-detail-block";
import { CartBlock } from "@/components/block/cart-block";
import { CheckoutBlock } from "@/components/block/checkout-block";

// Container blocks
import { ContainerBlock } from "@/components/block/container-block";
import { GridBlock } from "@/components/block/grid-block";
import { FlexBlock } from "@/components/block/flex-block";
import { StackBlock } from "@/components/block/stack-block";

/**
 * BlockRenderer - Renders an array of blocks recursively
 *
 * This component takes block data and renders the appropriate
 * block component for each one. Container blocks recursively
 * render their children through this same component.
 */
type BlockRendererProps = {
  blocks: RootBlock[];
};

/**
 * Render a single block with proper type narrowing and recursive handling
 */
function renderBlock(block: RootBlock): React.ReactNode {
  // Container blocks - handle recursively
  if (isContainerBlock(block)) {
    switch (block._type) {
      case "container-block":
        return (
          <ContainerBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );

      case "grid-block":
        return (
          <GridBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );

      case "flex-block":
        return (
          <FlexBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );

      case "stack-block":
        return (
          <StackBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );
    }
  }

  // Content blocks - leaf nodes
  switch (block._type) {
    case "heading-block":
      return <HeadingBlock key={block._key} data={block.data} />;

    case "text-block":
      return <TextBlock key={block._key} data={block.data} />;

    case "rich-text-block":
      return <RichTextBlock key={block._key} data={block.data} />;

    case "image-block":
      return <ImageBlock key={block._key} data={block.data} />;

    case "button-block":
      return <ButtonBlock key={block._key} data={block.data} />;

    case "card-block":
      return <CardBlock key={block._key} data={block.data} />;

    case "video-block":
      return <VideoBlock key={block._key} data={block.data} />;

    case "audio-block":
      return <AudioBlock key={block._key} data={block.data} />;

    case "list-block":
      return <ListBlock key={block._key} data={block.data} />;

    case "quote-block":
      return <QuoteBlock key={block._key} data={block.data} />;

    case "accordion-block":
      return <AccordionBlock key={block._key} data={block.data} />;

    case "tabs-block":
      return <TabsBlock key={block._key} data={block.data} />;

    case "divider-block":
      return <DividerBlock key={block._key} data={block.data} />;

    case "spacer-block":
      return <SpacerBlock key={block._key} data={block.data} />;

    case "embed-block":
      return <EmbedBlock key={block._key} data={block.data} />;

    case "icon-block":
      return <IconBlock key={block._key} data={block.data} />;

    case "stats-block":
      return <StatsBlock key={block._key} data={block.data} />;

    case "map-block":
      return <MapBlock key={block._key} data={block.data} />;

    case "logo-block":
      return <LogoBlock key={block._key} block={block} />;

    // E-Commerce blocks
    case "product-grid-block":
      return <ProductGridBlock key={block._key} data={block.data} />;

    case "product-detail-block":
      return <ProductDetailBlock key={block._key} data={block.data} />;

    case "cart-block":
      return <CartBlock key={block._key} data={block.data} />;

    case "checkout-block":
      return <CheckoutBlock key={block._key} data={block.data} />;

    default:
      // Exhaustive check - TypeScript will error if we miss a block type
      block satisfies never;
      return null;
  }
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return <>{blocks.map(renderBlock)}</>;
}

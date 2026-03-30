import type { RootBlock } from "@/lib/blocks";
import { isContainerBlock } from "@/lib/blocks";
import { allStylesToCSSVars, hasStyles } from "@enterprise/tokens";

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
import { TestimonialBlock } from "@/components/block/testimonial-block";
import { PricingBlock } from "@/components/block/pricing-block";
import { HeroBlock } from "@/components/block/hero-block";
import { CtaBlock } from "@/components/block/cta-block";
import { TeamBlock } from "@/components/block/team-block";
import { LogoBarBlock } from "@/components/block/logo-bar-block";
import { ContactFormBlock } from "@/components/block/contact-form-block";
import { NewsletterBlock } from "@/components/block/newsletter-block";
import { FeatureGridBlock } from "@/components/block/feature-grid-block";
import { SocialLinksBlock } from "@/components/block/social-links-block";
import { FaqBlock } from "@/components/block/faq-block";

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
import { ColumnsBlock } from "@/components/block/columns-block";

/**
 * BlockRenderer - Renders an array of blocks recursively
 *
 * This component takes block data and renders the appropriate
 * block component for each one. Container blocks recursively
 * render their children through this same component.
 */
type BlockRendererProps = {
  blocks: RootBlock[];
  /** Index offset for priority tracking — first image on page gets priority loading */
  blockOffset?: number;
};

/** Track whether we've already assigned priority to the first image on page */
let firstImageClaimed = false;

/** Reset priority tracker — call once at page render start */
export function resetImagePriority() {
  firstImageClaimed = false;
}

/**
 * Wrap block output with CSS custom properties when styles exist
 */
function withStyles(block: RootBlock, content: React.ReactNode): React.ReactNode {
  const blockAny = block as Record<string, unknown>;
  const styles = blockAny.styles as Record<string, string> | undefined;
  const stylesBefore = blockAny.stylesBefore as Record<string, string> | undefined;
  const stylesAfter = blockAny.stylesAfter as Record<string, string> | undefined;
  const styled = hasStyles(styles) || hasStyles(stylesBefore) || hasStyles(stylesAfter);

  if (!styled) return content;

  const cssVars = allStylesToCSSVars(styles, stylesBefore, stylesAfter);
  return (
    <div
      data-styled
      data-has-before={hasStyles(stylesBefore) || undefined}
      data-has-after={hasStyles(stylesAfter) || undefined}
      style={cssVars as React.CSSProperties}
    >
      {content}
    </div>
  );
}

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

      case "columns-block":
        return (
          <ColumnsBlock
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

    case "image-block": {
      const isPriority = !firstImageClaimed;
      if (isPriority) firstImageClaimed = true;
      return (
        <ImageBlock key={block._key} data={block.data} priority={isPriority} />
      );
    }

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
      return <LogoBlock key={block._key} data={block.data} />;

    case "testimonial-block":
      return <TestimonialBlock key={block._key} data={block.data} />;

    case "pricing-block":
      return <PricingBlock key={block._key} data={block.data} />;

    case "hero-block":
      return <HeroBlock key={block._key} data={block.data} />;

    case "cta-block":
      return <CtaBlock key={block._key} data={block.data} />;

    case "team-block":
      return <TeamBlock key={block._key} data={block.data} />;

    case "logo-bar-block":
      return <LogoBarBlock key={block._key} data={block.data} />;

    // Form & content blocks
    case "contact-form-block":
      return <ContactFormBlock key={block._key} data={block.data} />;

    case "newsletter-block":
      return <NewsletterBlock key={block._key} data={block.data} />;

    case "feature-grid-block":
      return <FeatureGridBlock key={block._key} data={block.data} />;

    case "social-links-block":
      return <SocialLinksBlock key={block._key} data={block.data} />;

    case "faq-block":
      return <FaqBlock key={block._key} data={block.data} />;

    // E-Commerce blocks
    case "product-grid-block":
      return <ProductGridBlock key={block._key} data={block.data} />;

    case "product-detail-block":
      return <ProductDetailBlock key={block._key} data={block.data} />;

    case "cart-block":
      return <CartBlock key={block._key} data={block.data} />;

    case "checkout-block":
      return <CheckoutBlock key={block._key} data={block.data} />;

    default: {
      // Development-only warning for unknown block types
      const unknownType = (block as { _type: string })._type;
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[BlockRenderer] Unknown block type: "${unknownType}". This block will not be rendered.`,
        );
        return (
          <div
            key={(block as { _key: string })._key}
            style={{
              padding: "1rem",
              margin: "0.5rem 0",
              border: "2px dashed #f59e0b",
              borderRadius: "0.375rem",
              backgroundColor: "#fffbeb",
              color: "#92400e",
              fontSize: "0.875rem",
              fontFamily: "monospace",
            }}
          >
            Unknown block type: <strong>{unknownType}</strong>
          </div>
        );
      }
      return null;
    }
  }
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return <>{blocks.map((block) => withStyles(block, renderBlock(block)))}</>;
}

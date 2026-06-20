import type { ReactNode } from "react";
import Link from "next/link";

import { HeroCarousel } from "@/components/feature/hero-carousel";
import { WelcomeBanner } from "@/components/feature/welcome-banner";
import { IconCards } from "@/components/feature/icon-cards";
import { Callout } from "@/components/feature/callout";
import { MediaSplit } from "@/components/feature/media-split";
import { StatBand } from "@/components/feature/stat-band";
import { PortraitGrid } from "@/components/feature/portrait-grid";
import { Testimonials } from "@/components/feature/testimonials";
import { FaqSection } from "@/components/feature/faq-section";
import { PageHero } from "@/components/feature/page-hero";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { Heading } from "@/components/feature/heading";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import {
  heroFromBlock,
  welcomeFromBlock,
  iconCardsFromBlock,
  calloutFromBlock,
  mediaSplitFromBlock,
  statBandFromBlock,
  portraitGridFromBlock,
  testimonialsFromBlock,
  faqFromBlock,
  pageHeroFromBlock,
  headingSectionFromBlock,
  type PageHeroAction,
} from "@/lib/cms-blocks";
import type { PageBlock } from "@/lib/cms";

/** Builds the PageHero `actions` slot from CMS action rows. */
function PageHeroActions({ actions }: { actions: PageHeroAction[] }) {
  if (!actions.length) return null;
  return (
    <>
      {actions.map((a, i) =>
        a.kind === "evaluation" ? (
          <EvaluationCTA key={i} variant={a.variant} label={a.label} />
        ) : (
          <Button
            key={i}
            variant={a.variant}
            render={<Link href={a.href ?? "#"} />}
          >
            {a.iconToken ? (
              <Icon token={a.iconToken as never} aria-hidden="true" />
            ) : null}
            <span>{a.label}</span>
            <Icon token="ri:arrow-right" aria-hidden="true" />
          </Button>
        ),
      )}
    </>
  );
}

/**
 * Renders CMS layout blocks in order via a registry — for repeating sections
 * (e.g. multiple media-splits) that block-type lookup can't handle. Each entry
 * maps a block to its bespoke FE feature. Unknown block types are skipped.
 */
const REGISTRY: Record<string, (block: PageBlock, key: string) => ReactNode> = {
  hero: (block, key) => <HeroCarousel key={key} {...heroFromBlock(block)} />,
  pageHero: (block, key) => {
    const { actions, ...rest } = pageHeroFromBlock(block);
    return (
      <PageHero
        key={key}
        {...rest}
        actions={<PageHeroActions actions={actions} />}
      />
    );
  },
  headingSection: (block, key) => {
    const h = headingSectionFromBlock(block);
    return (
      <Section key={key} bg={h.background} size={h.size}>
        <Heading
          eyebrow={h.eyebrow}
          heading={h.heading}
          headingSize={h.headingSize}
          align={h.align}
          description={
            h.paragraphs.length ? (
              <>
                {h.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </>
            ) : undefined
          }
        />
        {h.cta ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant={h.cta.variant} render={<Link href={h.cta.href} />}>
              {h.cta.iconToken ? (
                <Icon token={h.cta.iconToken as never} aria-hidden="true" />
              ) : null}
              <span>{h.cta.label}</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </Section>
    );
  },
  welcomeBanner: (block, key) => (
    <WelcomeBanner key={key} {...welcomeFromBlock(block)} />
  ),
  iconCards: (block, key) => (
    <IconCards key={key} {...iconCardsFromBlock(block)} />
  ),
  callout: (block, key) => <Callout key={key} {...calloutFromBlock(block)} />,
  mediaSplit: (block, key) => (
    <MediaSplit key={key} {...mediaSplitFromBlock(block)} />
  ),
  statBand: (block, key) => (
    <StatBand key={key} {...statBandFromBlock(block)} />
  ),
  portraitGrid: (block, key) => (
    <PortraitGrid key={key} {...portraitGridFromBlock(block)} />
  ),
  testimonialsSection: (block, key) => (
    <Testimonials key={key} {...testimonialsFromBlock(block)} />
  ),
  faqSection: (block, key) => <FaqSection key={key} {...faqFromBlock(block)} />,
};

export function Blocks({
  layout,
  only,
}: {
  layout?: PageBlock[] | null;
  only?: string[];
}) {
  const blocks = (layout ?? []).filter(
    (b) =>
      b.blockType &&
      REGISTRY[b.blockType] &&
      (!only || only.includes(b.blockType)),
  );
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) =>
        REGISTRY[b.blockType as string](b, b.id ?? `${b.blockType}-${i}`),
      )}
    </>
  );
}

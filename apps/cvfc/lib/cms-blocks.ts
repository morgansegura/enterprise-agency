import type { HeroSlide } from "@/components/feature/hero-carousel";
import type { FaqEntry } from "@/data/faq";
import {
  blockOf,
  mediaAlt,
  mediaUrl,
  type MediaValue,
  type Page,
} from "@/lib/cms";

/**
 * Maps CMS layout blocks → the props each bespoke FE feature expects. Every
 * mapper returns `undefined` (or empty) when the CMS has no real content, so
 * the screen falls back to the feature's built-in static defaults — the site
 * never breaks while content is being migrated into the CMS, section by section.
 */

type RawCta = { kind?: string; label?: string; href?: string };
type RawSlide = {
  id?: string;
  image?: MediaValue;
  alt?: string;
  eyebrow?: string;
  heading?: string;
  tagline?: string;
  cta?: RawCta;
};

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;

/**
 * The CMS `hero` block's slides → HeroCarousel slides. Returns `undefined` when
 * there are no slides with both an image and a heading, so the carousel keeps
 * its built-in defaults.
 */
export function heroSlidesFromPage(page: Page | null): HeroSlide[] | undefined {
  const raw = blockOf(page, "hero")?.slides;
  if (!Array.isArray(raw)) return undefined;

  const slides = (raw as RawSlide[])
    .map((s, i): HeroSlide => {
      const cta = s.cta;
      return {
        id: str(s.id) ?? `cms-hero-${i}`,
        image: {
          src: mediaUrl(s.image) ?? "",
          alt: str(s.alt) ?? mediaAlt(s.image) ?? "",
        },
        eyebrow: str(s.eyebrow),
        heading: str(s.heading) ?? "",
        tagline: str(s.tagline),
        cta:
          cta?.kind === "link" && str(cta.label) && str(cta.href)
            ? { kind: "link", label: cta.label!, href: cta.href! }
            : cta?.kind === "evaluation" && str(cta.label)
              ? { kind: "evaluation", label: cta.label! }
              : undefined,
      };
    })
    .filter((s) => s.image.src && s.heading);

  return slides.length ? slides : undefined;
}

export type WelcomeBannerOverrides = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: { src: string; alt: string };
};

/**
 * The CMS `welcomeBanner` block → WelcomeBanner prop overrides. Returns
 * `undefined` when the block is absent; individual empty fields fall through to
 * the feature's own defaults.
 */
export function welcomeBannerFromPage(
  page: Page | null,
): WelcomeBannerOverrides | undefined {
  const b = blockOf(page, "welcomeBanner");
  if (!b) return undefined;
  const src = mediaUrl(b.image as MediaValue);
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading),
    body: str(b.body),
    image: src
      ? { src, alt: mediaAlt(b.image as MediaValue) ?? str(b.heading) ?? "" }
      : undefined,
  };
}

export type FaqSectionOverrides = {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  entries?: FaqEntry[];
};

type RawFaq = {
  id?: string;
  category?: string;
  question?: string;
  answer?: string;
};

/**
 * The CMS `faqSection` block → FaqSection prop overrides. Empty entries fall
 * through to the feature's built-in FAQ defaults.
 */
export function faqSectionFromPage(
  page: Page | null,
): FaqSectionOverrides | undefined {
  const b = blockOf(page, "faqSection");
  if (!b) return undefined;
  const raw = Array.isArray(b.entries) ? (b.entries as RawFaq[]) : [];
  const entries = raw
    .map(
      (e, i): FaqEntry => ({
        id: str(e.id) ?? `cms-faq-${i}`,
        category: (str(e.category) ?? "About the Club") as FaqEntry["category"],
        question: str(e.question) ?? "",
        answer: str(e.answer) ?? "",
      }),
    )
    .filter((e) => e.question && e.answer);
  return {
    heading: str(b.heading),
    description: str(b.description),
    ctaLabel: str(b.ctaLabel),
    ctaHref: str(b.ctaHref),
    entries: entries.length ? entries : undefined,
  };
}

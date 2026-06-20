import type { HeroSlide } from "@/components/feature/hero-carousel";
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

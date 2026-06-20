import type { HeroSlide } from "@/components/feature/hero-carousel";
import type { Testimonial } from "@/components/feature/testimonials";
import type { FaqEntry } from "@/data/faq";
import {
  blockOf,
  mediaAlt,
  mediaUrl,
  type MediaValue,
  type Page,
  type PageBlock,
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

export type TestimonialsOverrides = {
  heading?: string;
  description?: string;
  testimonials?: Testimonial[];
};

type RawTestimonial = {
  id?: string;
  quote?: string;
  author?: string;
  role?: string;
  image?: MediaValue;
};

/**
 * The CMS `testimonialsSection` block → Testimonials prop overrides. Empty list
 * falls through to the feature's built-in defaults.
 */
export function testimonialsFromPage(
  page: Page | null,
): TestimonialsOverrides | undefined {
  const b = blockOf(page, "testimonialsSection");
  if (!b) return undefined;
  const raw = Array.isArray(b.testimonials)
    ? (b.testimonials as RawTestimonial[])
    : [];
  const testimonials = raw
    .map((t, i): Testimonial => {
      const src = mediaUrl(t.image);
      return {
        id: str(t.id) ?? `cms-testimonial-${i}`,
        quote: str(t.quote) ?? "",
        author: str(t.author) ?? "",
        role: str(t.role),
        image: src
          ? { src, alt: mediaAlt(t.image) ?? str(t.author) ?? "" }
          : undefined,
      };
    })
    .filter((t) => t.quote && t.author);
  return {
    heading: str(b.heading),
    description: str(b.description),
    testimonials: testimonials.length ? testimonials : undefined,
  };
}

type RawMediaButton = {
  label?: string;
  href?: string;
  variant?: string;
  iconToken?: string;
};

/** A single CMS `mediaSplit` block → MediaSplit props (used by the renderer). */
export function mediaSplitFromBlock(b: PageBlock) {
  const src = mediaUrl(b.image as MediaValue) ?? str(b.imageUrl);
  const tags = Array.isArray(b.tags)
    ? (b.tags as { label?: string }[])
        .map((t) => str(t.label))
        .filter((t): t is string => Boolean(t))
    : [];
  const buttons = Array.isArray(b.buttons)
    ? (b.buttons as RawMediaButton[])
        .map((bt) => ({
          label: str(bt.label) ?? "",
          href: str(bt.href) ?? "#",
          variant: (str(bt.variant) ?? "secondary") as
            | "default"
            | "secondary"
            | "outline",
          iconToken: str(bt.iconToken),
        }))
        .filter((bt) => bt.label)
    : [];
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading) ?? "",
    body: str(b.body) ?? "",
    image: {
      src: src ?? "",
      alt: str(b.imageAlt) ?? mediaAlt(b.image as MediaValue) ?? "",
    },
    tags: tags.length ? tags : undefined,
    background: str(b.background) === "white" ? ("white" as const) : undefined,
    reverse: Boolean(b.reverse),
    buttons: buttons.length ? buttons : undefined,
  };
}

type RawGroupCta = {
  label?: string;
  href?: string;
  variant?: string;
  iconToken?: string;
};

function ctaFromGroup(raw: unknown) {
  const c = raw as RawGroupCta | undefined;
  const label = str(c?.label);
  const href = str(c?.href);
  if (!label || !href) return undefined;
  return {
    label,
    href,
    variant: (str(c?.variant) ?? "secondary") as
      | "default"
      | "secondary"
      | "outline",
    iconToken: str(c?.iconToken),
  };
}

/** A single CMS `iconCards` block → IconCards props (used by the renderer). */
export function iconCardsFromBlock(b: PageBlock) {
  const cards = Array.isArray(b.cards)
    ? (
        b.cards as {
          id?: string;
          iconToken?: string;
          title?: string;
          description?: string;
          href?: string;
        }[]
      )
        .map((c, i) => ({
          id: str(c.id) ?? String(i),
          iconToken: str(c.iconToken),
          title: str(c.title) ?? "",
          description: str(c.description) ?? "",
          href: str(c.href),
        }))
        .filter((c) => c.title)
    : [];
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading) ?? "",
    description: str(b.description),
    background: str(b.background) === "white" ? ("white" as const) : undefined,
    cards: cards.length ? cards : undefined,
    cta: ctaFromGroup(b.cta),
  };
}

/** A single CMS `callout` block → Callout props (used by the renderer). */
export function calloutFromBlock(b: PageBlock) {
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading) ?? "",
    body: str(b.body) ?? "",
    variant: str(b.variant) as
      | "midnight"
      | "bone"
      | "gold"
      | "midnight-bright"
      | undefined,
    cta: ctaFromGroup(b.cta),
  };
}

export type PageHeroAction = {
  kind: "link" | "evaluation";
  label: string;
  href?: string;
  variant: "default" | "secondary" | "outline";
  iconToken?: string;
};

type RawHeroAction = {
  kind?: string;
  label?: string;
  href?: string;
  variant?: string;
  iconToken?: string;
};

/** A single CMS `pageHero` block → PageHero props (used by the renderer). */
export function pageHeroFromBlock(b: PageBlock) {
  const actions = (
    Array.isArray(b.actions) ? (b.actions as RawHeroAction[]) : []
  )
    .map(
      (a): PageHeroAction => ({
        kind: a.kind === "evaluation" ? "evaluation" : "link",
        label: str(a.label) ?? "",
        href: str(a.href),
        variant: (str(a.variant) ?? "default") as PageHeroAction["variant"],
        iconToken: str(a.iconToken),
      }),
    )
    .filter((a) => a.label && (a.kind === "evaluation" || a.href));
  return {
    eyebrow: str(b.eyebrow) ?? "",
    heading: str(b.heading) ?? "",
    description: str(b.description),
    background:
      str(b.background) === "bone" ? ("bone" as const) : ("white" as const),
    actions,
  };
}

export type HeadingSectionData = {
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  background: "bone" | "white" | "transparent" | "midnight";
  size: "compact" | "default" | "loose";
  headingSize: "display" | "section" | "compact";
  align: "center" | "left";
  cta?: {
    label: string;
    href: string;
    variant: "default" | "secondary" | "outline";
    iconToken?: string;
  };
};

const oneOf = <T extends string>(v: unknown, allowed: T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/** A single CMS `headingSection` block → Section+Heading props (renderer). */
export function headingSectionFromBlock(b: PageBlock): HeadingSectionData {
  const paragraphs = (str(b.body) ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading) ?? "",
    paragraphs,
    background: oneOf(
      b.background,
      ["bone", "white", "transparent", "midnight"],
      "bone",
    ),
    size: oneOf(b.size, ["compact", "default", "loose"], "default"),
    headingSize: oneOf(
      b.headingSize,
      ["display", "section", "compact"],
      "section",
    ),
    align: str(b.align) === "left" ? "left" : "center",
    cta: ctaFromGroup(b.cta),
  };
}

// --- block-based mappers for the full-page renderer (single-instance sections) ---

export function heroFromBlock(b: PageBlock) {
  const raw = Array.isArray(b.slides) ? (b.slides as RawSlide[]) : [];
  const slides = raw
    .map((s, i): HeroSlide => {
      const kind = s.cta?.kind;
      const label = str(s.cta?.label);
      const href = str(s.cta?.href);
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
          kind === "link" && label && href
            ? { kind: "link", label, href }
            : kind === "evaluation" && label
              ? { kind: "evaluation", label }
              : undefined,
      };
    })
    .filter((s) => s.image.src && s.heading);
  return { slides: slides.length ? slides : undefined };
}

export function welcomeFromBlock(b: PageBlock) {
  const src = mediaUrl(b.image as MediaValue) ?? str(b.imageUrl);
  return {
    headingAs: "h2" as const,
    eyebrow: str(b.eyebrow),
    heading: str(b.heading),
    body: str(b.body),
    image: src
      ? { src, alt: mediaAlt(b.image as MediaValue) ?? str(b.heading) ?? "" }
      : undefined,
  };
}

export function faqFromBlock(b: PageBlock) {
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

export function testimonialsFromBlock(b: PageBlock) {
  const raw = Array.isArray(b.testimonials)
    ? (b.testimonials as RawTestimonial[])
    : [];
  const items = raw
    .map((t, i): Testimonial => {
      const src = mediaUrl(t.image);
      return {
        id: str(t.id) ?? `cms-t-${i}`,
        quote: str(t.quote) ?? "",
        author: str(t.author) ?? "",
        role: str(t.role),
        image: src
          ? { src, alt: mediaAlt(t.image) ?? str(t.author) ?? "" }
          : undefined,
      };
    })
    .filter((t) => t.quote && t.author);
  return {
    heading: str(b.heading),
    description: str(b.description),
    testimonials: items.length ? items : undefined,
  };
}

export function statBandFromBlock(b: PageBlock) {
  const stats = (
    Array.isArray(b.stats)
      ? (b.stats as { value?: string; label?: string }[])
      : []
  ).map((s, i) => ({
    id: String(i),
    value: str(s.value) ?? "",
    label: str(s.label) ?? "",
  }));
  const highlights = (
    Array.isArray(b.highlights)
      ? (b.highlights as { tag?: string; title?: string; body?: string }[])
      : []
  ).map((h, i) => ({
    id: String(i),
    tag: str(h.tag) ?? "",
    title: str(h.title) ?? "",
    body: str(h.body),
  }));
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading),
    description: str(b.description),
    variant: str(b.variant) === "bone" ? ("bone" as const) : undefined,
    stats,
    highlights: highlights.length ? highlights : undefined,
    footnote: str(b.footnote),
  };
}

export function portraitGridFromBlock(b: PageBlock) {
  const people = (
    Array.isArray(b.people)
      ? (b.people as {
          name?: string;
          role?: string;
          credential?: string;
          image?: MediaValue;
          imageUrl?: string;
        }[])
      : []
  )
    .map((p, i) => {
      const src = mediaUrl(p.image) ?? str(p.imageUrl);
      return {
        id: String(i),
        name: str(p.name) ?? "",
        role: str(p.role) ?? "",
        credential: str(p.credential),
        image: src ? { src, alt: str(p.name) ?? "" } : undefined,
      };
    })
    .filter((p) => p.name);
  return {
    eyebrow: str(b.eyebrow),
    heading: str(b.heading) ?? "",
    description: str(b.description),
    background: str(b.background) === "white" ? ("white" as const) : undefined,
    people,
    cta: ctaFromGroup(b.cta),
  };
}

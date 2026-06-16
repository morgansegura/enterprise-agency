import {
  HeroCarousel,
  type HeroSlide,
} from "@/components/feature/hero-carousel";
import {
  getPage,
  blockOf,
  mediaUrl,
  mediaAlt,
  type MediaValue,
  type PageBlock,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

import "./landing-screen.css";

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;

/** Map the CMS `hero` block into the FE carousel's slide shape. */
function toHeroSlides(hero: PageBlock | null): HeroSlide[] | undefined {
  const rows = hero?.slides;
  if (!Array.isArray(rows) || rows.length === 0) return undefined;

  const slides = rows.flatMap((row, i): HeroSlide[] => {
    const r = row as Record<string, unknown>;
    const image = mediaUrl(r.image as MediaValue);
    const heading = str(r.heading);
    if (!image || !heading) return []; // required fields missing → skip row

    const cta = r.cta as Record<string, unknown> | undefined;
    const kind = str(cta?.kind);
    const label = str(cta?.label);
    const href = str(cta?.href);
    let slideCta: HeroSlide["cta"];
    if (kind === "evaluation" && label)
      slideCta = { kind: "evaluation", label };
    else if (kind === "link" && label && href)
      slideCta = { kind: "link", label, href };

    return [
      {
        id: str(r.id) ?? `slide-${i}`,
        image: {
          src: image,
          alt: str(r.alt) ?? mediaAlt(r.image as MediaValue) ?? heading,
        },
        eyebrow: str(r.eyebrow),
        heading,
        tagline: str(r.tagline),
        cta: slideCta,
      },
    ];
  });

  return slides.length > 0 ? slides : undefined;
}

export async function LandingScreen({ className }: { className?: string }) {
  // Pull the home page's hero from the CMS (tenant-scoped). Falls back to the
  // carousel's built-in slides if the CMS is offline or the hero is empty.
  const page = await getPage("home");
  const hero = blockOf(page, "hero");
  const slides = toHeroSlides(hero);
  const autoPlayDelay =
    typeof hero?.autoPlayDelay === "number" ? hero.autoPlayDelay : undefined;

  return (
    <main className={cn("landing-screen", className)}>
      <HeroCarousel slides={slides} autoPlayDelay={autoPlayDelay} />
      {/* Next sections (welcome-banner, icon-cards, …) get added one at a time. */}
    </main>
  );
}

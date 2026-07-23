import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { IconCards } from "@/components/feature/icon-cards";
import { PageHero } from "@/components/feature/page-hero";
import { AREAS } from "@/data/areas";

/** Areas hub — directory of the communities CVFC trains in. Each card links to
 *  that community's area page. */
export function AreasScreen() {
  const cards = AREAS.map((a) => ({
    id: a.slug,
    iconToken: a.iconToken,
    title: a.name,
    description: a.blurb,
    href: `/areas/${a.slug}`,
  }));

  return (
    <main>
      <PageHero
        eyebrow="Where we play"
        heading="Youth soccer across the South Bay."
        description="Chula Vista FC trains and competes across the South Bay. Find your community and see the CVFC pathway close to home."
        actions={
          <EvaluationCTA variant="default" label="Request an Evaluation" />
        }
      />
      <IconCards
        eyebrow="Our communities"
        heading="Find youth soccer near you."
        cards={cards}
        background="bone"
      />
    </main>
  );
}

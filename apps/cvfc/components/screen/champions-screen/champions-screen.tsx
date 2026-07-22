import { Blocks } from "@/components/blocks";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";
import { PageHero } from "@/components/feature/page-hero";
import { PortraitGrid } from "@/components/feature/portrait-grid";
import { CHAMPIONSHIPS, SIGNINGS } from "@/data/champions";
import { getPage } from "@/lib/cms";

/** Champions — Championships + Signings, both in the portrait-grid card module.
 *  Mock-first: renders the CMS page layout when present, else the fallback. */
export async function ChampionsScreen() {
  const page = await getPage("champions");

  return (
    <main>
      {page?.layout?.length ? (
        <Blocks page={page} />
      ) : (
        <>
          <PageHero
            eyebrow="Champions"
            heading="Titles won, and players moving up."
            description="Four decades of championships across the CVFC pathway — and the players who go on to college programs and professional academies."
            actions={
              <EvaluationCTA variant="default" label="Request an Evaluation" />
            }
          />

          <PortraitGrid
            eyebrow="On the Field"
            heading="Championships"
            description="State cups, national cups, and national finals across every age group."
            people={CHAMPIONSHIPS}
            background="bone"
          />

          <PortraitGrid
            eyebrow="The Next Level"
            heading="Signings & Commitments"
            description="Players who have earned their next opportunity with a college program or professional academy."
            people={SIGNINGS}
            background="white"
          />
        </>
      )}
    </main>
  );
}

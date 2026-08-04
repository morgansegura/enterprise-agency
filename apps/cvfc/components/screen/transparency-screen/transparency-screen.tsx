import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { TRANSPARENCY } from "@/data/legal/transparency";

export async function TransparencyScreen() {
  const page = await getPage("transparency");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || TRANSPARENCY.title}
      lastUpdated={TRANSPARENCY.lastUpdated}
      intro={TRANSPARENCY.intro}
      sections={legalSectionsFromPage(page) ?? TRANSPARENCY.sections}
    />
  );
}

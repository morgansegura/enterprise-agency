import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { SAFEGUARDING } from "@/data/legal/safeguarding";

export async function SafeguardingScreen() {
  const page = await getPage("safeguarding");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || SAFEGUARDING.title}
      lastUpdated={SAFEGUARDING.lastUpdated}
      intro={SAFEGUARDING.intro}
      sections={legalSectionsFromPage(page) ?? SAFEGUARDING.sections}
    />
  );
}

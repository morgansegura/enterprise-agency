import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { TERMS_OF_SERVICE } from "@/data/legal/terms-of-service";

export async function TermsOfServiceScreen() {
  const page = await getPage("terms-of-service");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || TERMS_OF_SERVICE.title}
      lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      intro={TERMS_OF_SERVICE.intro}
      sections={legalSectionsFromPage(page) ?? TERMS_OF_SERVICE.sections}
    />
  );
}

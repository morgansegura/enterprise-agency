import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { TERMS_OF_SERVICE } from "@/data/legal/terms-of-service";

export async function TermsOfServiceScreen() {
  const hero = pageHeroFromPage(await getPage("terms-of-service"));
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || TERMS_OF_SERVICE.title}
      lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      intro={TERMS_OF_SERVICE.intro}
      sections={TERMS_OF_SERVICE.sections}
    />
  );
}

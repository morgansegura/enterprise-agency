import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { DONOR_PRIVACY } from "@/data/legal/donor-privacy";

export async function DonorPrivacyScreen() {
  const page = await getPage("donor-privacy");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || DONOR_PRIVACY.title}
      lastUpdated={DONOR_PRIVACY.lastUpdated}
      intro={DONOR_PRIVACY.intro}
      sections={legalSectionsFromPage(page) ?? DONOR_PRIVACY.sections}
    />
  );
}

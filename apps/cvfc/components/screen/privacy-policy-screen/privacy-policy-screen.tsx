import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { PRIVACY_POLICY } from "@/data/legal/privacy-policy";

export async function PrivacyPolicyScreen() {
  const page = await getPage("privacy-policy");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || PRIVACY_POLICY.title}
      lastUpdated={PRIVACY_POLICY.lastUpdated}
      intro={PRIVACY_POLICY.intro}
      sections={legalSectionsFromPage(page) ?? PRIVACY_POLICY.sections}
    />
  );
}

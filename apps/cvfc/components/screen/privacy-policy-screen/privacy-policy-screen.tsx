import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { PRIVACY_POLICY } from "@/data/legal/privacy-policy";

export async function PrivacyPolicyScreen() {
  const hero = pageHeroFromPage(await getPage("privacy-policy"));
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || PRIVACY_POLICY.title}
      lastUpdated={PRIVACY_POLICY.lastUpdated}
      intro={PRIVACY_POLICY.intro}
      sections={PRIVACY_POLICY.sections}
    />
  );
}

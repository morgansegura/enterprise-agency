import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { LINK_POLICY } from "@/data/legal/link-policy";

export async function LinkPolicyScreen() {
  const hero = pageHeroFromPage(await getPage("link-policy"));
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || LINK_POLICY.title}
      lastUpdated={LINK_POLICY.lastUpdated}
      intro={LINK_POLICY.intro}
      sections={LINK_POLICY.sections}
    />
  );
}

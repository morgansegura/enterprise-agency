import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { COOKIE_POLICY } from "@/data/legal/cookie-policy";

export async function CookiePolicyScreen() {
  const hero = pageHeroFromPage(await getPage("cookie-policy"));
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || COOKIE_POLICY.title}
      lastUpdated={COOKIE_POLICY.lastUpdated}
      intro={COOKIE_POLICY.intro}
      sections={COOKIE_POLICY.sections}
    />
  );
}

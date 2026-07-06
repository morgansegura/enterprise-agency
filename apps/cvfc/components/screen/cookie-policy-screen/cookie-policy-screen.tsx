import { LegalLayout } from "@/components/feature/legal-layout";
import { getPage } from "@/lib/cms";
import { pageHeroFromPage } from "@/lib/cms-blocks";
import { legalSectionsFromPage } from "@/lib/legal";
import { COOKIE_POLICY } from "@/data/legal/cookie-policy";

export async function CookiePolicyScreen() {
  const page = await getPage("cookie-policy");
  const hero = pageHeroFromPage(page);
  return (
    <LegalLayout
      eyebrow={hero?.eyebrow || "Legal"}
      title={hero?.heading || COOKIE_POLICY.title}
      lastUpdated={COOKIE_POLICY.lastUpdated}
      intro={COOKIE_POLICY.intro}
      sections={legalSectionsFromPage(page) ?? COOKIE_POLICY.sections}
    />
  );
}

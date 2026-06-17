import { LegalLayout } from "@/components/feature/legal-layout";
import { COOKIE_POLICY } from "@/data/legal/cookie-policy";

export function CookiePolicyScreen() {
  return (
    <LegalLayout
      title={COOKIE_POLICY.title}
      lastUpdated={COOKIE_POLICY.lastUpdated}
      intro={COOKIE_POLICY.intro}
      sections={COOKIE_POLICY.sections}
    />
  );
}

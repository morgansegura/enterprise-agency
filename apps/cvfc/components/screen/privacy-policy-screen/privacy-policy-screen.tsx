import { LegalLayout } from "@/components/feature/legal-layout";
import { PRIVACY_POLICY } from "@/data/legal/privacy-policy";

export function PrivacyPolicyScreen() {
  return (
    <LegalLayout
      title={PRIVACY_POLICY.title}
      lastUpdated={PRIVACY_POLICY.lastUpdated}
      intro={PRIVACY_POLICY.intro}
      sections={PRIVACY_POLICY.sections}
    />
  );
}

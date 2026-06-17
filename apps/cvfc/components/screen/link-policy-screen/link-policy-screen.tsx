import { LegalLayout } from "@/components/feature/legal-layout";
import { LINK_POLICY } from "@/data/legal/link-policy";

export function LinkPolicyScreen() {
  return (
    <LegalLayout
      title={LINK_POLICY.title}
      lastUpdated={LINK_POLICY.lastUpdated}
      intro={LINK_POLICY.intro}
      sections={LINK_POLICY.sections}
    />
  );
}

import { LegalLayout } from "@/components/feature/legal-layout";
import { TERMS_OF_SERVICE } from "@/data/legal/terms-of-service";

export function TermsOfServiceScreen() {
  return (
    <LegalLayout
      title={TERMS_OF_SERVICE.title}
      lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      intro={TERMS_OF_SERVICE.intro}
      sections={TERMS_OF_SERVICE.sections}
    />
  );
}

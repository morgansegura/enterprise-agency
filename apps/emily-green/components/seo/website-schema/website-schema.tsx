import { absoluteUrl } from "@/lib/seo";
import { site } from "@/site.config";

import { JsonLd } from "../json-ld";

/** WebSite node — ties the domain to the brand entity for the knowledge graph. */
export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: site.name,
        url: site.url,
        description: site.description,
        publisher: { "@id": absoluteUrl("/#business") },
        inLanguage: "en-US",
      }}
    />
  );
}

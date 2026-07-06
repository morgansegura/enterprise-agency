import { writeFileSync } from "node:fs";
import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";

import { PRIVACY_POLICY } from "@/data/legal/privacy-policy";
import { TERMS_OF_SERVICE } from "@/data/legal/terms-of-service";
import { COOKIE_POLICY } from "@/data/legal/cookie-policy";
import { LINK_POLICY } from "@/data/legal/link-policy";

// Render the hand-authored legal JSX → HTML strings so the CMS seed can convert
// them to rich text (htmlToLexical). Single-source: the same content that backs
// the FE fallback seeds the editable CMS blocks — no hand transcription.
const pages = {
  "privacy-policy": PRIVACY_POLICY,
  "terms-of-service": TERMS_OF_SERVICE,
  "cookie-policy": COOKIE_POLICY,
  "link-policy": LINK_POLICY,
} as const;

const out: Record<
  string,
  Array<{ id: string; heading: string; html: string }>
> = {};

for (const [slug, data] of Object.entries(pages)) {
  out[slug] = data.sections.map((s) => ({
    id: s.id,
    heading: s.heading,
    html: renderToStaticMarkup(s.body as React.ReactElement),
  }));
}

const dest = path.resolve(
  import.meta.dirname,
  "../../cms/src/seed/legal-content.json",
);
writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`Wrote ${dest} (${Object.keys(out).length} legal pages)`);

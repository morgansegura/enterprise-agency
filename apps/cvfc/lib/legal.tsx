import type { Page } from "@/lib/cms";
import type { LegalSection } from "@/components/feature/legal-layout";
import { lexicalToHtml } from "@/lib/lexical-to-html";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * CMS `legalSection` blocks → LegalLayout `sections`. Each block's rich-text
 * body renders through the shared prose styles (same as blog posts). Returns
 * `undefined` when there are no blocks, so the screen falls back to the
 * hard-coded legal copy.
 */
export function legalSectionsFromPage(
  page: Page | null,
): LegalSection[] | undefined {
  const blocks =
    page?.layout?.filter((b) => b.blockType === "legalSection") ?? [];
  if (!blocks.length) return undefined;
  const sections = blocks
    .map((b): LegalSection | null => {
      const heading = typeof b.heading === "string" ? b.heading : "";
      const html = lexicalToHtml((b as { content?: unknown }).content);
      if (!heading || !html) return null;
      return {
        id: slugify(heading),
        heading,
        body: (
          <div
            className="prose-cvfc"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ),
      };
    })
    .filter((s): s is LegalSection => s !== null);
  return sections.length ? sections : undefined;
}

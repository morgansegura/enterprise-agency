/**
 * Minimal Lexical (Payload richText) → HTML serializer for rendering CMS post
 * bodies through the existing `prose` markup. Covers the node types the editor
 * produces: headings, paragraphs, lists, quotes, rules, uploads, and
 * bold/italic/link inline. Unknown nodes are skipped. For full fidelity later,
 * swap to `@payloadcms/richtext-lexical/react`'s RichText.
 *
 * Anything not handled here is dropped silently, which is how images went
 * missing: the editor inserted `upload` nodes, this had no case for them, and
 * `default: return ""` swallowed each one. A node type added in the admin has
 * to be added here too, or it simply will not appear on the site.
 */

import { mediaAlt, mediaUrl, type MediaValue } from "@/lib/media";

type LexNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number;
  listType?: string;
  url?: string;
  fields?: { url?: string; caption?: string };
  /** `upload` nodes: the media doc when populated, its id when not. */
  value?: MediaValue;
  relationTo?: string;
  children?: LexNode[];
};

function esc(s: string): string {
  return (
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Attributes are quoted below, so a quote in alt text would otherwise end
      // the attribute and inject markup.
      .replace(/"/g, "&quot;")
  );
}

function inline(children?: LexNode[]): string {
  if (!Array.isArray(children)) return "";
  return children
    .map((n) => {
      if (n.type === "linebreak") return "<br/>";
      if (n.type === "link") {
        const url = n.fields?.url ?? n.url ?? "#";
        return `<a href="${esc(url)}">${inline(n.children)}</a>`;
      }
      if (typeof n.text !== "string") return inline(n.children);
      let t = esc(n.text);
      const f = n.format ?? 0;
      if (f & 1) t = `<strong>${t}</strong>`;
      if (f & 2) t = `<em>${t}</em>`;
      return t;
    })
    .join("");
}

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** Serialize a Lexical editor state object to an HTML string. */
export function lexicalToHtml(data: unknown): string {
  const root = (data as { root?: LexNode } | null)?.root;
  if (!root || !Array.isArray(root.children)) return "";
  return root.children
    .map((node) => {
      switch (node.type) {
        case "heading": {
          const tag = node.tag && HEADINGS.has(node.tag) ? node.tag : "h2";
          return `<${tag}>${inline(node.children)}</${tag}>`;
        }
        case "paragraph": {
          const inner = inline(node.children);
          return inner ? `<p>${inner}</p>` : "";
        }
        case "quote":
          return `<blockquote>${inline(node.children)}</blockquote>`;
        case "horizontalrule":
          return "<hr/>";
        case "upload": {
          // Populated by Payload at depth >= 1. When the relation has not been
          // populated `value` is an id, and there is no URL to render — so the
          // node is skipped rather than emitting a broken image.
          const src = mediaUrl(node.value);
          if (!src) return "";

          const alt = mediaAlt(node.value) ?? "";
          const caption = node.fields?.caption;
          const img = `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"/>`;

          return caption
            ? `<figure>${img}<figcaption>${esc(caption)}</figcaption></figure>`
            : `<figure>${img}</figure>`;
        }
        case "list": {
          const tag =
            node.tag === "ol" || node.listType === "number" ? "ol" : "ul";
          const items = (node.children ?? [])
            .filter((c) => c.type === "listitem")
            .map((li) => `<li>${inline(li.children)}</li>`)
            .join("");
          return items ? `<${tag}>${items}</${tag}>` : "";
        }
        default:
          return "";
      }
    })
    .join("");
}

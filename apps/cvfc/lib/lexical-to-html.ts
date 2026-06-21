/**
 * Minimal Lexical (Payload richText) → HTML serializer for rendering CMS post
 * bodies through the existing `prose` markup. Covers the node types the news
 * migration produces (headings, paragraphs, lists, bold/italic/link). Unknown
 * nodes are skipped. For full fidelity later, swap to
 * `@payloadcms/richtext-lexical/react`'s RichText.
 */

type LexNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number;
  listType?: string;
  url?: string;
  fields?: { url?: string };
  children?: LexNode[];
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

import type { TextBlockData } from "@/lib/blocks";
import Link from "next/link";

type TextBlockProps = {
  data: TextBlockData;
};

/**
 * Check if a URL is external
 */
function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/**
 * Markdown link pattern: [text](url)
 */
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Parse text with markdown-style links into React nodes.
 */
function parseMarkdownLinks(text: string): React.ReactNode {
  if (!MARKDOWN_LINK_RE.test(text)) return text;
  MARKDOWN_LINK_RE.lastIndex = 0;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = MARKDOWN_LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const linkText = match[1];
    const url = match[2];

    if (isExternalUrl(url)) {
      nodes.push(
        <a key={`link-${keyIndex++}`} href={url} target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>,
      );
    } else {
      nodes.push(
        <Link key={`link-${keyIndex++}`} href={url}>
          {linkText}
        </Link>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/**
 * TextBlock — clean output, no data-attributes, no prose.
 * All styling comes from generated CSS via .e-{key} wrapper.
 */
export function TextBlock({ data }: TextBlockProps) {
  const hasHtml = Boolean(data.html);
  const plainContent = data.text ?? data.content ?? "";

  if (hasHtml) {
    return (
      <div
        className="text"
        data-slot="text-block"
        dangerouslySetInnerHTML={{ __html: data.html! }}
      />
    );
  }

  return (
    <p className="text" data-slot="text-block">
      {parseMarkdownLinks(plainContent)}
    </p>
  );
}

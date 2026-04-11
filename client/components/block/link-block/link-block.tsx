import type { RootBlock } from "@/lib/blocks";
import { BlockRenderer } from "@/components/block-renderer/block-renderer";

interface LinkBlockData {
  href?: string;
  target?: string;
  blocks?: RootBlock[];
}

interface LinkBlockProps {
  data: LinkBlockData;
}

/**
 * LinkBlock — wraps child blocks in a clickable link.
 * Renders as a semantic <a> tag on the frontend.
 */
export function LinkBlock({ data }: LinkBlockProps) {
  const { href = "#", target = "_self", blocks } = data;

  return (
    <a
      data-slot="link-block"
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {blocks && blocks.length > 0 && <BlockRenderer blocks={blocks} />}
    </a>
  );
}

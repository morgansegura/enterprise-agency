import type { HeadingBlockData } from "@/lib/blocks";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

/**
 * HeadingBlock — clean output, no data-attributes.
 * All styling comes from generated CSS via .e-{key} wrapper.
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const { text, level = "h2" } = data;
  const Tag = level;
  const html = (data as { html?: string }).html;

  if (html) {
    return (
      <Tag
        className="heading"
        data-slot="heading-block"
        dangerouslySetInnerHTML={{ __html: html.replace(/<\/?p>/g, "") }}
      />
    );
  }

  return (
    <Tag className="heading" data-slot="heading-block">
      {text}
    </Tag>
  );
}

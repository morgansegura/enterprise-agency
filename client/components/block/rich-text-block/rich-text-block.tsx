import type { RichTextBlockData } from "@/lib/blocks";

type RichTextBlockProps = {
  data: RichTextBlockData;
};

/**
 * RichTextBlock — clean HTML output.
 * All styling from generated CSS via .e-{key} wrapper.
 */
export function RichTextBlock({ data }: RichTextBlockProps) {
  return (
    <div
      className="rich-text"
      data-slot="rich-text-block"
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
  );
}

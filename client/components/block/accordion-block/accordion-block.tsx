import type { AccordionBlockData } from "@/lib/blocks";
import "./accordion-block.css";

type AccordionBlockProps = {
  data: AccordionBlockData;
};

/**
 * AccordionBlock - Renders collapsible content sections
 * Content block (leaf node) - cannot have children
 */
export function AccordionBlock({ data }: AccordionBlockProps) {
  const { items, allowMultiple = false, variant = "default" } = data;

  return (
    <div
      data-slot="accordion-block"
      data-variant={variant}
      data-allow-multiple={allowMultiple}
    >
      {items.map((item, index) => (
        <details
          key={index}
          data-slot="accordion-block-item"
          open={item.defaultOpen}
        >
          <summary data-slot="accordion-block-trigger">{item.title}</summary>
          <div data-slot="accordion-block-content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

import type { ListBlockData } from "@/lib/blocks";
import "./list-block.css";

type ListBlockProps = {
  data: ListBlockData;
};

/**
 * ListBlock - Renders ordered or unordered lists
 * Content block (leaf node) - cannot have children
 */
export function ListBlock({ data }: ListBlockProps) {
  const {
    items,
    ordered = false,
    style = "default",
    spacing = "normal",
  } = data;

  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag data-slot="list-block" data-style={style} data-spacing={spacing}>
      {items.map((item, index) => (
        <li key={index} data-slot="list-block-item">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

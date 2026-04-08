import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface ListItem {
  text: string;
}

interface ListBlockData {
  items: ListItem[];
  ordered?: boolean;
  style?: "default" | "check" | "arrow";
  spacing?: "tight" | "normal" | "comfortable" | "relaxed";
}

export default function ListBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as ListBlockData;
  const {
    items = [],
    ordered = false,
    style = "default",
    spacing = "normal",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const Tag = ordered ? "ol" : "ul";

  const handleItemBlur = (
    e: React.FocusEvent<HTMLElement>,
    item: ListItem,
    index: number,
  ) => {
    const v = e.currentTarget.textContent || "";
    if (v !== item.text && onChange) {
      const newItems = [...items];
      newItems[index] = { ...item, text: v };
      onChange({ ...block, data: { ...block.data, items: newItems } });
    }
  };

  return (
    <Tag
      className={elementClass}
      data-slot="list-block"
      data-style={style}
      data-spacing={hasStyle("gap") ? undefined : spacing}
    >
      {items.map((item, index) => (
        <li
          key={index}
          data-slot="list-block-item"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleItemBlur(e, item, index)}
          style={
            isEditing ? { cursor: "text", outline: "none" } : undefined
          }
        >
          {item.text}
        </li>
      ))}
    </Tag>
  );
}

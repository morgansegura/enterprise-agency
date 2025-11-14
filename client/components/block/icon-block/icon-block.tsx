import type { IconBlockData } from "@/lib/blocks";
import "./icon-block.css";

type IconBlockProps = {
  data: IconBlockData;
};

/**
 * IconBlock - Renders icons with optional text
 * Content block (leaf node) - cannot have children
 */
export function IconBlock({ data }: IconBlockProps) {
  const { icon, size = "md", color, text, position = "top" } = data;

  return (
    <div
      data-slot="icon-block"
      data-size={size}
      data-position={position}
      style={color ? { color } : undefined}
    >
      <span data-slot="icon-block-icon" aria-hidden="true">
        {icon}
      </span>
      {text && <span data-slot="icon-block-text">{text}</span>}
    </div>
  );
}

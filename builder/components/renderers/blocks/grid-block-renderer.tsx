import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { ContainerAddButton } from "./container-add-button";
import { getElementClass } from "@enterprise/tokens";

interface GridBlockData {
  columns?: number | { desktop?: number; tablet?: number; mobile?: number };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  align?: string;
  justify?: string;
  blocks?: Block[];
}

export default function GridBlockRenderer({
  block,
  onChange,
  isEditing,
  breakpoint,
}: BlockRendererProps) {
  const data = block.data as unknown as GridBlockData;
  const { columns, gap = "md", align, justify, blocks = [] } = data;
  const elementClass = getElementClass(block._key);

  const getBaseColValue = (): string => {
    if (typeof columns === "number") return String(columns);
    if (typeof columns === "object" && columns !== null) {
      return String(columns.desktop || columns.tablet || columns.mobile || 2);
    }
    return "2";
  };

  const colValue = getBaseColValue();
  const columnClasses: Record<string, string> = {
    "1": "grid-cols-1",
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
    "5": "grid-cols-5",
    "6": "grid-cols-6",
  };

  return (
    <div
      data-slot="grid-block"
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      className={`${columnClasses[colValue] || "grid-cols-2"} ${elementClass}`}
      style={{
        minHeight: blocks.length === 0 && isEditing ? "60px" : undefined,
      }}
    >
      {blocks.map((childBlock, i) => (
        <BlockRenderer
          key={childBlock._key}
          block={childBlock}
          isEditing={isEditing}
          breakpoint={breakpoint}
          onChange={
            onChange
              ? (updated) => {
                  const newBlocks = [...blocks];
                  newBlocks[i] = updated;
                  onChange({
                    ...block,
                    data: { ...block.data, blocks: newBlocks },
                  });
                }
              : undefined
          }
        />
      ))}
      <ContainerAddButton
        block={block}
        blocks={blocks}
        onChange={onChange}
        isEditing={isEditing}
      />
    </div>
  );
}

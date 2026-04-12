import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { ContainerAddButton } from "./container-add-button";
import { getElementClass } from "@enterprise/tokens";

interface ColumnsBlockData {
  count?: "2" | "3" | "4";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
  blocks?: Block[];
}

export default function ColumnsBlockRenderer({
  block,
  breakpoint,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as ColumnsBlockData;
  const { count = "2", gap = "md", responsive = true, blocks = [] } = data;
  const elementClass = getElementClass(block._key);

  return (
    <div
      className={elementClass}
      data-slot="columns-block"
      data-count={count}
      data-gap={gap}
      data-responsive={responsive ? "true" : undefined}
      style={{
        minHeight: blocks.length === 0 && isEditing ? "60px" : undefined,
      }}
    >
      {blocks.map((childBlock, i) => (
        <BlockRenderer
          key={childBlock._key}
          block={childBlock}
          breakpoint={breakpoint}
          isEditing={isEditing}
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

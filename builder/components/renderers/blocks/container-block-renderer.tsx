import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { ContainerAddButton } from "./container-add-button";

interface ContainerBlockData {
  width?: "narrow" | "wide" | "full";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  blocks?: Block[];
}

export default function ContainerBlockRenderer({
  block,
  breakpoint,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as ContainerBlockData;
  const { width = "wide", spacing = "none", blocks = [] } = data;
  return (
    <div
      data-slot="container-block"
      data-width={width}
      {...(spacing ? { "data-spacing": spacing } : {})}
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

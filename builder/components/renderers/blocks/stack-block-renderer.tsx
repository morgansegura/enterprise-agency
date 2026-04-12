import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { ContainerAddButton } from "./container-add-button";
import { getElementClass } from "@enterprise/tokens";

interface StackBlockData {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "start" | "center" | "end" | "stretch";
  blocks?: Block[];
}

export default function StackBlockRenderer({
  block,
  onChange,
  isEditing,
  breakpoint,
}: BlockRendererProps) {
  const data = block.data as unknown as StackBlockData;
  const { gap = "md", align = "stretch", blocks = [] } = data;
  const elementClass = getElementClass(block._key);

  return (
    <div
      className={elementClass}
      data-slot="stack-block"
      data-gap={gap}
      data-align={align}
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

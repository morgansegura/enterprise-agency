"use client";
import { cn } from "@/lib/utils";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { ContainerAddButton } from "./container-add-button";

interface FlexBlockData {
  direction?: "row" | "row-reverse" | "column" | "column-reverse" | "col";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  wrap?: boolean;
  blocks?: Block[];
}

export default function FlexBlockRenderer({
  block,
  onChange,
  isEditing,
  breakpoint,
  editorProps,
}: BlockRendererProps) {
  const data = block.data as unknown as FlexBlockData;
  const {
    direction = "row",
    justify,
    align,
    gap,
    wrap = false,
    blocks = [],
  } = data;
  return (
    <div
      {...editorProps} className={cn(editorProps?.className)}

      data-slot="flex-block"
      data-direction={direction}
      data-wrap={wrap ? "wrap" : "nowrap"}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
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

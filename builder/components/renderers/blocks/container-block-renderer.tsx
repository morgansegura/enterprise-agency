import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { getElementClass } from "@enterprise/tokens";

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

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const _hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "container-block",
    "data-width": width,
    "data-spacing": spacing,
  };

  const filtered = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <div className={elementClass} {...filtered}>
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
    </div>
  );
}

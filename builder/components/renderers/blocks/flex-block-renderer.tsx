import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
import { getElementClass } from "@enterprise/tokens";

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
}: BlockRendererProps) {
  const data = block.data as unknown as FlexBlockData;
  const {
    direction = "row",
    justify,
    align,
    gap = "md",
    wrap = false,
    blocks = [],
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const _hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "flex-block",
    "data-direction": direction,
    "data-wrap": wrap ? "wrap" : "nowrap",
    "data-gap": gap,
    "data-align": align,
    "data-justify": justify,
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
    </div>
  );
}

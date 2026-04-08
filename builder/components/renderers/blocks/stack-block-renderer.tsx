import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
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

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const _hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "stack-block",
    "data-gap": gap,
    "data-align": align,
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

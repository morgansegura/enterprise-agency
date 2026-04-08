import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { BlockRenderer } from "../block-renderer";
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

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const _hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "columns-block",
    "data-count": count,
    "data-gap": gap,
    "data-responsive": responsive ? "true" : undefined,
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

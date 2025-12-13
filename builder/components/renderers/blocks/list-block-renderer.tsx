import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface ListItem {
  text: string;
}

interface ListBlockData {
  items: ListItem[];
  ordered?: boolean;
  style?: "default" | "check" | "arrow";
  spacing?: "tight" | "comfortable" | "relaxed";
}

const spacingClasses = {
  tight: "space-y-1",
  comfortable: "space-y-2",
  relaxed: "space-y-4",
};

export default function ListBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as ListBlockData;
  const {
    items = [],
    ordered = false,
    style = "default",
    spacing = "comfortable",
  } = data;

  const Tag = ordered ? "ol" : "ul";

  const listItemContent = (item: ListItem, index: number) => {
    if (style === "check") {
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary mt-0.5">✓</span>
          <span>{item.text}</span>
        </li>
      );
    }
    if (style === "arrow") {
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary mt-0.5">→</span>
          <span>{item.text}</span>
        </li>
      );
    }
    return <li key={index}>{item.text}</li>;
  };

  return (
    <Tag
      className={cn(
        spacingClasses[spacing],
        style === "default" && ordered && "list-decimal list-inside",
        style === "default" && !ordered && "list-disc list-inside",
      )}
    >
      {items.map((item, index) => listItemContent(item, index))}
    </Tag>
  );
}

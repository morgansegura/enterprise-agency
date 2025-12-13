"use client";

import { InlineText } from "@/components/editor/inline-text";
import { useResponsiveChange } from "@/components/editor/responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { cn } from "@/lib/utils";

interface TextBlockData {
  _key: string;
  _type: "text-block";
  data: {
    text: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "left" | "center" | "right" | "justify";
    variant?: "body" | "muted" | "caption";
    maxWidth?: string;
    _responsive?: {
      tablet?: Partial<TextBlockData["data"]>;
      mobile?: Partial<TextBlockData["data"]>;
    };
  };
}

interface TextBlockEditorProps {
  block: TextBlockData;
  onChange: (block: TextBlockData) => void;
  onDelete: () => void;
  isSelected?: boolean;
}

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignMap: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const variantMap: Record<string, string> = {
  body: "text-foreground",
  muted: "text-muted-foreground",
  caption: "text-muted-foreground text-sm",
};

/**
 * TextBlockEditor - WYSIWYG Version
 *
 * Renders paragraph text exactly as it will appear on the live site.
 * Click to edit text inline.
 */
export function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const breakpoint = useCurrentBreakpoint();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as TextBlockData["data"] }),
  );

  // Get responsive-aware values
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "md";
  const align =
    getResponsiveValue<string>(block.data, "align", breakpoint) || "left";
  const variant = block.data.variant || "body";

  const textClasses = cn(sizeMap[size], alignMap[align], variantMap[variant]);

  return (
    <div
      style={{
        maxWidth: block.data.maxWidth || "none",
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      <InlineText
        value={block.data.text}
        onChange={(text) => handleDataChange("text", text)}
        placeholder="Start typing..."
        as="p"
        multiline
        className={textClasses}
      />
    </div>
  );
}

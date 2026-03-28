"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface QuoteBlockData {
  text: string;
  author?: string;
  source?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  variant?: "default" | "bordered" | "highlighted";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const variantClasses = {
  default: "border-l-4 border-[var(--accent-primary)] pl-4",
  bordered: "border border-[var(--border-default)] rounded-lg p-4",
  highlighted: "bg-[var(--el-100)] p-4 rounded-lg",
};

export default function QuoteBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as QuoteBlockData;
  const {
    text,
    author,
    source,
    size = "md",
    align = "left",
    variant = "default",
  } = data;

  const updateField = (field: string, value: string) => {
    if (onChange) {
      onChange({ ...block, data: { ...block.data, [field]: value } });
    }
  };

  return (
    <blockquote
      className={cn(
        "italic",
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
      )}
    >
      <p
        className="mb-2"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          const newText = e.currentTarget.textContent || "";
          if (newText !== text) updateField("text", newText);
        }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {text}
      </p>
      {(author || source || isEditing) && (
        <footer className="text-sm text-[var(--el-500)] not-italic">
          <span
            className="font-medium"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newAuthor = e.currentTarget.textContent || "";
              if (newAuthor !== author) updateField("author", newAuthor);
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            {author || (isEditing ? "Author name" : "")}
          </span>
          {(author || isEditing) && source && <span> — </span>}
          {(source || isEditing) && (
            <cite
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newSource = e.currentTarget.textContent || "";
                if (newSource !== source) updateField("source", newSource);
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {source || (isEditing ? "Source" : "")}
            </cite>
          )}
        </footer>
      )}
    </blockquote>
  );
}

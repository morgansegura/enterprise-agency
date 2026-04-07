"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface QuoteBlockData {
  text: string;
  author?: string;
  title?: string;
  source?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  variant?: "default" | "bordered" | "highlighted";
}

export default function QuoteBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as QuoteBlockData;
  const {
    text,
    author,
    title,
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
      data-slot="quote-block"
      data-variant={variant}
      data-size={size}
      data-align={align}
    >
      <p
        data-slot="quote-block-text"
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
      {author || title || source || isEditing ? (
        <footer data-slot="quote-block-footer">
          {(author || isEditing) ? (
            <cite
              data-slot="quote-block-author"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newAuthor = e.currentTarget.textContent || "";
                if (newAuthor !== author) updateField("author", newAuthor);
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {author || (isEditing ? "Author name" : "")}
            </cite>
          ) : null}
          {(title || isEditing) ? (
            <span
              data-slot="quote-block-title"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newTitle = e.currentTarget.textContent || "";
                if (newTitle !== title) updateField("title", newTitle);
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {title || (isEditing ? "Title" : "")}
            </span>
          ) : null}
        </footer>
      ) : null}
    </blockquote>
  );
}

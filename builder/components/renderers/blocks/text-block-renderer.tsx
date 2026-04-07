"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TextBlockData {
  text?: string;
  html?: string;
  content?: string;
  size?: string;
  align?: string;
  variant?: string;
  weight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  fontStyle?: string;
  textTransform?: string;
  textDecoration?: string;
  color?: string;
  maxWidth?: string;
  whiteSpace?: string;
  columns?: number;
  columnGap?: string;
  opacity?: number;
  dropCap?: boolean;
}

function getOpacityPreset(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return "10";
  if (opacity <= 25) return "25";
  if (opacity <= 50) return "50";
  if (opacity <= 75) return "75";
  if (opacity <= 90) return "90";
  return "100";
}

export default function TextBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as TextBlockData;
  const {
    text,
    html,
    size = "base",
    align = "left",
    variant = "default",
    weight,
    letterSpacing,
    lineHeight,
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    columns,
    columnGap,
    opacity,
    dropCap,
  } = data;

  const opacityPreset = getOpacityPreset(opacity);

  // Data attributes matching client/components/block/text-block
  const dataAttributes: Record<string, string | number | boolean | undefined> =
    {
      "data-slot": "text-block",
      "data-size": size,
      "data-align": align,
      "data-variant": variant,
      "data-weight": weight,
      "data-letter-spacing": letterSpacing,
      "data-line-height": lineHeight,
      "data-font-style": fontStyle,
      "data-text-transform": textTransform,
      "data-text-decoration": textDecoration,
      "data-white-space": whiteSpace,
      "data-max-width": maxWidth,
      "data-columns": columns,
      "data-column-gap": columnGap,
      "data-opacity": opacityPreset,
      "data-color": color,
      "data-drop-cap": dropCap,
    };

  const filteredAttrs = Object.fromEntries(
    Object.entries(dataAttributes).filter(
      ([, v]) => v !== undefined && v !== false,
    ),
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-(--accent-primary) underline",
        },
      }),
      Placeholder.configure({ placeholder: "Type some text..." }),
    ],
    content: html || (text ? `<p>${text}</p>` : ""),
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        onChange({
          ...block,
          data: {
            ...block.data,
            text: e.getText(),
            html: e.getHTML(),
          },
        });
      }
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(!!isEditing);
  }, [editor, isEditing]);

  // Read-only
  if (!isEditing || !editor) {
    if (html) {
      return (
        <div
          className={cn("text text-block prose prose-sm max-w-none")}
          {...filteredAttrs}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <p className="text" {...filteredAttrs}>
        {text || data.content}
      </p>
    );
  }

  // Edit mode — TipTap
  return (
    <div
      className={cn("text text-block prose prose-sm max-w-none")}
      {...filteredAttrs}
      style={{ cursor: "text" }}
    >
      <EditorContent editor={editor} style={{ outline: "none" }} />
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { getElementClass } from "@enterprise/tokens";

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

  // When block.styles has explicit CSS, skip the data-attribute so generated CSS wins
  const styles = (block as Record<string, unknown>).styles as Record<string, string> | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];

  const dataAttributes: Record<string, string | number | boolean | undefined> =
    {
      "data-slot": "text-block",
      "data-size": hasStyle("fontSize") ? undefined : size,
      "data-align": hasStyle("textAlign") ? undefined : align,
      "data-variant": variant,
      "data-weight": hasStyle("fontWeight") ? undefined : weight,
      "data-letter-spacing": hasStyle("letterSpacing") ? undefined : letterSpacing,
      "data-line-height": hasStyle("lineHeight") ? undefined : lineHeight,
      "data-font-style": hasStyle("fontStyle") ? undefined : fontStyle,
      "data-text-transform": hasStyle("textTransform") ? undefined : textTransform,
      "data-text-decoration": hasStyle("textDecoration") ? undefined : textDecoration,
      "data-white-space": hasStyle("whiteSpace") ? undefined : whiteSpace,
      "data-max-width": hasStyle("maxWidth") ? undefined : maxWidth,
      "data-columns": columns,
      "data-column-gap": columnGap,
      "data-opacity": hasStyle("opacity") ? undefined : opacityPreset,
      "data-color": hasStyle("color") ? undefined : color,
      "data-drop-cap": dropCap,
    };

  const filteredAttrs = Object.fromEntries(
    Object.entries(dataAttributes).filter(
      ([, v]) => v !== undefined && v !== false,
    ),
  );

  const elementClass = getElementClass(block._key);

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
          className={cn("text text-block prose prose-sm max-w-none", elementClass)}
          {...filteredAttrs}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <p className={cn("text", elementClass)} {...filteredAttrs}>
        {text || data.content}
      </p>
    );
  }

  // Edit mode — TipTap
  return (
    <div
      className={cn("text text-block prose prose-sm max-w-none", elementClass)}
      {...filteredAttrs}
      style={{ cursor: "text" }}
    >
      <EditorContent editor={editor} style={{ outline: "none" }} />
    </div>
  );
}

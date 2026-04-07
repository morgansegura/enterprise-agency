"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import { ColorMark } from "@/lib/editor/tiptap-color-mark";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { useEffect } from "react";
import { TextBubbleMenu } from "@/components/editor/text-bubble-menu/text-bubble-menu";

interface HeadingBlockData {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  align?: "left" | "center" | "right";
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "muted"
    | "accent"
    | "destructive";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
  whiteSpace?: "normal" | "nowrap" | "pre-wrap";
  opacity?: number;
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

export default function HeadingBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as HeadingBlockData;
  const {
    text,
    level = "h2",
    size = "2xl",
    align = "left",
    weight = "semibold",
    letterSpacing,
    lineHeight,
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    opacity,
  } = data;

  const Tag = level;

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "heading-block",
    "data-size": size,
    "data-weight": weight,
    "data-align": align,
    "data-letter-spacing": letterSpacing,
    "data-line-height": lineHeight,
    "data-font-style": fontStyle,
    "data-text-transform": textTransform,
    "data-text-decoration": textDecoration,
    "data-white-space": whiteSpace,
    "data-max-width": maxWidth,
    "data-opacity": getOpacityPreset(opacity),
    "data-color": color,
  };

  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  // TipTap editor for inline editing
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        horizontalRule: false,
        heading: false,
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-inherit underline" },
      }),
      ColorMark,
      Placeholder.configure({
        placeholder: "Type a heading...",
      }),
    ],
    content: text ? `<p>${text}</p>` : "",
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        // Strip tags to get plain text for the heading
        const newText = e.getText();
        // But keep HTML for rich formatting (bold, italic, etc.)
        const newHtml = e.getHTML();
        onChange({
          ...block,
          data: {
            ...block.data,
            text: newText,
            html: newHtml,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!isEditing);
    }
  }, [editor, isEditing]);

  // Read-only — render HTML if available (for colored text, bold, etc.)
  const html = (block.data as Record<string, unknown>).html as string | undefined;
  if (!isEditing || !editor) {
    if (html) {
      return (
        <Tag
          className="heading"
          {...filteredDataAttributes}
          dangerouslySetInnerHTML={{ __html: html.replace(/<\/?p>/g, "") }}
        />
      );
    }
    return (
      <Tag className="heading" {...filteredDataAttributes}>
        {text}
      </Tag>
    );
  }

  // Edit mode — TipTap inline editor styled as the heading
  return (
    <Tag
      className="heading"
      {...filteredDataAttributes}
      style={{ cursor: "text" }}
    >
      {editor && <TextBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        style={{ outline: "none" }}
      />
    </Tag>
  );
}

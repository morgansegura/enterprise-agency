"use client";

import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useBlockEditor } from "@/components/editor/block-editor-context";
import { useResponsiveChange } from "@/components/editor/responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { cn } from "@/lib/utils";

interface TextBlockData {
  _key: string;
  _type: "text-block";
  data: {
    // Content
    /** Plain text (legacy) */
    text?: string;
    /** HTML content (TipTap output) */
    html?: string;

    // Typography - Size & Spacing
    size?:
      | "xs"
      | "sm"
      | "base"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    letterSpacing?:
      | "tighter"
      | "tight"
      | "normal"
      | "wide"
      | "wider"
      | "widest";
    lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

    // Typography - Style
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
    fontStyle?: "normal" | "italic";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textDecoration?: "none" | "underline" | "line-through";
    variant?: "body" | "muted" | "caption" | "lead";

    // Typography - Color (preset only)
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "muted"
      | "accent"
      | "destructive";

    // Layout
    align?: "left" | "center" | "right" | "justify";
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
    whiteSpace?: "normal" | "nowrap" | "pre-wrap";

    // Multi-column
    columns?: 1 | 2 | 3 | 4;
    columnGap?: "sm" | "md" | "lg" | "xl";

    // Effects
    opacity?: number; // 0-100, mapped to preset
    dropCap?: boolean; // First letter styling

    // Responsive overrides
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

// ========================================
// CSS Class Maps
// ========================================

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
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
  lead: "text-muted-foreground text-lg",
};

const weightMap: Record<string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const letterSpacingMap: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const lineHeightMap: Record<string, string> = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const fontStyleMap: Record<string, string> = {
  normal: "not-italic",
  italic: "italic",
};

const textTransformMap: Record<string, string> = {
  none: "normal-case",
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
};

const textDecorationMap: Record<string, string> = {
  none: "no-underline",
  underline: "underline",
  "line-through": "line-through",
};

const whiteSpaceMap: Record<string, string> = {
  normal: "whitespace-normal",
  nowrap: "whitespace-nowrap",
  "pre-wrap": "whitespace-pre-wrap",
};

const maxWidthMap: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  prose: "max-w-prose",
  none: "max-w-none",
};

const colorMap: Record<string, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
  accent: "text-accent",
  destructive: "text-destructive",
};

const columnsMap: Record<number, string> = {
  1: "",
  2: "columns-2",
  3: "columns-3",
  4: "columns-4",
};

const columnGapMap: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const opacityMap: Record<number, string> = {
  10: "opacity-10",
  25: "opacity-25",
  50: "opacity-50",
  75: "opacity-75",
  90: "opacity-90",
  100: "opacity-100",
};

/**
 * Get the closest opacity preset class
 */
function getOpacityClass(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return opacityMap[10];
  if (opacity <= 25) return opacityMap[25];
  if (opacity <= 50) return opacityMap[50];
  if (opacity <= 75) return opacityMap[75];
  if (opacity <= 90) return opacityMap[90];
  return opacityMap[100];
}

/**
 * TextBlockEditor - WYSIWYG Version with TipTap
 *
 * Renders paragraph text exactly as it will appear on the live site.
 * Supports inline formatting (bold, italic, links) via block toolbar.
 *
 * Comprehensive typography properties:
 * - Size & Spacing: size, letterSpacing, lineHeight
 * - Style: weight, fontStyle, textTransform, textDecoration, variant
 * - Font: fontFamily, color
 * - Layout: align, maxWidth, whiteSpace
 * - Multi-column: columns, columnGap
 * - Effects: opacity, dropCap
 */
export function TextBlockEditor({
  block,
  onChange,
  isSelected,
}: TextBlockEditorProps) {
  const breakpoint = useCurrentBreakpoint();
  const { setActiveEditor, setHasSelection } = useBlockEditor();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as TextBlockData["data"] }),
  );

  // Get responsive-aware values - Size & Spacing
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "base";
  const letterSpacing = getResponsiveValue<string>(
    block.data,
    "letterSpacing",
    breakpoint,
  );
  const lineHeight = getResponsiveValue<string>(
    block.data,
    "lineHeight",
    breakpoint,
  );

  // Style
  const weight = getResponsiveValue<string>(block.data, "weight", breakpoint);
  const fontStyle = getResponsiveValue<string>(
    block.data,
    "fontStyle",
    breakpoint,
  );
  const textTransform = getResponsiveValue<string>(
    block.data,
    "textTransform",
    breakpoint,
  );
  const textDecoration = getResponsiveValue<string>(
    block.data,
    "textDecoration",
    breakpoint,
  );
  const variant = block.data.variant || "body";

  // Color
  const color = getResponsiveValue<string>(block.data, "color", breakpoint);

  // Layout
  const align =
    getResponsiveValue<string>(block.data, "align", breakpoint) || "left";
  const maxWidth = getResponsiveValue<string>(
    block.data,
    "maxWidth",
    breakpoint,
  );
  const whiteSpace = getResponsiveValue<string>(
    block.data,
    "whiteSpace",
    breakpoint,
  );

  // Multi-column
  const columns = getResponsiveValue<number>(block.data, "columns", breakpoint);
  const columnGap = getResponsiveValue<string>(
    block.data,
    "columnGap",
    breakpoint,
  );

  // Effects
  const opacity = getResponsiveValue<number>(block.data, "opacity", breakpoint);
  const dropCap = getResponsiveValue<boolean>(
    block.data,
    "dropCap",
    breakpoint,
  );

  // Build Tailwind classes for editor content
  const textClasses = cn(
    // Size & Spacing
    sizeMap[size],
    letterSpacing && letterSpacingMap[letterSpacing],
    lineHeight && lineHeightMap[lineHeight],
    // Style
    weight && weightMap[weight],
    fontStyle && fontStyleMap[fontStyle],
    textTransform && textTransformMap[textTransform],
    textDecoration && textDecorationMap[textDecoration],
    variantMap[variant],
    // Layout
    alignMap[align],
    whiteSpace && whiteSpaceMap[whiteSpace],
    // Drop cap
    dropCap &&
      "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none",
  );

  // Build wrapper classes (no inline styles)
  const wrapperClasses = cn(
    // Layout
    maxWidth && maxWidthMap[maxWidth],
    maxWidth && align === "center" && "mx-auto",
    // Multi-column
    columns && columns > 1 && columnsMap[columns],
    columns && columns > 1 && columnGap && columnGapMap[columnGap],
    // Color
    color && colorMap[color],
    // Effects
    getOpacityClass(opacity),
  );

  // Get initial content - prefer html, fallback to text (wrapped in <p>)
  const getInitialContent = useCallback(() => {
    if (block.data.html) {
      return block.data.html;
    }
    if (block.data.text) {
      return `<p>${block.data.text}</p>`;
    }
    return "";
  }, [block.data.html, block.data.text]);

  const editor = useEditor({
    // Prevent SSR hydration mismatch
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable block-level features - text-block is for paragraphs only
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        horizontalRule: false,
        // Keep inline formatting
        bold: {},
        italic: {},
        strike: {},
        code: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Store as html, clear legacy text field
      handleDataChange("html", html);
    },
    onSelectionUpdate: ({ editor }) => {
      // Update selection state for toolbar
      const { from, to } = editor.state.selection;
      setHasSelection(from !== to);
    },
    onFocus: () => {
      // Register this editor as active when focused
      if (editor) {
        setActiveEditor(editor);
      }
    },
    onBlur: () => {
      // Clear active editor when blurred
      setActiveEditor(null);
      setHasSelection(false);
    },
    editorProps: {
      attributes: {
        class: cn("text-block-editor outline-none", textClasses),
      },
    },
  });

  // Register editor when block is selected
  useEffect(() => {
    if (isSelected && editor) {
      setActiveEditor(editor);
    }
    return () => {
      if (isSelected) {
        setActiveEditor(null);
        setHasSelection(false);
      }
    };
  }, [isSelected, editor, setActiveEditor, setHasSelection]);

  // Update editor content when block changes externally
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const currentContent = editor.getHTML();
      const newContent = getInitialContent();
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [editor, getInitialContent]);

  // Update editor classes when styling changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: cn("text-block-editor outline-none", textClasses),
          },
        },
      });
    }
  }, [editor, textClasses]);

  return (
    <div className={wrapperClasses}>
      <EditorContent editor={editor} />
    </div>
  );
}

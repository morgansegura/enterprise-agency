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
    /** Plain text (legacy) */
    text?: string;
    /** HTML content (TipTap output) */
    html?: string;
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
 * TextBlockEditor - WYSIWYG Version with TipTap
 *
 * Renders paragraph text exactly as it will appear on the live site.
 * Supports inline formatting (bold, italic, links) via block toolbar.
 * Block-level styling (size, align, variant) applied to wrapper.
 */
export function TextBlockEditor({ block, onChange, isSelected }: TextBlockEditorProps) {
  const breakpoint = useCurrentBreakpoint();
  const { setActiveEditor, setHasSelection } = useBlockEditor();

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
    <div
      style={{
        maxWidth: block.data.maxWidth || "none",
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

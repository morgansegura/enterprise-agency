"use client";

import { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TiptapBubbleMenu } from "@/components/editor/tiptap-bubble-menu";
import { useResponsiveChange } from "@/components/editor/responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, Unlink } from "lucide-react";

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
 * Supports inline formatting (bold, italic, links) via bubble menu.
 * Block-level styling (size, align, variant) applied to wrapper.
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
    editorProps: {
      attributes: {
        class: cn("text-block-editor outline-none", textClasses),
      },
    },
  });

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

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div
      style={{
        maxWidth: block.data.maxWidth || "none",
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      <TiptapBubbleMenu
        editor={editor}
        className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-md"
      >
        <Button
          type="button"
          variant={editor?.isActive("bold") ? "default" : "ghost"}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive("italic") ? "default" : "ghost"}
          size="icon-sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        {editor?.isActive("link") ? (
          <Button
            type="button"
            variant="default"
            size="icon-sm"
            onClick={() => editor?.chain().focus().unsetLink().run()}
            title="Remove link"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={setLink}
            title="Add link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        )}
      </TiptapBubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}

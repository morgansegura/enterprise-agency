"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
} from "lucide-react";
import type { RichtextFieldSchema } from "@/lib/schemas";

import "./richtext-field.css";

export interface RichtextFieldProps {
  schema: RichtextFieldSchema;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

type ToolbarItem = NonNullable<RichtextFieldSchema["toolbar"]>[number];

const TOOLBAR_BUTTONS: Record<
  ToolbarItem,
  { icon: React.ElementType; action: string }[]
> = {
  heading: [
    { icon: Heading1, action: "heading1" },
    { icon: Heading2, action: "heading2" },
  ],
  bold: [{ icon: Bold, action: "bold" }],
  italic: [{ icon: Italic, action: "italic" }],
  underline: [],
  strike: [{ icon: Strikethrough, action: "strike" }],
  link: [{ icon: LinkIcon, action: "link" }],
  image: [],
  list: [
    { icon: List, action: "bulletList" },
    { icon: ListOrdered, action: "orderedList" },
  ],
  blockquote: [{ icon: Quote, action: "blockquote" }],
  code: [{ icon: Code, action: "codeBlock" }],
  align: [],
  color: [],
};

const DEFAULT_TOOLBAR: ToolbarItem[] = [
  "heading",
  "bold",
  "italic",
  "strike",
  "link",
  "list",
  "blockquote",
  "code",
];

/**
 * RichtextField — Field editor with inline TipTap rich text editing.
 * Uses the same TipTap setup as the rest of the builder.
 */
export function RichtextField({
  schema,
  value,
  onChange,
  error,
  className,
}: RichtextFieldProps) {
  const inputId = React.useId();
  const hasError = !!error;
  const toolbar = (schema.toolbar as ToolbarItem[]) || DEFAULT_TOOLBAR;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: schema.placeholder || "Start typing...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const handleAction = (action: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();

    switch (action) {
      case "heading1":
        chain.toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        chain.toggleHeading({ level: 2 }).run();
        break;
      case "bold":
        chain.toggleBold().run();
        break;
      case "italic":
        chain.toggleItalic().run();
        break;
      case "strike":
        chain.toggleStrike().run();
        break;
      case "link": {
        const url = window.prompt("URL");
        if (url) chain.setLink({ href: url }).run();
        break;
      }
      case "bulletList":
        chain.toggleBulletList().run();
        break;
      case "orderedList":
        chain.toggleOrderedList().run();
        break;
      case "blockquote":
        chain.toggleBlockquote().run();
        break;
      case "codeBlock":
        chain.toggleCodeBlock().run();
        break;
    }
  };

  const isActive = (action: string): boolean => {
    if (!editor) return false;
    switch (action) {
      case "heading1":
        return editor.isActive("heading", { level: 1 });
      case "heading2":
        return editor.isActive("heading", { level: 2 });
      default:
        return editor.isActive(action);
    }
  };

  if (!editor) return null;

  return (
    <div className={cn("richtext-field", className)} data-width={schema.width}>
      <Label htmlFor={inputId} className="richtext-field__label">
        {schema.label}
        {schema.validation?.required && (
          <span className="richtext-field__required">*</span>
        )}
      </Label>

      <div
        className={cn(
          "richtext-field__editor",
          hasError && "richtext-field__editor--error",
        )}
      >
        <div className="richtext-field__toolbar">
          {toolbar.map((item) =>
            TOOLBAR_BUTTONS[item]?.map(({ icon: Icon, action }) => (
              <button
                key={action}
                type="button"
                className={cn(
                  "richtext-field__toolbar-btn",
                  isActive(action) && "richtext-field__toolbar-btn--active",
                )}
                onClick={() => handleAction(action)}
              >
                <Icon />
              </button>
            )),
          )}
        </div>

        <EditorContent
          editor={editor}
          className="richtext-field__content"
          style={{ minHeight: schema.minHeight || 150 }}
        />
      </div>

      {schema.description && !hasError && (
        <p className="richtext-field__description">{schema.description}</p>
      )}

      {hasError && <p className="richtext-field__error">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Type,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
} from "lucide-react";
import { FormItem } from "@/components/ui/form";

interface RichTextBlockData {
  _key: string;
  _type: "rich-text-block";
  data: {
    html: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    align?: "left" | "center" | "right" | "justify";
  };
}

interface RichTextBlockEditorProps {
  block: RichTextBlockData;
  onChange: (block: RichTextBlockData) => void;
  onDelete: () => void;
}

export function RichTextBlockEditor({
  block,
  onChange,
  onDelete,
}: RichTextBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDataChange = (field: string, value: unknown) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [field]: value,
      },
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: block.data.html,
    onUpdate: ({ editor }) => {
      handleDataChange("html", editor.getHTML());
    },
  });

  const size = block.data.size || "md";
  const align = block.data.align || "left";

  const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`prose prose-sm max-w-none ${sizeMap[size]} ${alignMap[align]}`}
          dangerouslySetInnerHTML={{
            __html: block.data.html || "<p>Empty rich text...</p>",
          }}
        />
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Type className="h-4 w-4" />
          Rich Text Block
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Toolbar */}
        {editor && (
          <div className="border rounded-lg p-2 flex flex-wrap gap-1">
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
              }
              size="icon-sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px bg-border mx-1" />

            <Button
              type="button"
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("strike") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="w-px bg-border mx-1" />

            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px bg-border mx-1" />

            <Button
              type="button"
              variant={editor.isActive("link") ? "default" : "ghost"}
              size="icon-sm"
              onClick={setLink}
              title="Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Editor */}
        <div className="border rounded-lg p-4 min-h-[200px] prose prose-sm max-w-none">
          <EditorContent editor={editor} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormItem>
            <Label htmlFor="richtext-size">Text Size</Label>
            <Select
              value={size}
              onValueChange={(value) => handleDataChange("size", value)}
            >
              <SelectTrigger id="richtext-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <Label htmlFor="richtext-align">Alignment</Label>
            <Select
              value={align}
              onValueChange={(value) => handleDataChange("align", value)}
            >
              <SelectTrigger id="richtext-align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div
            className={`prose prose-sm max-w-none ${sizeMap[size]} ${alignMap[align]}`}
            dangerouslySetInnerHTML={{
              __html: block.data.html || "<p>Empty rich text...</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
}

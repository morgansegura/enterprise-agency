/**
 * Block Schemas
 *
 * Defines the field configuration for each block type.
 * These schemas drive the block settings panel UI.
 */

import type { BlockSchema } from "./field-types";

// ============================================================================
// LAYOUT BLOCKS
// ============================================================================

export const containerBlockSchema: BlockSchema = {
  type: "container-block",
  label: "Container",
  category: "layout",
  description: "Wrapper container with max-width and padding",
  fields: [
    {
      name: "maxWidth",
      type: "select",
      label: "Max Width",
      group: "content",
      options: [
        { label: "Small (640px)", value: "sm" },
        { label: "Medium (768px)", value: "md" },
        { label: "Large (1024px)", value: "lg" },
        { label: "XL (1280px)", value: "xl" },
        { label: "2XL (1536px)", value: "2xl" },
        { label: "Full Width", value: "full" },
      ],
      defaultValue: "lg",
    },
    {
      name: "centered",
      type: "boolean",
      label: "Center Content",
      group: "content",
      defaultValue: true,
    },
    {
      name: "padding",
      type: "select",
      label: "Padding",
      group: "style",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      name: "style.backgroundColor",
      type: "color",
      label: "Background Color",
      group: "style",
      presets: ["transparent", "#ffffff", "#f9fafb", "#f3f4f6", "#1f2937"],
      allowCustom: true,
    },
  ],
};

export const gridBlockSchema: BlockSchema = {
  type: "grid-block",
  label: "Grid",
  category: "layout",
  description: "Responsive CSS grid layout",
  fields: [
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "content",
      options: [
        { label: "1 Column", value: 1 },
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
        { label: "5 Columns", value: 5 },
        { label: "6 Columns", value: 6 },
      ],
      defaultValue: 3,
    },
    {
      name: "gap",
      type: "select",
      label: "Gap",
      group: "style",
      options: [
        { label: "None", value: "0" },
        { label: "Small (8px)", value: "2" },
        { label: "Medium (16px)", value: "4" },
        { label: "Large (24px)", value: "6" },
        { label: "XL (32px)", value: "8" },
      ],
      defaultValue: "4",
    },
    {
      name: "alignItems",
      type: "select",
      label: "Align Items",
      group: "style",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
      defaultValue: "stretch",
    },
  ],
};

export const flexBlockSchema: BlockSchema = {
  type: "flex-block",
  label: "Flex",
  category: "layout",
  description: "Flexible box layout",
  fields: [
    {
      name: "direction",
      type: "select",
      label: "Direction",
      group: "content",
      options: [
        { label: "Row", value: "row" },
        { label: "Row Reverse", value: "row-reverse" },
        { label: "Column", value: "column" },
        { label: "Column Reverse", value: "column-reverse" },
      ],
      defaultValue: "row",
    },
    {
      name: "wrap",
      type: "select",
      label: "Wrap",
      group: "content",
      options: [
        { label: "No Wrap", value: "nowrap" },
        { label: "Wrap", value: "wrap" },
        { label: "Wrap Reverse", value: "wrap-reverse" },
      ],
      defaultValue: "wrap",
    },
    {
      name: "gap",
      type: "select",
      label: "Gap",
      group: "style",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "2" },
        { label: "Medium", value: "4" },
        { label: "Large", value: "6" },
      ],
      defaultValue: "4",
    },
    {
      name: "alignItems",
      type: "select",
      label: "Align Items",
      group: "style",
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
      defaultValue: "center",
    },
    {
      name: "justifyContent",
      type: "select",
      label: "Justify Content",
      group: "style",
      options: [
        { label: "Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "End", value: "flex-end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
        { label: "Space Evenly", value: "space-evenly" },
      ],
      defaultValue: "flex-start",
    },
  ],
};

export const spacerBlockSchema: BlockSchema = {
  type: "spacer-block",
  label: "Spacer",
  category: "layout",
  description: "Vertical spacing between blocks",
  fields: [
    {
      name: "size",
      type: "select",
      label: "Size",
      group: "content",
      options: [
        { label: "XS (8px)", value: "xs" },
        { label: "Small (16px)", value: "sm" },
        { label: "Medium (32px)", value: "md" },
        { label: "Large (48px)", value: "lg" },
        { label: "XL (64px)", value: "xl" },
        { label: "2XL (96px)", value: "2xl" },
      ],
      defaultValue: "md",
    },
  ],
};

export const dividerBlockSchema: BlockSchema = {
  type: "divider-block",
  label: "Divider",
  category: "layout",
  description: "Horizontal line separator",
  fields: [
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "content",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
      ],
      defaultValue: "solid",
    },
    {
      name: "style.borderColor",
      type: "color",
      label: "Color",
      group: "style",
      presets: ["#e5e7eb", "#d1d5db", "#9ca3af"],
      allowCustom: true,
    },
  ],
};

export const cardBlockSchema: BlockSchema = {
  type: "card-block",
  label: "Card",
  category: "layout",
  description: "Card container with shadow",
  fields: [
    {
      name: "padding",
      type: "select",
      label: "Padding",
      group: "content",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      name: "shadow",
      type: "select",
      label: "Shadow",
      group: "style",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "sm",
    },
    {
      name: "style.borderRadius",
      type: "select",
      label: "Border Radius",
      group: "style",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "0.25rem" },
        { label: "Medium", value: "0.5rem" },
        { label: "Large", value: "1rem" },
      ],
      defaultValue: "0.5rem",
    },
    {
      name: "style.backgroundColor",
      type: "color",
      label: "Background",
      group: "style",
      presets: ["#ffffff", "#f9fafb", "#f3f4f6"],
      allowCustom: true,
    },
  ],
};

// ============================================================================
// CONTENT BLOCKS
// ============================================================================

export const headingBlockSchema: BlockSchema = {
  type: "heading-block",
  label: "Heading",
  category: "content",
  description: "Section heading text",
  preview: { field: "text", fallback: "Heading" },
  fields: [
    {
      name: "text",
      type: "text",
      label: "Text",
      group: "content",
      placeholder: "Enter heading text...",
      validation: { required: true },
    },
    {
      name: "level",
      type: "select",
      label: "Level",
      group: "content",
      options: [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 },
        { label: "H4", value: 4 },
        { label: "H5", value: 5 },
        { label: "H6", value: 6 },
      ],
      defaultValue: 2,
    },
    {
      name: "align",
      type: "select",
      label: "Alignment",
      group: "style",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      defaultValue: "left",
    },
    {
      name: "style.fontSize",
      type: "select",
      label: "Size",
      group: "style",
      options: [
        { label: "Small", value: "1.5rem" },
        { label: "Medium", value: "2rem" },
        { label: "Large", value: "2.5rem" },
        { label: "XL", value: "3rem" },
        { label: "2XL", value: "4rem" },
      ],
    },
    {
      name: "style.color",
      type: "color",
      label: "Color",
      group: "style",
      presets: ["inherit", "#111827", "#374151", "#6b7280"],
      allowCustom: true,
    },
    {
      name: "style.fontWeight",
      type: "select",
      label: "Weight",
      group: "style",
      options: [
        { label: "Normal", value: "400" },
        { label: "Medium", value: "500" },
        { label: "Semibold", value: "600" },
        { label: "Bold", value: "700" },
        { label: "Extrabold", value: "800" },
      ],
      defaultValue: "700",
    },
  ],
};

export const textBlockSchema: BlockSchema = {
  type: "text-block",
  label: "Text",
  category: "content",
  description: "Plain text paragraph",
  preview: { field: "content", fallback: "Text block" },
  fields: [
    {
      name: "content",
      type: "textarea",
      label: "Content",
      group: "content",
      placeholder: "Enter your text...",
      rows: 4,
    },
    {
      name: "align",
      type: "select",
      label: "Alignment",
      group: "style",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
        { label: "Justify", value: "justify" },
      ],
      defaultValue: "left",
    },
    {
      name: "style.fontSize",
      type: "select",
      label: "Size",
      group: "style",
      options: [
        { label: "Small", value: "0.875rem" },
        { label: "Base", value: "1rem" },
        { label: "Large", value: "1.125rem" },
        { label: "XL", value: "1.25rem" },
      ],
      defaultValue: "1rem",
    },
    {
      name: "style.color",
      type: "color",
      label: "Color",
      group: "style",
      presets: ["inherit", "#374151", "#6b7280", "#9ca3af"],
      allowCustom: true,
    },
  ],
};

export const richTextBlockSchema: BlockSchema = {
  type: "rich-text-block",
  label: "Rich Text",
  category: "content",
  description: "Formatted rich text with WYSIWYG editor",
  preview: { field: "content", fallback: "Rich text block" },
  fields: [
    {
      name: "content",
      type: "richtext",
      label: "Content",
      group: "content",
      toolbar: [
        "heading",
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "image",
        "list",
        "blockquote",
        "code",
        "align",
      ],
      minHeight: 200,
    },
  ],
};

export const imageBlockSchema: BlockSchema = {
  type: "image-block",
  label: "Image",
  category: "content",
  description: "Image with alt text and sizing options",
  preview: { field: "alt", fallback: "Image" },
  fields: [
    {
      name: "src",
      type: "media",
      label: "Image",
      group: "content",
      accept: ["image/*"],
      validation: { required: true },
    },
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
      group: "content",
      placeholder: "Describe the image...",
      description: "Important for accessibility and SEO",
      validation: { required: true },
    },
    {
      name: "width",
      type: "select",
      label: "Width",
      group: "style",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Full", value: "100%" },
        { label: "3/4", value: "75%" },
        { label: "1/2", value: "50%" },
        { label: "1/3", value: "33.333%" },
        { label: "1/4", value: "25%" },
      ],
      defaultValue: "100%",
    },
    {
      name: "objectFit",
      type: "select",
      label: "Fit",
      group: "style",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
      ],
      defaultValue: "cover",
    },
    {
      name: "loading",
      type: "select",
      label: "Loading",
      group: "advanced",
      options: [
        { label: "Lazy", value: "lazy" },
        { label: "Eager", value: "eager" },
      ],
      defaultValue: "lazy",
    },
    {
      name: "style.borderRadius",
      type: "select",
      label: "Border Radius",
      group: "style",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "0.25rem" },
        { label: "Medium", value: "0.5rem" },
        { label: "Large", value: "1rem" },
        { label: "Full", value: "9999px" },
      ],
      defaultValue: "0",
    },
  ],
};

export const videoBlockSchema: BlockSchema = {
  type: "video-block",
  label: "Video",
  category: "content",
  description: "Video embed (native, YouTube, or Vimeo)",
  preview: { field: "title", fallback: "Video" },
  fields: [
    {
      name: "src",
      type: "text",
      label: "Video URL",
      group: "content",
      placeholder: "Enter video URL or YouTube/Vimeo link...",
      inputType: "url",
    },
    {
      name: "youtubeId",
      type: "text",
      label: "YouTube ID",
      group: "content",
      placeholder: "e.g., dQw4w9WgXcQ",
      description: "Alternative to URL - just the video ID",
    },
    {
      name: "vimeoId",
      type: "text",
      label: "Vimeo ID",
      group: "content",
      placeholder: "e.g., 123456789",
    },
    {
      name: "poster",
      type: "media",
      label: "Poster Image",
      group: "content",
      accept: ["image/*"],
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      placeholder: "Video title for accessibility",
    },
    {
      name: "controls",
      type: "boolean",
      label: "Show Controls",
      group: "content",
      defaultValue: true,
    },
    {
      name: "autoplay",
      type: "boolean",
      label: "Autoplay",
      group: "content",
      defaultValue: false,
    },
    {
      name: "loop",
      type: "boolean",
      label: "Loop",
      group: "content",
      defaultValue: false,
    },
    {
      name: "muted",
      type: "boolean",
      label: "Muted",
      group: "content",
      defaultValue: false,
    },
    {
      name: "aspectRatio",
      type: "select",
      label: "Aspect Ratio",
      group: "style",
      options: [
        { label: "16:9", value: "16/9" },
        { label: "4:3", value: "4/3" },
        { label: "1:1", value: "1/1" },
        { label: "9:16", value: "9/16" },
      ],
      defaultValue: "16/9",
    },
  ],
};

export const buttonBlockSchema: BlockSchema = {
  type: "button-block",
  label: "Button",
  category: "content",
  description: "Call to action button",
  preview: { field: "text", fallback: "Button" },
  fields: [
    {
      name: "text",
      type: "text",
      label: "Text",
      group: "content",
      placeholder: "Button text...",
      validation: { required: true },
    },
    {
      name: "url",
      type: "text",
      label: "URL",
      group: "content",
      placeholder: "https://...",
      inputType: "url",
    },
    {
      name: "target",
      type: "select",
      label: "Open In",
      group: "content",
      options: [
        { label: "Same Tab", value: "_self" },
        { label: "New Tab", value: "_blank" },
      ],
      defaultValue: "_self",
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
        { label: "Link", value: "link" },
      ],
      defaultValue: "primary",
    },
    {
      name: "size",
      type: "select",
      label: "Size",
      group: "style",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      name: "fullWidth",
      type: "boolean",
      label: "Full Width",
      group: "style",
      defaultValue: false,
    },
  ],
};

export const iconBlockSchema: BlockSchema = {
  type: "icon-block",
  label: "Icon",
  category: "content",
  description: "Icon element",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Icon Name",
      group: "content",
      placeholder: "e.g., star, heart, check",
      description: "Lucide icon name",
    },
    {
      name: "size",
      type: "select",
      label: "Size",
      group: "style",
      options: [
        { label: "Small (16px)", value: "sm" },
        { label: "Medium (24px)", value: "md" },
        { label: "Large (32px)", value: "lg" },
        { label: "XL (48px)", value: "xl" },
      ],
      defaultValue: "md",
    },
    {
      name: "style.color",
      type: "color",
      label: "Color",
      group: "style",
      presets: ["currentColor", "#111827", "#3b82f6", "#10b981", "#ef4444"],
      allowCustom: true,
    },
  ],
};

// ============================================================================
// INTERACTIVE BLOCKS
// ============================================================================

export const accordionBlockSchema: BlockSchema = {
  type: "accordion-block",
  label: "Accordion",
  category: "interactive",
  description: "Collapsible content sections",
  fields: [
    {
      name: "items",
      type: "array",
      label: "Items",
      group: "content",
      addLabel: "Add Item",
      collapsible: true,
      itemSchema: {
        name: "item",
        label: "Accordion Item",
        fields: [
          {
            name: "title",
            type: "text",
            label: "Title",
            validation: { required: true },
          },
          {
            name: "content",
            type: "richtext",
            label: "Content",
            toolbar: ["bold", "italic", "link", "list"],
          },
        ],
      },
      minItems: 1,
    },
    {
      name: "allowMultiple",
      type: "boolean",
      label: "Allow Multiple Open",
      group: "content",
      defaultValue: false,
    },
    {
      name: "defaultOpen",
      type: "select",
      label: "Default Open",
      group: "content",
      options: [
        { label: "None", value: "none" },
        { label: "First", value: "first" },
        { label: "All", value: "all" },
      ],
      defaultValue: "none",
    },
  ],
};

export const tabsBlockSchema: BlockSchema = {
  type: "tabs-block",
  label: "Tabs",
  category: "interactive",
  description: "Tabbed content sections",
  fields: [
    {
      name: "items",
      type: "array",
      label: "Tabs",
      group: "content",
      addLabel: "Add Tab",
      collapsible: true,
      itemSchema: {
        name: "tab",
        label: "Tab",
        fields: [
          {
            name: "label",
            type: "text",
            label: "Label",
            validation: { required: true },
          },
          {
            name: "content",
            type: "richtext",
            label: "Content",
            toolbar: ["heading", "bold", "italic", "link", "list", "image"],
          },
        ],
      },
      minItems: 2,
    },
    {
      name: "defaultTab",
      type: "number",
      label: "Default Tab",
      group: "content",
      description: "Index of initially active tab (0-based)",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Line", value: "line" },
        { label: "Enclosed", value: "enclosed" },
        { label: "Pills", value: "pills" },
      ],
      defaultValue: "line",
    },
  ],
};

// ============================================================================
// SECTION BLOCKS
// ============================================================================

export const heroBlockSchema: BlockSchema = {
  type: "hero-block",
  label: "Hero Section",
  category: "section",
  description: "Full-width hero with heading, text, and CTA",
  preview: { field: "title", fallback: "Hero Section" },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Eyebrow",
      group: "content",
      placeholder: "Small text above heading",
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      placeholder: "Main heading...",
      validation: { required: true },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
      rows: 3,
    },
    {
      name: "image",
      type: "media",
      label: "Background Image",
      group: "content",
      accept: ["image/*"],
    },
    {
      name: "layout",
      type: "select",
      label: "Layout",
      group: "style",
      options: [
        { label: "Centered", value: "centered" },
        { label: "Split Left", value: "split-left" },
        { label: "Split Right", value: "split-right" },
      ],
      defaultValue: "centered",
    },
    {
      name: "actions",
      type: "array",
      label: "Buttons",
      group: "content",
      addLabel: "Add Button",
      maxItems: 3,
      itemSchema: {
        name: "action",
        label: "Button",
        fields: [
          { name: "label", type: "text", label: "Label" },
          { name: "href", type: "text", label: "URL", inputType: "url" },
          {
            name: "variant",
            type: "select",
            label: "Style",
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Outline", value: "outline" },
            ],
          },
        ],
      },
    },
    {
      name: "style.minHeight",
      type: "select",
      label: "Height",
      group: "style",
      options: [
        { label: "Auto", value: "auto" },
        { label: "50vh", value: "50vh" },
        { label: "75vh", value: "75vh" },
        { label: "Full Screen", value: "100vh" },
      ],
      defaultValue: "75vh",
    },
  ],
};

export const featuresBlockSchema: BlockSchema = {
  type: "features-block",
  label: "Features",
  category: "section",
  description: "Feature grid with icons and descriptions",
  preview: { field: "title", fallback: "Features" },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Eyebrow",
      group: "content",
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      placeholder: "Section title...",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "items",
      type: "array",
      label: "Features",
      group: "content",
      addLabel: "Add Feature",
      collapsible: true,
      itemSchema: {
        name: "feature",
        label: "Feature",
        fields: [
          {
            name: "icon",
            type: "text",
            label: "Icon",
            placeholder: "Lucide icon name",
          },
          {
            name: "title",
            type: "text",
            label: "Title",
            validation: { required: true },
          },
          {
            name: "description",
            type: "textarea",
            label: "Description",
            rows: 2,
          },
        ],
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
      defaultValue: 3,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Icons", value: "icons" },
        { label: "Minimal", value: "minimal" },
      ],
      defaultValue: "cards",
    },
  ],
};

export const ctaBlockSchema: BlockSchema = {
  type: "cta-block",
  label: "CTA Section",
  category: "section",
  description: "Call to action section",
  preview: { field: "title", fallback: "CTA" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      validation: { required: true },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "actions",
      type: "array",
      label: "Buttons",
      group: "content",
      addLabel: "Add Button",
      maxItems: 2,
      itemSchema: {
        name: "action",
        label: "Button",
        fields: [
          { name: "label", type: "text", label: "Label" },
          { name: "href", type: "text", label: "URL", inputType: "url" },
          {
            name: "variant",
            type: "select",
            label: "Style",
            options: [
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Outline", value: "outline" },
            ],
          },
        ],
      },
    },
    {
      name: "style.backgroundColor",
      type: "color",
      label: "Background",
      group: "style",
      presets: ["#1f2937", "#3b82f6", "#7c3aed", "#059669"],
      allowCustom: true,
    },
    {
      name: "style.color",
      type: "color",
      label: "Text Color",
      group: "style",
      presets: ["#ffffff", "#f9fafb", "#111827"],
      allowCustom: true,
    },
  ],
};

export const statsBlockSchema: BlockSchema = {
  type: "stats-block",
  label: "Stats",
  category: "section",
  description: "Statistics display",
  preview: { field: "title", fallback: "Stats" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "items",
      type: "array",
      label: "Stats",
      group: "content",
      addLabel: "Add Stat",
      itemSchema: {
        name: "stat",
        label: "Stat",
        fields: [
          {
            name: "value",
            type: "text",
            label: "Value",
            placeholder: "100+",
            validation: { required: true },
          },
          {
            name: "label",
            type: "text",
            label: "Label",
            validation: { required: true },
          },
          { name: "description", type: "text", label: "Description" },
        ],
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
      defaultValue: 4,
    },
  ],
};

export const faqBlockSchema: BlockSchema = {
  type: "faq-block",
  label: "FAQ",
  category: "section",
  description: "Frequently asked questions accordion",
  preview: { field: "title", fallback: "FAQ" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      defaultValue: "Frequently Asked Questions",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "items",
      type: "array",
      label: "Questions",
      group: "content",
      addLabel: "Add Question",
      collapsible: true,
      itemSchema: {
        name: "faq",
        label: "FAQ Item",
        fields: [
          {
            name: "question",
            type: "text",
            label: "Question",
            validation: { required: true },
          },
          {
            name: "answer",
            type: "richtext",
            label: "Answer",
            toolbar: ["bold", "italic", "link", "list"],
          },
        ],
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Default", value: "default" },
        { label: "Simple", value: "simple" },
        { label: "Two Column", value: "two-column" },
      ],
      defaultValue: "default",
    },
    {
      name: "showContact",
      type: "boolean",
      label: "Show Contact CTA",
      group: "content",
      defaultValue: false,
    },
  ],
};

export const testimonialsBlockSchema: BlockSchema = {
  type: "testimonials-block",
  label: "Testimonials",
  category: "section",
  description: "Customer testimonials",
  preview: { field: "title", fallback: "Testimonials" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "items",
      type: "array",
      label: "Testimonials",
      group: "content",
      addLabel: "Add Testimonial",
      collapsible: true,
      itemSchema: {
        name: "testimonial",
        label: "Testimonial",
        fields: [
          {
            name: "quote",
            type: "textarea",
            label: "Quote",
            validation: { required: true },
            rows: 3,
          },
          {
            name: "author",
            type: "text",
            label: "Author Name",
            validation: { required: true },
          },
          { name: "role", type: "text", label: "Role/Company" },
          {
            name: "avatar",
            type: "media",
            label: "Avatar",
            accept: ["image/*"],
          },
          { name: "rating", type: "number", label: "Rating", min: 1, max: 5 },
        ],
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Carousel", value: "carousel" },
        { label: "Grid", value: "grid" },
        { label: "Single", value: "single" },
      ],
      defaultValue: "carousel",
    },
  ],
};

export const pricingBlockSchema: BlockSchema = {
  type: "pricing-block",
  label: "Pricing Table",
  category: "section",
  description: "Pricing plans comparison",
  preview: { field: "title", fallback: "Pricing" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      defaultValue: "Simple, transparent pricing",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "plans",
      type: "array",
      label: "Pricing Plans",
      group: "content",
      addLabel: "Add Plan",
      collapsible: true,
      itemSchema: {
        name: "plan",
        label: "Plan",
        fields: [
          {
            name: "name",
            type: "text",
            label: "Plan Name",
            validation: { required: true },
          },
          {
            name: "price",
            type: "text",
            label: "Price",
            placeholder: "$29",
            validation: { required: true },
          },
          {
            name: "period",
            type: "select",
            label: "Billing Period",
            options: [
              { label: "Monthly", value: "month" },
              { label: "Yearly", value: "year" },
              { label: "One-time", value: "once" },
            ],
            defaultValue: "month",
          },
          { name: "description", type: "text", label: "Description" },
          {
            name: "featured",
            type: "boolean",
            label: "Featured/Popular",
            defaultValue: false,
          },
          {
            name: "features",
            type: "array",
            label: "Features",
            addLabel: "Add Feature",
            itemSchema: {
              name: "feature",
              label: "Feature",
              fields: [
                { name: "text", type: "text", label: "Feature Text" },
                {
                  name: "included",
                  type: "boolean",
                  label: "Included",
                  defaultValue: true,
                },
              ],
            },
          },
          {
            name: "buttonText",
            type: "text",
            label: "Button Text",
            defaultValue: "Get Started",
          },
          {
            name: "buttonUrl",
            type: "text",
            label: "Button URL",
            inputType: "url",
          },
        ],
      },
    },
    {
      name: "showToggle",
      type: "boolean",
      label: "Show Monthly/Yearly Toggle",
      group: "content",
      defaultValue: true,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Comparison Table", value: "table" },
        { label: "Horizontal", value: "horizontal" },
      ],
      defaultValue: "cards",
    },
  ],
};

export const contactBlockSchema: BlockSchema = {
  type: "contact-block",
  label: "Contact Info",
  category: "section",
  description: "Contact information section",
  preview: { field: "title", fallback: "Contact" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      defaultValue: "Get in Touch",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      group: "content",
      inputType: "email",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
      group: "content",
      inputType: "tel",
    },
    {
      name: "address",
      type: "textarea",
      label: "Address",
      group: "content",
      rows: 3,
    },
    {
      name: "hours",
      type: "array",
      label: "Business Hours",
      group: "content",
      addLabel: "Add Hours",
      itemSchema: {
        name: "hours",
        label: "Hours Entry",
        fields: [
          {
            name: "days",
            type: "text",
            label: "Days",
            placeholder: "Mon - Fri",
          },
          {
            name: "time",
            type: "text",
            label: "Time",
            placeholder: "9:00 AM - 5:00 PM",
          },
        ],
      },
    },
    {
      name: "mapEmbed",
      type: "textarea",
      label: "Map Embed Code",
      group: "content",
      description: "Paste Google Maps or other map embed HTML",
      rows: 4,
    },
    {
      name: "showForm",
      type: "boolean",
      label: "Show Contact Form",
      group: "content",
      defaultValue: true,
    },
    {
      name: "layout",
      type: "select",
      label: "Layout",
      group: "style",
      options: [
        { label: "Side by Side", value: "side-by-side" },
        { label: "Stacked", value: "stacked" },
        { label: "Map Focus", value: "map-focus" },
      ],
      defaultValue: "side-by-side",
    },
  ],
};

export const teamBlockSchema: BlockSchema = {
  type: "team-block",
  label: "Team",
  category: "section",
  description: "Team members showcase",
  preview: { field: "title", fallback: "Our Team" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      defaultValue: "Meet Our Team",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "members",
      type: "array",
      label: "Team Members",
      group: "content",
      addLabel: "Add Member",
      collapsible: true,
      itemSchema: {
        name: "member",
        label: "Team Member",
        fields: [
          {
            name: "name",
            type: "text",
            label: "Name",
            validation: { required: true },
          },
          { name: "role", type: "text", label: "Role/Title" },
          { name: "bio", type: "textarea", label: "Bio", rows: 2 },
          { name: "photo", type: "media", label: "Photo", accept: ["image/*"] },
          { name: "email", type: "text", label: "Email", inputType: "email" },
          {
            name: "socialLinks",
            type: "array",
            label: "Social Links",
            addLabel: "Add Link",
            itemSchema: {
              name: "social",
              label: "Social Link",
              fields: [
                {
                  name: "platform",
                  type: "select",
                  label: "Platform",
                  options: [
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "Twitter/X", value: "twitter" },
                    { label: "GitHub", value: "github" },
                    { label: "Website", value: "website" },
                  ],
                },
                { name: "url", type: "text", label: "URL", inputType: "url" },
              ],
            },
          },
        ],
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
      defaultValue: 4,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Grid", value: "grid" },
        { label: "Minimal", value: "minimal" },
      ],
      defaultValue: "cards",
    },
  ],
};

export const logoGridBlockSchema: BlockSchema = {
  type: "logo-cloud-block",
  label: "Logo Cloud",
  category: "section",
  description: "Partner/client logo showcase",
  preview: { field: "title", fallback: "Logo Grid" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      placeholder: "Trusted by leading companies",
    },
    {
      name: "logos",
      type: "array",
      label: "Logos",
      group: "content",
      addLabel: "Add Logo",
      itemSchema: {
        name: "logo",
        label: "Logo",
        fields: [
          {
            name: "image",
            type: "media",
            label: "Logo Image",
            accept: ["image/*"],
            validation: { required: true },
          },
          { name: "name", type: "text", label: "Company Name" },
          { name: "url", type: "text", label: "Link URL", inputType: "url" },
        ],
      },
    },
    {
      name: "grayscale",
      type: "boolean",
      label: "Grayscale Logos",
      group: "style",
      defaultValue: true,
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "4 Columns", value: 4 },
        { label: "5 Columns", value: 5 },
        { label: "6 Columns", value: 6 },
      ],
      defaultValue: 5,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Carousel", value: "carousel" },
        { label: "Marquee", value: "marquee" },
      ],
      defaultValue: "grid",
    },
  ],
};

export const newsletterBlockSchema: BlockSchema = {
  type: "newsletter-block",
  label: "Newsletter",
  category: "section",
  description: "Email subscription form",
  preview: { field: "title", fallback: "Newsletter" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      defaultValue: "Subscribe to our newsletter",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "placeholder",
      type: "text",
      label: "Input Placeholder",
      group: "content",
      defaultValue: "Enter your email",
    },
    {
      name: "buttonText",
      type: "text",
      label: "Button Text",
      group: "content",
      defaultValue: "Subscribe",
    },
    {
      name: "successMessage",
      type: "text",
      label: "Success Message",
      group: "content",
      defaultValue: "Thanks for subscribing!",
    },
    {
      name: "formAction",
      type: "text",
      label: "Form Action URL",
      group: "advanced",
      description: "Endpoint to submit the form to",
      inputType: "url",
    },
    {
      name: "integrationId",
      type: "text",
      label: "Integration ID",
      group: "advanced",
      description: "Mailchimp, ConvertKit, etc. list ID",
    },
    {
      name: "showName",
      type: "boolean",
      label: "Ask for Name",
      group: "content",
      defaultValue: false,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Inline", value: "inline" },
        { label: "Stacked", value: "stacked" },
        { label: "Card", value: "card" },
      ],
      defaultValue: "inline",
    },
    {
      name: "style.backgroundColor",
      type: "color",
      label: "Background",
      group: "style",
      presets: ["transparent", "#f9fafb", "#1f2937", "#3b82f6"],
      allowCustom: true,
    },
  ],
};

export const galleryBlockSchema: BlockSchema = {
  type: "gallery-block",
  label: "Gallery",
  category: "section",
  description: "Image gallery with lightbox",
  preview: { field: "title", fallback: "Gallery" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "images",
      type: "array",
      label: "Images",
      group: "content",
      addLabel: "Add Image",
      itemSchema: {
        name: "image",
        label: "Gallery Image",
        fields: [
          {
            name: "src",
            type: "media",
            label: "Image",
            accept: ["image/*"],
            validation: { required: true },
          },
          { name: "alt", type: "text", label: "Alt Text" },
          { name: "caption", type: "text", label: "Caption" },
        ],
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
      defaultValue: 3,
    },
    {
      name: "gap",
      type: "select",
      label: "Gap",
      group: "style",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "2" },
        { label: "Medium", value: "4" },
        { label: "Large", value: "6" },
      ],
      defaultValue: "4",
    },
    {
      name: "variant",
      type: "select",
      label: "Layout",
      group: "style",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Masonry", value: "masonry" },
        { label: "Carousel", value: "carousel" },
      ],
      defaultValue: "grid",
    },
    {
      name: "lightbox",
      type: "boolean",
      label: "Enable Lightbox",
      group: "content",
      defaultValue: true,
    },
  ],
};

// ============================================================================
// FORM BLOCKS
// ============================================================================

export const formBlockSchema: BlockSchema = {
  type: "form-block",
  label: "Form",
  category: "interactive",
  description: "Custom form builder",
  preview: { field: "title", fallback: "Form" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Form Title",
      group: "content",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "fields",
      type: "array",
      label: "Form Fields",
      group: "content",
      addLabel: "Add Field",
      collapsible: true,
      itemSchema: {
        name: "field",
        label: "Form Field",
        fields: [
          {
            name: "label",
            type: "text",
            label: "Label",
            validation: { required: true },
          },
          {
            name: "name",
            type: "text",
            label: "Field Name",
            description: "Used for form submission",
          },
          {
            name: "type",
            type: "select",
            label: "Field Type",
            options: [
              { label: "Text", value: "text" },
              { label: "Email", value: "email" },
              { label: "Phone", value: "tel" },
              { label: "Number", value: "number" },
              { label: "Textarea", value: "textarea" },
              { label: "Select", value: "select" },
              { label: "Checkbox", value: "checkbox" },
              { label: "Radio", value: "radio" },
              { label: "Date", value: "date" },
              { label: "File", value: "file" },
            ],
            defaultValue: "text",
          },
          { name: "placeholder", type: "text", label: "Placeholder" },
          {
            name: "required",
            type: "boolean",
            label: "Required",
            defaultValue: false,
          },
          {
            name: "options",
            type: "textarea",
            label: "Options",
            description: "One per line (for select/radio)",
            rows: 3,
          },
          {
            name: "width",
            type: "select",
            label: "Width",
            options: [
              { label: "Full", value: "full" },
              { label: "Half", value: "half" },
              { label: "Third", value: "third" },
            ],
            defaultValue: "full",
          },
        ],
      },
    },
    {
      name: "submitText",
      type: "text",
      label: "Submit Button Text",
      group: "content",
      defaultValue: "Submit",
    },
    {
      name: "successMessage",
      type: "text",
      label: "Success Message",
      group: "content",
      defaultValue: "Thank you for your submission!",
    },
    {
      name: "action",
      type: "text",
      label: "Form Action URL",
      group: "advanced",
      inputType: "url",
      description: "Where to submit the form data",
    },
    {
      name: "method",
      type: "select",
      label: "Method",
      group: "advanced",
      options: [
        { label: "POST", value: "POST" },
        { label: "GET", value: "GET" },
      ],
      defaultValue: "POST",
    },
    {
      name: "emailTo",
      type: "text",
      label: "Email Submissions To",
      group: "advanced",
      inputType: "email",
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Default", value: "default" },
        { label: "Card", value: "card" },
        { label: "Minimal", value: "minimal" },
      ],
      defaultValue: "default",
    },
  ],
};

// ============================================================================
// NAVIGATION BLOCKS
// ============================================================================

export const navigationBlockSchema: BlockSchema = {
  type: "navigation-block",
  label: "Navigation",
  category: "layout",
  description: "Header navigation bar",
  preview: { field: "logoText", fallback: "Navigation" },
  fields: [
    {
      name: "logo",
      type: "media",
      label: "Logo Image",
      group: "content",
      accept: ["image/*"],
    },
    {
      name: "logoText",
      type: "text",
      label: "Logo Text",
      group: "content",
      description: "Fallback if no logo image",
    },
    {
      name: "links",
      type: "array",
      label: "Navigation Links",
      group: "content",
      addLabel: "Add Link",
      collapsible: true,
      itemSchema: {
        name: "link",
        label: "Nav Link",
        fields: [
          {
            name: "label",
            type: "text",
            label: "Label",
            validation: { required: true },
          },
          { name: "url", type: "text", label: "URL" },
          {
            name: "target",
            type: "select",
            label: "Open In",
            options: [
              { label: "Same Tab", value: "_self" },
              { label: "New Tab", value: "_blank" },
            ],
            defaultValue: "_self",
          },
          {
            name: "children",
            type: "array",
            label: "Dropdown Items",
            addLabel: "Add Item",
            itemSchema: {
              name: "child",
              label: "Dropdown Item",
              fields: [
                { name: "label", type: "text", label: "Label" },
                { name: "url", type: "text", label: "URL" },
                { name: "description", type: "text", label: "Description" },
              ],
            },
          },
        ],
      },
    },
    {
      name: "ctaButton",
      type: "boolean",
      label: "Show CTA Button",
      group: "content",
      defaultValue: true,
    },
    {
      name: "ctaText",
      type: "text",
      label: "CTA Button Text",
      group: "content",
      defaultValue: "Get Started",
    },
    {
      name: "ctaUrl",
      type: "text",
      label: "CTA Button URL",
      group: "content",
      inputType: "url",
    },
    {
      name: "sticky",
      type: "boolean",
      label: "Sticky Header",
      group: "style",
      defaultValue: true,
    },
    {
      name: "transparent",
      type: "boolean",
      label: "Transparent Background",
      group: "style",
      defaultValue: false,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Default", value: "default" },
        { label: "Centered", value: "centered" },
        { label: "Minimal", value: "minimal" },
      ],
      defaultValue: "default",
    },
  ],
};

export const footerBlockSchema: BlockSchema = {
  type: "footer-block",
  label: "Footer",
  category: "layout",
  description: "Site footer with links and info",
  preview: { field: "companyName", fallback: "Footer" },
  fields: [
    {
      name: "logo",
      type: "media",
      label: "Logo",
      group: "content",
      accept: ["image/*"],
    },
    {
      name: "companyName",
      type: "text",
      label: "Company Name",
      group: "content",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
      rows: 2,
    },
    {
      name: "columns",
      type: "array",
      label: "Link Columns",
      group: "content",
      addLabel: "Add Column",
      collapsible: true,
      maxItems: 4,
      itemSchema: {
        name: "column",
        label: "Footer Column",
        fields: [
          { name: "title", type: "text", label: "Column Title" },
          {
            name: "links",
            type: "array",
            label: "Links",
            addLabel: "Add Link",
            itemSchema: {
              name: "link",
              label: "Link",
              fields: [
                { name: "label", type: "text", label: "Label" },
                { name: "url", type: "text", label: "URL" },
              ],
            },
          },
        ],
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social Links",
      group: "content",
      addLabel: "Add Social",
      itemSchema: {
        name: "social",
        label: "Social Link",
        fields: [
          {
            name: "platform",
            type: "select",
            label: "Platform",
            options: [
              { label: "Facebook", value: "facebook" },
              { label: "Twitter/X", value: "twitter" },
              { label: "Instagram", value: "instagram" },
              { label: "LinkedIn", value: "linkedin" },
              { label: "YouTube", value: "youtube" },
              { label: "GitHub", value: "github" },
              { label: "TikTok", value: "tiktok" },
            ],
          },
          { name: "url", type: "text", label: "URL", inputType: "url" },
        ],
      },
    },
    {
      name: "copyright",
      type: "text",
      label: "Copyright Text",
      group: "content",
      placeholder: "© 2024 Company Name. All rights reserved.",
    },
    {
      name: "bottomLinks",
      type: "array",
      label: "Bottom Links",
      group: "content",
      addLabel: "Add Link",
      itemSchema: {
        name: "link",
        label: "Bottom Link",
        fields: [
          { name: "label", type: "text", label: "Label" },
          { name: "url", type: "text", label: "URL" },
        ],
      },
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Default", value: "default" },
        { label: "Simple", value: "simple" },
        { label: "Centered", value: "centered" },
      ],
      defaultValue: "default",
    },
    {
      name: "style.backgroundColor",
      type: "color",
      label: "Background",
      group: "style",
      presets: ["#111827", "#1f2937", "#ffffff", "#f9fafb"],
      allowCustom: true,
    },
  ],
};

export const socialLinksBlockSchema: BlockSchema = {
  type: "social-links-block",
  label: "Social Links",
  category: "content",
  description: "Social media links with icons",
  fields: [
    {
      name: "links",
      type: "array",
      label: "Social Links",
      group: "content",
      addLabel: "Add Link",
      itemSchema: {
        name: "link",
        label: "Social Link",
        fields: [
          {
            name: "platform",
            type: "select",
            label: "Platform",
            options: [
              { label: "Facebook", value: "facebook" },
              { label: "Twitter/X", value: "twitter" },
              { label: "Instagram", value: "instagram" },
              { label: "LinkedIn", value: "linkedin" },
              { label: "YouTube", value: "youtube" },
              { label: "GitHub", value: "github" },
              { label: "TikTok", value: "tiktok" },
              { label: "Discord", value: "discord" },
              { label: "Twitch", value: "twitch" },
              { label: "WhatsApp", value: "whatsapp" },
              { label: "Telegram", value: "telegram" },
            ],
            validation: { required: true },
          },
          {
            name: "url",
            type: "text",
            label: "URL",
            inputType: "url",
            validation: { required: true },
          },
          { name: "label", type: "text", label: "Accessible Label" },
        ],
      },
    },
    {
      name: "size",
      type: "select",
      label: "Icon Size",
      group: "style",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Icons Only", value: "icons" },
        { label: "Filled", value: "filled" },
        { label: "Outline", value: "outline" },
      ],
      defaultValue: "icons",
    },
    {
      name: "alignment",
      type: "select",
      label: "Alignment",
      group: "style",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
      defaultValue: "center",
    },
  ],
};

// ============================================================================
// ECOMMERCE BLOCKS
// ============================================================================

export const productCardBlockSchema: BlockSchema = {
  type: "product-card-block",
  label: "Product Card",
  category: "content",
  description: "Single product display card",
  preview: { field: "name", fallback: "Product" },
  fields: [
    {
      name: "image",
      type: "media",
      label: "Product Image",
      group: "content",
      accept: ["image/*"],
    },
    {
      name: "name",
      type: "text",
      label: "Product Name",
      group: "content",
      validation: { required: true },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
      rows: 2,
    },
    {
      name: "price",
      type: "text",
      label: "Price",
      group: "content",
      placeholder: "$99.00",
    },
    {
      name: "originalPrice",
      type: "text",
      label: "Original Price",
      group: "content",
      description: "For sale items",
    },
    {
      name: "badge",
      type: "text",
      label: "Badge",
      group: "content",
      placeholder: "Sale, New, etc.",
    },
    {
      name: "rating",
      type: "number",
      label: "Rating",
      group: "content",
      min: 0,
      max: 5,
      step: 0.1,
    },
    {
      name: "reviewCount",
      type: "number",
      label: "Review Count",
      group: "content",
    },
    {
      name: "url",
      type: "text",
      label: "Product URL",
      group: "content",
      inputType: "url",
    },
    {
      name: "buttonText",
      type: "text",
      label: "Button Text",
      group: "content",
      defaultValue: "Add to Cart",
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Default", value: "default" },
        { label: "Minimal", value: "minimal" },
        { label: "Horizontal", value: "horizontal" },
      ],
      defaultValue: "default",
    },
  ],
};

export const productGridBlockSchema: BlockSchema = {
  type: "product-grid-block",
  label: "Product Grid",
  category: "section",
  description: "Grid of products",
  preview: { field: "title", fallback: "Products" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      group: "content",
    },
    {
      name: "products",
      type: "array",
      label: "Products",
      group: "content",
      addLabel: "Add Product",
      collapsible: true,
      itemSchema: {
        name: "product",
        label: "Product",
        fields: [
          { name: "image", type: "media", label: "Image", accept: ["image/*"] },
          {
            name: "name",
            type: "text",
            label: "Name",
            validation: { required: true },
          },
          { name: "price", type: "text", label: "Price" },
          { name: "originalPrice", type: "text", label: "Original Price" },
          { name: "badge", type: "text", label: "Badge" },
          { name: "url", type: "text", label: "URL", inputType: "url" },
        ],
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Columns",
      group: "style",
      options: [
        { label: "2 Columns", value: 2 },
        { label: "3 Columns", value: 3 },
        { label: "4 Columns", value: 4 },
      ],
      defaultValue: 4,
    },
    {
      name: "showFilters",
      type: "boolean",
      label: "Show Filters",
      group: "content",
      defaultValue: false,
    },
    {
      name: "showSort",
      type: "boolean",
      label: "Show Sort",
      group: "content",
      defaultValue: false,
    },
  ],
};

// ============================================================================
// UTILITY BLOCKS
// ============================================================================

export const codeBlockSchema: BlockSchema = {
  type: "code-block",
  label: "Code Block",
  category: "content",
  description: "Syntax highlighted code snippet",
  preview: { field: "title", fallback: "Code" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      placeholder: "Optional filename or title",
    },
    {
      name: "code",
      type: "textarea",
      label: "Code",
      group: "content",
      rows: 10,
      validation: { required: true },
    },
    {
      name: "language",
      type: "select",
      label: "Language",
      group: "content",
      options: [
        { label: "JavaScript", value: "javascript" },
        { label: "TypeScript", value: "typescript" },
        { label: "Python", value: "python" },
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "JSON", value: "json" },
        { label: "Bash", value: "bash" },
        { label: "SQL", value: "sql" },
        { label: "Go", value: "go" },
        { label: "Rust", value: "rust" },
        { label: "Java", value: "java" },
        { label: "PHP", value: "php" },
        { label: "Ruby", value: "ruby" },
        { label: "YAML", value: "yaml" },
        { label: "Markdown", value: "markdown" },
      ],
      defaultValue: "javascript",
    },
    {
      name: "showLineNumbers",
      type: "boolean",
      label: "Show Line Numbers",
      group: "style",
      defaultValue: true,
    },
    {
      name: "showCopyButton",
      type: "boolean",
      label: "Show Copy Button",
      group: "style",
      defaultValue: true,
    },
    {
      name: "theme",
      type: "select",
      label: "Theme",
      group: "style",
      options: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
        { label: "GitHub", value: "github" },
        { label: "Dracula", value: "dracula" },
      ],
      defaultValue: "dark",
    },
  ],
};

export const tableBlockSchema: BlockSchema = {
  type: "table-block",
  label: "Table",
  category: "content",
  description: "Data table with headers",
  preview: { field: "caption", fallback: "Table" },
  fields: [
    {
      name: "caption",
      type: "text",
      label: "Caption",
      group: "content",
    },
    {
      name: "headers",
      type: "array",
      label: "Headers",
      group: "content",
      addLabel: "Add Column",
      itemSchema: {
        name: "header",
        label: "Header",
        fields: [
          { name: "label", type: "text", label: "Column Name" },
          {
            name: "align",
            type: "select",
            label: "Alignment",
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
            defaultValue: "left",
          },
        ],
      },
    },
    {
      name: "rows",
      type: "array",
      label: "Rows",
      group: "content",
      addLabel: "Add Row",
      itemSchema: {
        name: "row",
        label: "Row",
        fields: [
          {
            name: "cells",
            type: "array",
            label: "Cells",
            addLabel: "Add Cell",
            itemSchema: {
              name: "cell",
              label: "Cell",
              fields: [{ name: "value", type: "text", label: "Value" }],
            },
          },
        ],
      },
    },
    {
      name: "striped",
      type: "boolean",
      label: "Striped Rows",
      group: "style",
      defaultValue: true,
    },
    {
      name: "bordered",
      type: "boolean",
      label: "Show Borders",
      group: "style",
      defaultValue: true,
    },
    {
      name: "hoverable",
      type: "boolean",
      label: "Hover Effect",
      group: "style",
      defaultValue: true,
    },
  ],
};

export const embedBlockSchema: BlockSchema = {
  type: "embed-block",
  label: "Embed",
  category: "content",
  description: "Embed external content",
  preview: { field: "title", fallback: "Embed" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
      description: "For accessibility",
    },
    {
      name: "embedType",
      type: "select",
      label: "Embed Type",
      group: "content",
      options: [
        { label: "HTML/iframe", value: "html" },
        { label: "YouTube", value: "youtube" },
        { label: "Vimeo", value: "vimeo" },
        { label: "Twitter/X", value: "twitter" },
        { label: "Spotify", value: "spotify" },
        { label: "SoundCloud", value: "soundcloud" },
        { label: "CodePen", value: "codepen" },
        { label: "Figma", value: "figma" },
        { label: "Google Maps", value: "googlemaps" },
        { label: "Calendly", value: "calendly" },
      ],
      defaultValue: "html",
    },
    {
      name: "url",
      type: "text",
      label: "URL or ID",
      group: "content",
      description: "URL or embed ID for the content",
    },
    {
      name: "html",
      type: "textarea",
      label: "HTML Code",
      group: "content",
      description: "Raw HTML embed code",
      rows: 6,
    },
    {
      name: "aspectRatio",
      type: "select",
      label: "Aspect Ratio",
      group: "style",
      options: [
        { label: "16:9", value: "16/9" },
        { label: "4:3", value: "4/3" },
        { label: "1:1", value: "1/1" },
        { label: "9:16", value: "9/16" },
        { label: "Auto", value: "auto" },
      ],
      defaultValue: "16/9",
    },
    {
      name: "maxWidth",
      type: "select",
      label: "Max Width",
      group: "style",
      options: [
        { label: "Full", value: "100%" },
        { label: "Large", value: "800px" },
        { label: "Medium", value: "600px" },
        { label: "Small", value: "400px" },
      ],
      defaultValue: "100%",
    },
  ],
};

export const countdownBlockSchema: BlockSchema = {
  type: "countdown-block",
  label: "Countdown",
  category: "interactive",
  description: "Countdown timer to a date",
  preview: { field: "title", fallback: "Countdown" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "targetDate",
      type: "text",
      label: "Target Date",
      group: "content",
      inputType: "datetime-local",
      validation: { required: true },
    },
    {
      name: "expiredMessage",
      type: "text",
      label: "Expired Message",
      group: "content",
      defaultValue: "The event has started!",
    },
    {
      name: "showDays",
      type: "boolean",
      label: "Show Days",
      group: "content",
      defaultValue: true,
    },
    {
      name: "showHours",
      type: "boolean",
      label: "Show Hours",
      group: "content",
      defaultValue: true,
    },
    {
      name: "showMinutes",
      type: "boolean",
      label: "Show Minutes",
      group: "content",
      defaultValue: true,
    },
    {
      name: "showSeconds",
      type: "boolean",
      label: "Show Seconds",
      group: "content",
      defaultValue: true,
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Cards", value: "cards" },
        { label: "Simple", value: "simple" },
        { label: "Circle", value: "circle" },
      ],
      defaultValue: "cards",
    },
  ],
};

export const alertBlockSchema: BlockSchema = {
  type: "alert-block",
  label: "Alert",
  category: "content",
  description: "Alert/notification banner",
  preview: { field: "message", fallback: "Alert" },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Title",
      group: "content",
    },
    {
      name: "message",
      type: "textarea",
      label: "Message",
      group: "content",
      validation: { required: true },
      rows: 2,
    },
    {
      name: "type",
      type: "select",
      label: "Type",
      group: "content",
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
      defaultValue: "info",
    },
    {
      name: "dismissible",
      type: "boolean",
      label: "Dismissible",
      group: "content",
      defaultValue: false,
    },
    {
      name: "icon",
      type: "boolean",
      label: "Show Icon",
      group: "style",
      defaultValue: true,
    },
  ],
};

export const breadcrumbBlockSchema: BlockSchema = {
  type: "breadcrumb-block",
  label: "Breadcrumb",
  category: "layout",
  description: "Navigation breadcrumbs",
  fields: [
    {
      name: "items",
      type: "array",
      label: "Breadcrumb Items",
      group: "content",
      addLabel: "Add Item",
      itemSchema: {
        name: "item",
        label: "Breadcrumb Item",
        fields: [
          {
            name: "label",
            type: "text",
            label: "Label",
            validation: { required: true },
          },
          {
            name: "url",
            type: "text",
            label: "URL",
            description: "Leave empty for current page",
          },
        ],
      },
    },
    {
      name: "separator",
      type: "select",
      label: "Separator",
      group: "style",
      options: [
        { label: "Slash (/)", value: "slash" },
        { label: "Chevron (>)", value: "chevron" },
        { label: "Arrow (→)", value: "arrow" },
        { label: "Dot (·)", value: "dot" },
      ],
      defaultValue: "chevron",
    },
    {
      name: "showHome",
      type: "boolean",
      label: "Show Home Icon",
      group: "content",
      defaultValue: true,
    },
  ],
};

export const progressBlockSchema: BlockSchema = {
  type: "progress-block",
  label: "Progress",
  category: "content",
  description: "Progress bar or indicator",
  preview: { field: "label", fallback: "Progress" },
  fields: [
    {
      name: "label",
      type: "text",
      label: "Label",
      group: "content",
    },
    {
      name: "value",
      type: "number",
      label: "Value",
      group: "content",
      min: 0,
      max: 100,
      defaultValue: 50,
    },
    {
      name: "showValue",
      type: "boolean",
      label: "Show Percentage",
      group: "content",
      defaultValue: true,
    },
    {
      name: "size",
      type: "select",
      label: "Size",
      group: "style",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      name: "variant",
      type: "select",
      label: "Style",
      group: "style",
      options: [
        { label: "Bar", value: "bar" },
        { label: "Circle", value: "circle" },
        { label: "Steps", value: "steps" },
      ],
      defaultValue: "bar",
    },
    {
      name: "style.color",
      type: "color",
      label: "Color",
      group: "style",
      presets: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      allowCustom: true,
    },
  ],
};

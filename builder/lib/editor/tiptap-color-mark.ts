import { Mark, mergeAttributes } from "@tiptap/core";

/**
 * ColorMark — TipTap mark for inline text coloring
 *
 * Allows setting color on selected text within headings/paragraphs.
 * Renders as <span style="color: #hex"> wrapping the colored text.
 */
export const ColorMark = Mark.create({
  name: "colorMark",

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) =>
          element.style.color || element.getAttribute("data-color"),
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `color: ${attributes.color}`,
            "data-color": attributes.color,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-color]",
      },
      {
        tag: "span[style*=color]",
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const color = el.style.color;
          return color ? { color } : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes),
      0,
    ];
  },
});

import { blockRegistry, type BlockRegistration } from "./block-registry";

/**
 * Implemented Block Registrations
 *
 * Only register blocks that have editor components implemented.
 * As we build more editors, move them from block-registrations.ts to here.
 *
 * This keeps the registry working while we build out the full system.
 */

const implementedBlocks: BlockRegistration[] = [
  {
    type: "button-block",
    displayName: "Button",
    category: "content",
    icon: "MousePointerClick",
    description: "Call-to-action button with link",
    component: () =>
      import("@/components/blocks/button-block-editor").then((mod) => ({
        // Cast to fix type compatibility
        default: mod.ButtonBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `button-${Date.now()}`,
      _type: "button-block",
      data: {
        text: "Click me",
        href: "#",
        variant: "default",
        size: "default",
        fullWidth: false,
        openInNewTab: false,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "spacer-block",
    displayName: "Spacer",
    category: "content",
    icon: "Space",
    description: "Vertical spacing",
    component: () =>
      import("@/components/blocks/spacer-block-editor").then((mod) => ({
        default: mod.SpacerBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `spacer-${Date.now()}`,
      _type: "spacer-block",
      data: {
        height: "md",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "divider-block",
    displayName: "Divider",
    category: "content",
    icon: "Minus",
    description: "Horizontal line separator",
    component: () =>
      import("@/components/blocks/divider-block-editor").then((mod) => ({
        default: mod.DividerBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `divider-${Date.now()}`,
      _type: "divider-block",
      data: {
        style: "solid",
        thickness: "thin",
        spacing: "md",
        color: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "text-block",
    displayName: "Text",
    category: "content",
    icon: "Type",
    description: "Simple paragraph text",
    component: () =>
      import("@/components/blocks/text-block-editor").then((mod) => ({
        default: mod.TextBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `text-${Date.now()}`,
      _type: "text-block",
      data: {
        text: "Your text here",
        size: "md",
        align: "left",
        variant: "body",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "heading-block",
    displayName: "Heading",
    category: "content",
    icon: "Heading",
    description: "Section heading (H1-H6)",
    component: () =>
      import("@/components/blocks/heading-block-editor").then((mod) => ({
        default: mod.HeadingBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `heading-${Date.now()}`,
      _type: "heading-block",
      data: {
        text: "Heading",
        level: "h2",
        size: "2xl",
        align: "left",
        weight: "semibold",
        color: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "image-block",
    displayName: "Image",
    category: "media",
    icon: "Image",
    description: "Image with caption and link",
    component: () =>
      import("@/components/blocks/image-block-editor").then((mod) => ({
        default: mod.ImageBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `image-${Date.now()}`,
      _type: "image-block",
      data: {
        src: "",
        alt: "",
        aspectRatio: "16/9",
        objectFit: "cover",
        rounded: false,
      },
    }),
    tier: "CONTENT_EDITOR",
  },
];

/**
 * Register implemented blocks on module load
 */
blockRegistry.registerMany(implementedBlocks);

/**
 * Export for external use
 */
export { implementedBlocks };

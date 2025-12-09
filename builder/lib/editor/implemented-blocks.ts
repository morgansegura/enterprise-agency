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

  {
    type: "rich-text-block",
    displayName: "Rich Text",
    category: "content",
    icon: "Type",
    description: "Formatted text with rich editing",
    component: () =>
      import("@/components/blocks/rich-text-block-editor").then((mod) => ({
        default: mod.RichTextBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `rich-text-${Date.now()}`,
      _type: "rich-text-block",
      data: {
        html: "<p>Start typing...</p>",
        size: "md",
        align: "left",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "quote-block",
    displayName: "Quote",
    category: "content",
    icon: "Quote",
    description: "Blockquote with attribution",
    component: () =>
      import("@/components/blocks/quote-block-editor").then((mod) => ({
        default: mod.QuoteBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `quote-${Date.now()}`,
      _type: "quote-block",
      data: {
        text: "Insert your quote here...",
        size: "md",
        align: "left",
        variant: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "list-block",
    displayName: "List",
    category: "content",
    icon: "List",
    description: "Bulleted or numbered list",
    component: () =>
      import("@/components/blocks/list-block-editor").then((mod) => ({
        default: mod.ListBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `list-${Date.now()}`,
      _type: "list-block",
      data: {
        items: [
          { text: "First item" },
          { text: "Second item" },
          { text: "Third item" },
        ],
        ordered: false,
        style: "default",
        spacing: "comfortable",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "icon-block",
    displayName: "Icon",
    category: "content",
    icon: "Sparkles",
    description: "Icon with optional label",
    component: () =>
      import("@/components/blocks/icon-block-editor").then((mod) => ({
        default: mod.IconBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `icon-${Date.now()}`,
      _type: "icon-block",
      data: {
        icon: "Star",
        size: "md",
        color: "default",
        align: "center",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "card-block",
    displayName: "Card",
    category: "content",
    icon: "CreditCard",
    description: "Card with image, title, and description",
    component: () =>
      import("@/components/blocks/card-block-editor").then((mod) => ({
        default: mod.CardBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `card-${Date.now()}`,
      _type: "card-block",
      data: {
        title: "Card Title",
        description: "Card description goes here...",
        variant: "default",
        padding: "md",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "video-block",
    displayName: "Video",
    category: "media",
    icon: "Video",
    description: "YouTube, Vimeo, or direct video",
    component: () =>
      import("@/components/blocks/video-block-editor").then((mod) => ({
        default: mod.VideoBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `video-${Date.now()}`,
      _type: "video-block",
      data: {
        url: "",
        provider: "youtube",
        aspectRatio: "16/9",
        controls: true,
        autoplay: false,
        muted: false,
        loop: false,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "audio-block",
    displayName: "Audio",
    category: "media",
    icon: "Music",
    description: "Audio player with title and artist",
    component: () =>
      import("@/components/blocks/audio-block-editor").then((mod) => ({
        default: mod.AudioBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `audio-${Date.now()}`,
      _type: "audio-block",
      data: {
        src: "",
        controls: true,
        autoplay: false,
        loop: false,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "embed-block",
    displayName: "Embed",
    category: "media",
    icon: "Code",
    description: "Embed code (iframe, scripts)",
    component: () =>
      import("@/components/blocks/embed-block-editor").then((mod) => ({
        default: mod.EmbedBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `embed-${Date.now()}`,
      _type: "embed-block",
      data: {
        html: "",
        aspectRatio: "16/9",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "accordion-block",
    displayName: "Accordion",
    category: "interactive",
    icon: "ChevronDown",
    description: "Collapsible content sections",
    component: () =>
      import("@/components/blocks/accordion-block-editor").then((mod) => ({
        default: mod.AccordionBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `accordion-${Date.now()}`,
      _type: "accordion-block",
      data: {
        items: [
          {
            title: "First item",
            content: "Content here...",
            defaultOpen: false,
          },
          {
            title: "Second item",
            content: "Content here...",
            defaultOpen: false,
          },
        ],
        allowMultiple: false,
        variant: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "tabs-block",
    displayName: "Tabs",
    category: "interactive",
    icon: "LayoutGrid",
    description: "Tabbed content",
    component: () =>
      import("@/components/blocks/tabs-block-editor").then((mod) => ({
        default: mod.TabsBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `tabs-${Date.now()}`,
      _type: "tabs-block",
      data: {
        tabs: [
          { label: "First tab", content: "Content here..." },
          { label: "Second tab", content: "Content here..." },
        ],
        defaultTab: 0,
        variant: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "stats-block",
    displayName: "Stats",
    category: "content",
    icon: "BarChart3",
    description: "Display statistics and metrics",
    component: () =>
      import("@/components/blocks/stats-block-editor").then((mod) => ({
        default: mod.StatsBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `stats-${Date.now()}`,
      _type: "stats-block",
      data: {
        stats: [
          {
            label: "Customers",
            value: "1000+",
            description: "Happy customers",
          },
          { label: "Projects", value: "50+", description: "Completed" },
          { label: "Years", value: "10+", description: "Experience" },
        ],
        layout: "horizontal",
        variant: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "logo-block",
    displayName: "Logo",
    category: "content",
    icon: "Image",
    description: "Logo image with optional link",
    component: () =>
      import("@/components/blocks/logo-block-editor").then((mod) => ({
        default: mod.LogoBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `logo-${Date.now()}`,
      _type: "logo-block",
      data: {
        src: "",
        alt: "Logo",
        size: "md",
        align: "left",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "map-block",
    displayName: "Map",
    category: "media",
    icon: "MapPin",
    description: "Interactive map with location",
    component: () =>
      import("@/components/blocks/map-block-editor").then((mod) => ({
        default: mod.MapBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `map-${Date.now()}`,
      _type: "map-block",
      data: {
        center: {
          lat: 40.7128,
          lng: -74.006,
        },
        zoom: 12,
        height: "md",
        style: "default",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "container-block",
    displayName: "Container",
    category: "layout",
    icon: "Box",
    description: "Container with max-width and padding",
    component: () =>
      import("@/components/blocks/container-block-editor").then((mod) => ({
        default: mod.ContainerBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `container-${Date.now()}`,
      _type: "container-block",
      data: {
        maxWidth: "full",
        padding: "md",
        background: "none",
        blocks: [],
      },
    }),
    tier: "BUILDER",
  },

  {
    type: "stack-block",
    displayName: "Stack",
    category: "layout",
    icon: "AlignVerticalSpaceAround",
    description: "Vertical stack layout with gap",
    component: () =>
      import("@/components/blocks/stack-block-editor").then((mod) => ({
        default: mod.StackBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `stack-${Date.now()}`,
      _type: "stack-block",
      data: {
        gap: "md",
        align: "start",
        blocks: [],
      },
    }),
    tier: "BUILDER",
  },

  {
    type: "flex-block",
    displayName: "Flex",
    category: "layout",
    icon: "Layers",
    description: "Flexbox layout with full control",
    component: () =>
      import("@/components/blocks/flex-block-editor").then((mod) => ({
        default: mod.FlexBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `flex-${Date.now()}`,
      _type: "flex-block",
      data: {
        direction: "row",
        justify: "start",
        align: "start",
        gap: "md",
        wrap: false,
        blocks: [],
      },
    }),
    tier: "BUILDER",
  },

  {
    type: "grid-block",
    displayName: "Grid",
    category: "layout",
    icon: "LayoutGrid",
    description: "CSS Grid layout with columns",
    component: () =>
      import("@/components/blocks/grid-block-editor").then((mod) => ({
        default: mod.GridBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `grid-${Date.now()}`,
      _type: "grid-block",
      data: {
        columns: "2",
        gap: "md",
        autoFlow: "row",
        blocks: [],
      },
    }),
    tier: "BUILDER",
  },

  {
    type: "columns-block",
    displayName: "Columns",
    category: "layout",
    icon: "Columns3",
    description: "Multi-column layout",
    component: () =>
      import("@/components/blocks/columns-block-editor").then((mod) => ({
        default: mod.ColumnsBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `columns-${Date.now()}`,
      _type: "columns-block",
      data: {
        count: "2",
        gap: "md",
        responsive: true,
        blocks: [],
      },
    }),
    tier: "BUILDER",
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

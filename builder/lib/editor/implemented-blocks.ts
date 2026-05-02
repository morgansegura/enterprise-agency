/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic imports require cast to match BlockEditorProps */
import { blockRegistry, type BlockRegistration } from "./block-registry";

/**
 * Implemented Block Registrations
 *
 * Block categories:
 * - content: Heading, Text, Rich Text, Button, List, Icon, Quote, Logo
 * - media: Image, Video, Audio, Embed, Map
 * - interactive: Accordion, Tabs
 * - layout: Box (container block that holds child blocks)
 * - functional: Contact Form, Social Links
 *
 * Compound blocks (card, hero, cta, pricing, testimonial, stats, team,
 * logo-bar, newsletter, feature-grid, faq) are deprecated.
 * Users build these compositions using Section → Container → Box → Blocks.
 * Existing pages using compound blocks still render via the renderer registry.
 */

const implementedBlocks: BlockRegistration[] = [
  // ========================================================================
  // Content blocks
  // ========================================================================
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
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "button-block",
    displayName: "Button",
    category: "content",
    icon: "MousePointerClick",
    description: "Call-to-action button with link",
    component: () =>
      import("@/components/blocks/button-block-editor").then((mod) => ({
        default: mod.ButtonBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `button-${Date.now()}`,
      _type: "button-block",
      data: {
        text: "Click me",
        href: "#",
        fullWidth: false,
        openInNewTab: false,
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
      data: {},
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
      data: {},
    }),
    tier: "CONTENT_EDITOR",
  },

  // ========================================================================
  // Media blocks
  // ========================================================================
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
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 12,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  // ========================================================================
  // Interactive blocks
  // ========================================================================
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
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  // ========================================================================
  // Layout block — Box (container that holds child blocks)
  // ========================================================================
  {
    type: "container-block",
    displayName: "Box",
    category: "layout",
    icon: "Square",
    description: "Container for grouping blocks (card, panel, wrapper)",
    isContainer: true,
    component: () =>
      import("@/components/blocks/container-block-editor").then((mod) => ({
        default: mod.ContainerBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `box-${Date.now()}`,
      _type: "container-block",
      data: {
        blocks: [],
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  // ========================================================================
  // Functional blocks
  // ========================================================================
  {
    type: "contact-form-block",
    displayName: "Contact Form",
    category: "content",
    icon: "Mail",
    description: "Contact form with name, email, message",
    component: () =>
      import("@/components/blocks/contact-form-block-editor").then((mod) => ({
        default: mod.ContactFormBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `contact-form-${Date.now()}`,
      _type: "contact-form-block",
      data: {
        heading: "Contact Us",
        description: "Send us a message and we'll get back to you.",
        fields: [
          { label: "Name", type: "text", required: true },
          { label: "Email", type: "email", required: true },
          { label: "Message", type: "textarea", required: true },
        ],
        submitText: "Send Message",
      },
    }),
  },

  {
    type: "social-links-block",
    displayName: "Social Links",
    category: "content",
    icon: "Share2",
    description: "Social media link icons",
    component: () =>
      import("@/components/blocks/social-links-block-editor").then((mod) => ({
        default: mod.SocialLinksBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `social-links-${Date.now()}`,
      _type: "social-links-block",
      data: {
        links: [
          { platform: "twitter", url: "https://twitter.com" },
          { platform: "linkedin", url: "https://linkedin.com" },
          { platform: "instagram", url: "https://instagram.com" },
        ],
      },
    }),
  },

  // ========================================================================
  // Navigation blocks — usable in headers, footers, sidebars, anywhere
  // ========================================================================
  {
    type: "menu-block",
    displayName: "Menu",
    category: "content",
    icon: "Menu",
    description:
      "Nav menu from Menus library — dropdowns, mega menus, animations",
    component: () =>
      import("@/components/blocks/menu-block-editor").then((mod) => ({
        default: mod.MenuBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `menu-${Date.now()}`,
      _type: "menu-block",
      data: {
        variant: "default",
        style: "horizontal",
        dropdownTrigger: "hover",
        dropdownAnimation: "slide",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "newsletter-block",
    displayName: "Newsletter",
    category: "specialized",
    icon: "Mail",
    description: "Email signup form with submission handling",
    component: () =>
      import("@/components/blocks/newsletter-block-editor").then((mod) => ({
        default: mod.NewsletterBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `newsletter-${Date.now()}`,
      _type: "newsletter-block",
      data: {
        heading: "Join our newsletter",
        description: "Get weekly updates in your inbox.",
        placeholder: "your@email.com",
        buttonText: "Subscribe",
        successMessage: "Thanks! Please check your inbox.",
        layout: "inline",
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

/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic imports require cast to match BlockEditorProps */
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
      data: {},
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
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "hero-block",
    displayName: "Hero",
    category: "content",
    icon: "Layout",
    description: "Landing page hero section",
    component: () =>
      import("@/components/blocks/hero-block-editor").then((mod) => ({
        default: mod.HeroBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `hero-${Date.now()}`,
      _type: "hero-block",
      data: {
        heading: "Your Headline Here",
        subheading: "Supporting text for your hero section",
        layout: "centered",
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "cta-block",
    displayName: "CTA",
    category: "content",
    icon: "Megaphone",
    description: "Call-to-action banner",
    component: () =>
      import("@/components/blocks/cta-block-editor").then((mod) => ({
        default: mod.CtaBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `cta-${Date.now()}`,
      _type: "cta-block",
      data: {
        heading: "Ready to get started?",
        description: "Join thousands of satisfied customers today.",
        primaryCta: { text: "Get Started", href: "#" },
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "testimonial-block",
    displayName: "Testimonials",
    category: "content",
    icon: "MessageSquareQuote",
    description: "Customer testimonials and reviews",
    component: () =>
      import("@/components/blocks/testimonial-block-editor").then((mod) => ({
        default: mod.TestimonialBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `testimonial-${Date.now()}`,
      _type: "testimonial-block",
      data: {
        testimonials: [
          {
            quote: "This product changed everything for us.",
            name: "Jane Smith",
            role: "CEO",
            company: "Acme Inc.",
            rating: 5,
          },
        ],
        showRating: true,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "pricing-block",
    displayName: "Pricing",
    category: "content",
    icon: "DollarSign",
    description: "Pricing table with tiers",
    component: () =>
      import("@/components/blocks/pricing-block-editor").then((mod) => ({
        default: mod.PricingBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `pricing-${Date.now()}`,
      _type: "pricing-block",
      data: {
        tiers: [
          {
            name: "Starter",
            price: "$29",
            period: "/month",
            features: ["Feature one", "Feature two"],
            cta: { text: "Get Started", href: "#" },
          },
          {
            name: "Pro",
            price: "$79",
            period: "/month",
            features: ["Everything in Starter", "Feature three", "Feature four"],
            cta: { text: "Go Pro", href: "#" },
            highlighted: true,
          },
        ],
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "team-block",
    displayName: "Team",
    category: "content",
    icon: "Users",
    description: "Team member grid",
    component: () =>
      import("@/components/blocks/team-block-editor").then((mod) => ({
        default: mod.TeamBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `team-${Date.now()}`,
      _type: "team-block",
      data: {
        members: [
          { name: "Team Member", role: "Role Title" },
        ],
        showBio: false,
        showSocial: false,
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  {
    type: "logo-bar-block",
    displayName: "Logo Bar",
    category: "content",
    icon: "Grip",
    description: "Client or partner logo strip",
    component: () =>
      import("@/components/blocks/logo-bar-block-editor").then((mod) => ({
        default: mod.LogoBarBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `logo-bar-${Date.now()}`,
      _type: "logo-bar-block",
      data: {
        logos: [],
      },
    }),
    tier: "CONTENT_EDITOR",
  },

  // Layout blocks (container, stack, flex, grid, columns) removed from picker.
  // Layout is handled at the container level — each section can have multiple
  // containers with their own layout type (stack/flex/grid) set in container settings.

  // ========================================================================
  // New blocks — forms, content display, navigation
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
    type: "newsletter-block",
    displayName: "Newsletter",
    category: "content",
    icon: "Mail",
    description: "Email signup with CTA",
    component: () =>
      import("@/components/blocks/contact-form-block-editor").then((mod) => ({
        default: mod.ContactFormBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `newsletter-${Date.now()}`,
      _type: "newsletter-block",
      data: {
        heading: "Subscribe to our newsletter",
        description: "Get the latest updates delivered to your inbox.",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
      },
    }),
  },
  {
    type: "feature-grid-block",
    displayName: "Feature Grid",
    category: "content",
    icon: "LayoutGrid",
    description: "Grid of feature cards with icons",
    component: () =>
      import("@/components/blocks/contact-form-block-editor").then((mod) => ({
        default: mod.ContactFormBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `feature-grid-${Date.now()}`,
      _type: "feature-grid-block",
      data: {
        heading: "Our Features",
        description: "What makes us different",
        features: [
          { icon: "⚡", title: "Fast", description: "Lightning-fast performance" },
          { icon: "🔒", title: "Secure", description: "Enterprise-grade security" },
          { icon: "📱", title: "Responsive", description: "Works on any device" },
        ],
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
      import("@/components/blocks/contact-form-block-editor").then((mod) => ({
        default: mod.ContactFormBlockEditor as any,
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
  {
    type: "faq-block",
    displayName: "FAQ",
    category: "content",
    icon: "HelpCircle",
    description: "Frequently asked questions",
    component: () =>
      import("@/components/blocks/contact-form-block-editor").then((mod) => ({
        default: mod.ContactFormBlockEditor as any,
      })),
    createDefault: () => ({
      _key: `faq-${Date.now()}`,
      _type: "faq-block",
      data: {
        heading: "Frequently Asked Questions",
        description: "Find answers to common questions",
        items: [
          { question: "What is this?", answer: "This is an example FAQ item." },
          { question: "How does it work?", answer: "Click on a question to reveal the answer." },
          { question: "Can I customize it?", answer: "Yes, you can edit questions and answers directly on the canvas." },
        ],
      },
    }),
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

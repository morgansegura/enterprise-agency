import {
  blockRendererRegistry,
  type BlockRendererRegistration,
} from "./block-renderer-registry";

/**
 * Implemented Block Renderer Registrations
 *
 * ALL renderers use local components for canvas editing support (onChange/isEditing).
 * The @enterprise/blocks package renderers are only used by the client app.
 */

const implementedRenderers: BlockRendererRegistration[] = [
  // ==========================================================================
  // Text content blocks (TipTap inline editing)
  // ==========================================================================
  {
    type: "heading-block",
    component: () =>
      import("@/components/renderers/blocks/heading-block-renderer"),
  },
  {
    type: "text-block",
    component: () =>
      import("@/components/renderers/blocks/text-block-renderer"),
  },
  {
    type: "rich-text-block",
    component: () =>
      import("@/components/renderers/blocks/rich-text-block-renderer"),
  },

  // ==========================================================================
  // Content blocks (local renderers with canvas editing)
  // ==========================================================================
  {
    type: "button-block",
    component: () =>
      import("@/components/renderers/blocks/button-block-renderer"),
  },
  {
    type: "image-block",
    component: () =>
      import("@/components/renderers/blocks/image-block-renderer"),
  },
  {
    type: "quote-block",
    component: () =>
      import("@/components/renderers/blocks/quote-block-renderer"),
  },
  {
    type: "list-block",
    component: () =>
      import("@/components/renderers/blocks/list-block-renderer"),
  },
  {
    type: "icon-block",
    component: () =>
      import("@/components/renderers/blocks/icon-block-renderer"),
  },
  {
    type: "divider-block",
    component: () =>
      import("@/components/renderers/blocks/divider-block-renderer"),
  },
  {
    type: "spacer-block",
    component: () =>
      import("@/components/renderers/blocks/spacer-block-renderer"),
  },
  {
    type: "card-block",
    component: () =>
      import("@/components/renderers/blocks/card-block-renderer"),
  },
  {
    type: "stats-block",
    component: () =>
      import("@/components/renderers/blocks/stats-block-renderer"),
  },
  {
    type: "logo-block",
    component: () =>
      import("@/components/renderers/blocks/logo-block-renderer"),
  },

  // ==========================================================================
  // Composite blocks (sections with multiple sub-elements)
  // ==========================================================================
  {
    type: "hero-block",
    component: () =>
      import("@/components/renderers/blocks/hero-block-renderer"),
  },
  {
    type: "cta-block",
    component: () =>
      import("@/components/renderers/blocks/cta-block-renderer"),
  },
  {
    type: "testimonial-block",
    component: () =>
      import("@/components/renderers/blocks/testimonial-block-renderer"),
  },
  {
    type: "pricing-block",
    component: () =>
      import("@/components/renderers/blocks/pricing-block-renderer"),
  },
  {
    type: "team-block",
    component: () =>
      import("@/components/renderers/blocks/team-block-renderer"),
  },
  {
    type: "logo-bar-block",
    component: () =>
      import("@/components/renderers/blocks/logo-bar-block-renderer"),
  },

  // ==========================================================================
  // Media blocks
  // ==========================================================================
  {
    type: "video-block",
    component: () =>
      import("@/components/renderers/blocks/video-block-renderer"),
  },
  {
    type: "audio-block",
    component: () =>
      import("@/components/renderers/blocks/audio-block-renderer"),
  },
  {
    type: "embed-block",
    component: () =>
      import("@/components/renderers/blocks/embed-block-renderer"),
  },
  {
    type: "map-block",
    component: () => import("@/components/renderers/blocks/map-block-renderer"),
  },

  // ==========================================================================
  // Interactive blocks
  // ==========================================================================
  {
    type: "accordion-block",
    component: () =>
      import("@/components/renderers/blocks/accordion-block-renderer"),
  },
  {
    type: "tabs-block",
    component: () =>
      import("@/components/renderers/blocks/tabs-block-renderer"),
  },

  // ==========================================================================
  // Layout/Container blocks (local renderers, pass through isEditing)
  // ==========================================================================
  {
    type: "container-block",
    component: () =>
      import("@/components/renderers/blocks/container-block-renderer"),
    isContainer: true,
  },
  {
    type: "stack-block",
    component: () =>
      import("@/components/renderers/blocks/stack-block-renderer"),
    isContainer: true,
  },
  {
    type: "flex-block",
    component: () =>
      import("@/components/renderers/blocks/flex-block-renderer"),
    isContainer: true,
  },
  {
    type: "grid-block",
    component: () =>
      import("@/components/renderers/blocks/grid-block-renderer"),
    isContainer: true,
  },
  {
    type: "columns-block",
    component: () =>
      import("@/components/renderers/blocks/columns-block-renderer"),
    isContainer: true,
  },

  // ==========================================================================
  // New blocks — forms, content, navigation
  // ==========================================================================
  {
    type: "contact-form-block",
    component: () =>
      import("@/components/renderers/blocks/contact-form-block-renderer"),
  },
  {
    type: "newsletter-block",
    component: () =>
      import("@/components/renderers/blocks/newsletter-block-renderer"),
  },
  {
    type: "feature-grid-block",
    component: () =>
      import("@/components/renderers/blocks/feature-grid-block-renderer"),
  },
  {
    type: "social-links-block",
    component: () =>
      import("@/components/renderers/blocks/social-links-block-renderer"),
  },
  {
    type: "faq-block",
    component: () =>
      import("@/components/renderers/blocks/faq-block-renderer"),
  },
];

/**
 * Register all renderers on module load
 */
blockRendererRegistry.registerMany(implementedRenderers);

/**
 * Export for external use
 */
export { implementedRenderers };

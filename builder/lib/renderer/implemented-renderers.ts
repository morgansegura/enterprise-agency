import {
  blockRendererRegistry,
  type BlockRendererRegistration,
} from "./block-renderer-registry";

// Import shared block renderers from @enterprise/blocks
import {
  ButtonBlock,
  SpacerBlock,
  DividerBlock,
  ImageBlock,
  QuoteBlock,
  IconBlock,
  ListBlock,
  ContainerBlock,
  GridBlock,
  FlexBlock,
  StackBlock,
} from "@enterprise/blocks";

/**
 * Implemented Block Renderer Registrations
 *
 * Registers all block renderers for client-side page rendering.
 * Uses shared components from @enterprise/blocks where available.
 */

const implementedRenderers: BlockRendererRegistration[] = [
  // ==========================================================================
  // Content blocks — use local renderers for inline editing (TipTap)
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
  // Content blocks (from @enterprise/blocks — read-only)
  {
    type: "button-block",
    component: () => Promise.resolve({ default: ButtonBlock }),
  },
  {
    type: "spacer-block",
    component: () => Promise.resolve({ default: SpacerBlock }),
  },
  {
    type: "divider-block",
    component: () => Promise.resolve({ default: DividerBlock }),
  },
  {
    type: "quote-block",
    component: () => Promise.resolve({ default: QuoteBlock }),
  },
  {
    type: "list-block",
    component: () => Promise.resolve({ default: ListBlock }),
  },
  {
    type: "icon-block",
    component: () => Promise.resolve({ default: IconBlock }),
  },
  {
    type: "image-block",
    component: () => Promise.resolve({ default: ImageBlock }),
  },

  // ==========================================================================
  // Content blocks (local - not yet migrated)
  // ==========================================================================
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
  // Composite blocks (Temlis themes)
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
  // Media blocks (local - not yet migrated)
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
  // Interactive blocks (local - not yet migrated)
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
  // Layout/Container blocks (from @enterprise/blocks)
  // ==========================================================================
  {
    type: "container-block",
    component: () => Promise.resolve({ default: ContainerBlock }),
    isContainer: true,
  },
  {
    type: "stack-block",
    component: () => Promise.resolve({ default: StackBlock }),
    isContainer: true,
  },
  {
    type: "flex-block",
    component: () => Promise.resolve({ default: FlexBlock }),
    isContainer: true,
  },
  {
    type: "grid-block",
    component: () => Promise.resolve({ default: GridBlock }),
    isContainer: true,
  },

  // ==========================================================================
  // Layout blocks (local - not yet migrated)
  // ==========================================================================
  {
    type: "columns-block",
    component: () =>
      import("@/components/renderers/blocks/columns-block-renderer"),
    isContainer: true,
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

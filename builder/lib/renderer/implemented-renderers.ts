import { blockRendererRegistry, type BlockRendererRegistration } from "./block-renderer-registry";

/**
 * Implemented Block Renderer Registrations
 *
 * Registers all block renderers for client-side page rendering.
 * Each renderer corresponds to an editor block type.
 */

const implementedRenderers: BlockRendererRegistration[] = [
  // Content blocks
  {
    type: "text-block",
    component: () => import("@/components/renderers/blocks/text-block-renderer"),
  },
  {
    type: "heading-block",
    component: () => import("@/components/renderers/blocks/heading-block-renderer"),
  },
  {
    type: "button-block",
    component: () => import("@/components/renderers/blocks/button-block-renderer"),
  },
  {
    type: "spacer-block",
    component: () => import("@/components/renderers/blocks/spacer-block-renderer"),
  },
  {
    type: "divider-block",
    component: () => import("@/components/renderers/blocks/divider-block-renderer"),
  },
  {
    type: "rich-text-block",
    component: () => import("@/components/renderers/blocks/rich-text-block-renderer"),
  },
  {
    type: "quote-block",
    component: () => import("@/components/renderers/blocks/quote-block-renderer"),
  },
  {
    type: "list-block",
    component: () => import("@/components/renderers/blocks/list-block-renderer"),
  },
  {
    type: "icon-block",
    component: () => import("@/components/renderers/blocks/icon-block-renderer"),
  },
  {
    type: "card-block",
    component: () => import("@/components/renderers/blocks/card-block-renderer"),
  },
  {
    type: "stats-block",
    component: () => import("@/components/renderers/blocks/stats-block-renderer"),
  },
  {
    type: "logo-block",
    component: () => import("@/components/renderers/blocks/logo-block-renderer"),
  },

  // Media blocks
  {
    type: "image-block",
    component: () => import("@/components/renderers/blocks/image-block-renderer"),
  },
  {
    type: "video-block",
    component: () => import("@/components/renderers/blocks/video-block-renderer"),
  },
  {
    type: "audio-block",
    component: () => import("@/components/renderers/blocks/audio-block-renderer"),
  },
  {
    type: "embed-block",
    component: () => import("@/components/renderers/blocks/embed-block-renderer"),
  },
  {
    type: "map-block",
    component: () => import("@/components/renderers/blocks/map-block-renderer"),
  },

  // Interactive blocks
  {
    type: "accordion-block",
    component: () => import("@/components/renderers/blocks/accordion-block-renderer"),
  },
  {
    type: "tabs-block",
    component: () => import("@/components/renderers/blocks/tabs-block-renderer"),
  },

  // Layout/Container blocks
  {
    type: "container-block",
    component: () => import("@/components/renderers/blocks/container-block-renderer"),
    isContainer: true,
  },
  {
    type: "stack-block",
    component: () => import("@/components/renderers/blocks/stack-block-renderer"),
    isContainer: true,
  },
  {
    type: "flex-block",
    component: () => import("@/components/renderers/blocks/flex-block-renderer"),
    isContainer: true,
  },
  {
    type: "grid-block",
    component: () => import("@/components/renderers/blocks/grid-block-renderer"),
    isContainer: true,
  },
  {
    type: "columns-block",
    component: () => import("@/components/renderers/blocks/columns-block-renderer"),
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

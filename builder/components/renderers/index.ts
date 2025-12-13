// Main renderers
export { PageRenderer, PageRendererSkeleton } from "./page-renderer";
export { SectionRenderer } from "./section-renderer";
export { BlockRenderer, preloadBlockRenderer, hasBlockRenderer } from "./block-renderer";

// Registry
export {
  blockRendererRegistry,
  type BlockRendererProps,
  type BlockRendererRegistration,
} from "@/lib/renderer/block-renderer-registry";

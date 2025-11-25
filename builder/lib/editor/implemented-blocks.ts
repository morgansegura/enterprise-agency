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
];

/**
 * Register implemented blocks on module load
 */
blockRegistry.registerMany(implementedBlocks);

/**
 * Export for external use
 */
export { implementedBlocks };

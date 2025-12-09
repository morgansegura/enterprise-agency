import type { ComponentType } from "react";
import type { Block } from "@/lib/hooks/use-pages";
import { logger } from "@/lib/logger";

/**
 * Block Editor Component Props Interface
 * All block editors must implement this interface
 */
export interface BlockEditorProps<T extends Block = Block> {
  block: T;
  onChange: (block: T) => void;
  onDelete: () => void;
}

/**
 * Block Registration Entry
 * Defines metadata and default values for each block type
 */
export interface BlockRegistration {
  /** Block type identifier (must match API DTO _type) */
  type: string;

  /** Display name shown in UI */
  displayName: string;

  /** Category for grouping in block library */
  category:
    | "content"
    | "media"
    | "interactive"
    | "layout"
    | "specialized"
    | "container";

  /** Icon identifier (lucide-react icon name) */
  icon: string;

  /** Short description of block purpose */
  description: string;

  /** Editor component (lazy-loaded for performance) */
  component: () => Promise<{
    default: ComponentType<BlockEditorProps>;
  }>;

  /** Factory function to create default block data */
  createDefault: () => Block;

  /** Whether block can contain other blocks (for containers) */
  isContainer?: boolean;

  /** Tier requirement (CONTENT_EDITOR or BUILDER) */
  tier?: "CONTENT_EDITOR" | "BUILDER";
}

/**
 * Block Registry
 * Central source of truth for all block types
 *
 * Enterprise benefits:
 * - Single source of truth for block metadata
 * - Lazy loading for better performance
 * - Type-safe registration
 * - Easy to add new blocks
 * - Enables dynamic features (search, filtering, tier gates)
 */
class BlockRegistry {
  private registry = new Map<string, BlockRegistration>();

  /**
   * Register a new block type
   */
  register(registration: BlockRegistration): void {
    if (this.registry.has(registration.type)) {
      logger.warn(
        `Block type "${registration.type}" is already registered. Overwriting.`,
      );
    }
    this.registry.set(registration.type, registration);
  }

  /**
   * Register multiple blocks at once
   */
  registerMany(registrations: BlockRegistration[]): void {
    registrations.forEach((reg) => this.register(reg));
  }

  /**
   * Get registration for a specific block type
   */
  get(type: string): BlockRegistration | undefined {
    return this.registry.get(type);
  }

  /**
   * Get all registered block types
   */
  getAll(): BlockRegistration[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get blocks by category
   */
  getByCategory(category: BlockRegistration["category"]): BlockRegistration[] {
    return this.getAll().filter((reg) => reg.category === category);
  }

  /**
   * Get blocks by tier
   */
  getByTier(tier: BlockRegistration["tier"]): BlockRegistration[] {
    return this.getAll().filter((reg) => !reg.tier || reg.tier === tier);
  }

  /**
   * Check if block type is registered
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Create default block data for a type
   */
  createDefault(type: string): Block | null {
    const registration = this.get(type);
    if (!registration) {
      logger.error(`Block type "${type}" not found in registry`);
      return null;
    }
    return registration.createDefault();
  }

  /**
   * Lazy load editor component for a block type
   */
  async loadEditor(
    type: string,
  ): Promise<ComponentType<BlockEditorProps> | null> {
    const registration = this.get(type);
    if (!registration) {
      logger.error(`Block type "${type}" not found in registry`);
      return null;
    }

    try {
      const module = await registration.component();
      return module.default;
    } catch (error) {
      logger.error(`Failed to load editor for "${type}"`, error as Error);
      return null;
    }
  }
}

/**
 * Global block registry instance
 * Import this to access all registered blocks
 */
export const blockRegistry = new BlockRegistry();

/**
 * Helper hook for lazy-loading block editors
 * Usage in page editor:
 *
 * ```tsx
 * const EditorComponent = useLazyBlockEditor(block._type);
 * if (!EditorComponent) return <div>Loading...</div>;
 * return <EditorComponent block={block} onChange={...} onDelete={...} />;
 * ```
 */
export function useLazyBlockEditor(
  type: string,
): ComponentType<BlockEditorProps> | null {
  const [component, setComponent] =
    React.useState<ComponentType<BlockEditorProps> | null>(null);

  React.useEffect(() => {
    blockRegistry.loadEditor(type).then(setComponent);
  }, [type]);

  return component;
}

// Export React for the hook
import * as React from "react";

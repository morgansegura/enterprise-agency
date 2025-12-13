import type { ComponentType } from "react";
import type { Block } from "@/lib/hooks/use-pages";
import { logger } from "@/lib/logger";

/**
 * Block Renderer Component Props Interface
 * All block renderers receive these props
 */
export interface BlockRendererProps<T extends Block = Block> {
  block: T;
  /** Current breakpoint for responsive rendering */
  breakpoint?: "desktop" | "tablet" | "mobile";
}

/**
 * Block Renderer Registration Entry
 */
export interface BlockRendererRegistration {
  /** Block type identifier (must match _type from block data) */
  type: string;

  /** Renderer component (lazy-loaded for performance) */
  component: () => Promise<{
    default: ComponentType<BlockRendererProps>;
  }>;

  /** Whether this block can contain other blocks */
  isContainer?: boolean;
}

/**
 * Block Renderer Registry
 * Central source of truth for all block renderers (display components)
 *
 * Mirrors the editor block-registry but for read-only rendering
 */
class BlockRendererRegistry {
  private registry = new Map<string, BlockRendererRegistration>();

  /**
   * Register a new block renderer
   */
  register(registration: BlockRendererRegistration): void {
    if (this.registry.has(registration.type)) {
      logger.warn(
        `Block renderer "${registration.type}" is already registered. Overwriting.`,
      );
    }
    this.registry.set(registration.type, registration);
  }

  /**
   * Register multiple renderers at once
   */
  registerMany(registrations: BlockRendererRegistration[]): void {
    registrations.forEach((reg) => this.register(reg));
  }

  /**
   * Get registration for a specific block type
   */
  get(type: string): BlockRendererRegistration | undefined {
    return this.registry.get(type);
  }

  /**
   * Check if block type has a renderer registered
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Lazy load renderer component for a block type
   */
  async loadRenderer(
    type: string,
  ): Promise<ComponentType<BlockRendererProps> | null> {
    const registration = this.get(type);
    if (!registration) {
      logger.error(`Block renderer for "${type}" not found in registry`);
      return null;
    }

    try {
      const module = await registration.component();
      return module.default;
    } catch (error) {
      logger.error(`Failed to load renderer for "${type}"`, error as Error);
      return null;
    }
  }

  /**
   * Get all registered types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}

/**
 * Global block renderer registry instance
 */
export const blockRendererRegistry = new BlockRendererRegistry();

/**
 * Hook for lazy-loading block renderers
 */
export function useLazyBlockRenderer(
  type: string,
): ComponentType<BlockRendererProps> | null {
  const [component, setComponent] =
    React.useState<ComponentType<BlockRendererProps> | null>(null);

  React.useEffect(() => {
    blockRendererRegistry.loadRenderer(type).then(setComponent);
  }, [type]);

  return component;
}

import * as React from "react";

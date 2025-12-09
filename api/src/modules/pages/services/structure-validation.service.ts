import { Injectable, ForbiddenException } from "@nestjs/common";
import { TenantTier } from "@prisma/client";

/**
 * Internal type for content block structure validation
 */
interface ContentBlock {
  _key: string;
  _type: string;
  data?: Record<string, unknown>;
  blocks?: ContentBlock[];
}

/**
 * Internal type for section structure validation
 */
interface Section {
  _key: string;
  _type: string;
  background?: string;
  spacing?: string;
  width?: string;
  align?: string;
  blocks: ContentBlock[];
}

/**
 * Flexible page content type for JSONB compatibility
 * Allows for unknown structure from database while providing
 * type safety for validation operations
 */
type PageContent = Record<string, unknown> | null;

/**
 * Service to validate structural changes in page content
 * Enforces the two-tier permission system:
 * - CONTENT_EDITOR: Can only modify block data (text, images, etc.), not structure
 * - BUILDER: Can modify everything including structure
 */
@Injectable()
export class StructureValidationService {
  /**
   * Validates that content changes are allowed for the given tenant tier
   * @param tier - The tenant's tier (CONTENT_EDITOR or BUILDER)
   * @param existingContent - The current page content from database
   * @param updatedContent - The proposed updated content
   * @throws ForbiddenException if Content Editor attempts structural changes
   */
  validateContentChanges(
    tier: TenantTier,
    existingContent: PageContent,
    updatedContent: PageContent,
  ): void {
    // Builder tier can make any changes
    if (tier === TenantTier.BUILDER) {
      return;
    }

    // Content Editor tier - validate no structural changes
    const updatedSections = updatedContent?.sections;
    if (updatedSections !== undefined) {
      const existingSections = (existingContent?.sections ?? []) as Section[];
      const newSections = (updatedSections ?? []) as Section[];
      this.validateSectionsStructure(existingSections, newSections);
    }
  }

  /**
   * Validates that sections structure hasn't changed
   * Checks: section count, section keys, section order, blocks within sections
   */
  private validateSectionsStructure(
    existingSections: Section[],
    updatedSections: Section[],
  ): void {
    // Check section count
    if (existingSections.length !== updatedSections.length) {
      throw new ForbiddenException(
        "Content Editor tier cannot add or remove sections. Upgrade to Builder tier to modify page structure.",
      );
    }

    // Check each section
    for (let i = 0; i < existingSections.length; i++) {
      const existingSection = existingSections[i];
      const updatedSection = updatedSections[i];

      // Check section key matches (same section in same position)
      if (existingSection._key !== updatedSection._key) {
        throw new ForbiddenException(
          "Content Editor tier cannot reorder sections. Upgrade to Builder tier to modify page structure.",
        );
      }

      // Section settings (background, spacing, etc.) can be changed by Content Editor
      // Only block structure needs validation

      // Validate blocks within section
      this.validateBlocksStructure(
        existingSection.blocks ?? [],
        updatedSection.blocks ?? [],
      );
    }
  }

  /**
   * Validates that blocks structure hasn't changed within a section
   * Checks: block count, block keys, block types, block order, nested blocks
   */
  private validateBlocksStructure(
    existingBlocks: ContentBlock[],
    updatedBlocks: ContentBlock[],
  ): void {
    // Check block count
    if (existingBlocks.length !== updatedBlocks.length) {
      throw new ForbiddenException(
        "Content Editor tier cannot add or remove blocks. Upgrade to Builder tier to modify page structure.",
      );
    }

    // Check each block
    for (let i = 0; i < existingBlocks.length; i++) {
      const existingBlock = existingBlocks[i];
      const updatedBlock = updatedBlocks[i];

      // Check block key matches (same block in same position)
      if (existingBlock._key !== updatedBlock._key) {
        throw new ForbiddenException(
          "Content Editor tier cannot reorder blocks. Upgrade to Builder tier to modify page structure.",
        );
      }

      // Check block type hasn't changed
      if (existingBlock._type !== updatedBlock._type) {
        throw new ForbiddenException(
          "Content Editor tier cannot change block types. Upgrade to Builder tier to modify page structure.",
        );
      }

      // Recursively check nested blocks (for container blocks like grid, flex, etc.)
      if (existingBlock.blocks || updatedBlock.blocks) {
        this.validateBlocksStructure(
          existingBlock.blocks ?? [],
          updatedBlock.blocks ?? [],
        );
      }
    }
  }

  /**
   * Extracts all block keys from a page content structure
   * Useful for debugging and logging
   */
  extractBlockKeys(content: PageContent): string[] {
    if (!content?.sections) {
      return [];
    }

    const keys: string[] = [];
    const sections = content.sections as Section[];

    for (const section of sections) {
      keys.push(`section:${section._key}`);
      this.extractBlockKeysRecursive(section.blocks ?? [], keys);
    }

    return keys;
  }

  private extractBlockKeysRecursive(
    blocks: ContentBlock[],
    keys: string[],
  ): void {
    for (const block of blocks) {
      keys.push(`${block._type}:${block._key}`);
      if (block.blocks) {
        this.extractBlockKeysRecursive(block.blocks, keys);
      }
    }
  }
}

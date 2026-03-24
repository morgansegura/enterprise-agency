/**
 * Block Schema Registry
 *
 * Central registry for all block schemas with helper functions
 * for retrieving schema definitions and organizing fields.
 */

export * from "./field-types";
export * from "./block-schemas";

import type {
  BlockSchema,
  BlockSchemaRegistry,
  FieldSchema,
} from "./field-types";
import {
  // Layout
  containerBlockSchema,
  gridBlockSchema,
  flexBlockSchema,
  spacerBlockSchema,
  dividerBlockSchema,
  cardBlockSchema,
  navigationBlockSchema,
  footerBlockSchema,
  breadcrumbBlockSchema,
  // Content
  headingBlockSchema,
  textBlockSchema,
  richTextBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  buttonBlockSchema,
  iconBlockSchema,
  socialLinksBlockSchema,
  codeBlockSchema,
  tableBlockSchema,
  embedBlockSchema,
  alertBlockSchema,
  progressBlockSchema,
  productCardBlockSchema,
  // Interactive
  accordionBlockSchema,
  tabsBlockSchema,
  formBlockSchema,
  countdownBlockSchema,
  // Sections
  heroBlockSchema,
  featuresBlockSchema,
  ctaBlockSchema,
  statsBlockSchema,
  faqBlockSchema,
  testimonialsBlockSchema,
  pricingBlockSchema,
  contactBlockSchema,
  teamBlockSchema,
  logoGridBlockSchema,
  newsletterBlockSchema,
  galleryBlockSchema,
  productGridBlockSchema,
} from "./block-schemas";

/**
 * Block schema registry — maps block types to their schemas
 */
export const blockSchemaRegistry: BlockSchemaRegistry = {
  // Layout
  "container-block": containerBlockSchema,
  "grid-block": gridBlockSchema,
  "flex-block": flexBlockSchema,
  "spacer-block": spacerBlockSchema,
  "divider-block": dividerBlockSchema,
  "card-block": cardBlockSchema,
  "navigation-block": navigationBlockSchema,
  "footer-block": footerBlockSchema,
  "breadcrumb-block": breadcrumbBlockSchema,
  // Content
  "heading-block": headingBlockSchema,
  "text-block": textBlockSchema,
  "rich-text-block": richTextBlockSchema,
  "image-block": imageBlockSchema,
  "video-block": videoBlockSchema,
  "button-block": buttonBlockSchema,
  "icon-block": iconBlockSchema,
  "social-links-block": socialLinksBlockSchema,
  "code-block": codeBlockSchema,
  "table-block": tableBlockSchema,
  "embed-block": embedBlockSchema,
  "alert-block": alertBlockSchema,
  "progress-block": progressBlockSchema,
  "product-card-block": productCardBlockSchema,
  // Interactive
  "accordion-block": accordionBlockSchema,
  "tabs-block": tabsBlockSchema,
  "form-block": formBlockSchema,
  "countdown-block": countdownBlockSchema,
  // Sections
  "hero-block": heroBlockSchema,
  "features-block": featuresBlockSchema,
  "cta-block": ctaBlockSchema,
  "stats-block": statsBlockSchema,
  "faq-block": faqBlockSchema,
  "testimonials-block": testimonialsBlockSchema,
  "pricing-block": pricingBlockSchema,
  "contact-block": contactBlockSchema,
  "team-block": teamBlockSchema,
  "logo-cloud-block": logoGridBlockSchema,
  "newsletter-block": newsletterBlockSchema,
  "gallery-block": galleryBlockSchema,
  "product-grid-block": productGridBlockSchema,
};

/**
 * Get the schema for a specific block type
 */
export function getBlockSchema(blockType: string): BlockSchema | undefined {
  return blockSchemaRegistry[blockType];
}

/**
 * Get all block types in a specific category
 */
export function getBlocksByCategory(
  category: BlockSchema["category"],
): BlockSchema[] {
  return Object.values(blockSchemaRegistry).filter(
    (schema) => schema.category === category,
  );
}

/**
 * Get all registered block types
 */
export function getAllBlockTypes(): string[] {
  return Object.keys(blockSchemaRegistry);
}

/**
 * Check if a block type has a registered schema
 */
export function hasBlockSchema(blockType: string): boolean {
  return blockType in blockSchemaRegistry;
}

/**
 * Get field schema by block type and field name (supports dot notation)
 */
export function getFieldSchema(
  blockType: string,
  fieldName: string,
): FieldSchema | undefined {
  const schema = getBlockSchema(blockType);
  if (!schema) return undefined;

  const parts = fieldName.split(".");
  const rootFieldName = parts[0];

  return schema.fields.find((field) => {
    if (parts.length === 1) {
      return field.name === fieldName;
    }
    return (
      field.name === fieldName || field.name.startsWith(`${rootFieldName}.`)
    );
  });
}

/**
 * Get fields grouped by their group property (content/style/advanced)
 */
export function getFieldsByGroup(
  blockType: string,
): Record<string, FieldSchema[]> {
  const schema = getBlockSchema(blockType);
  if (!schema) return {};

  const groups: Record<string, FieldSchema[]> = {
    content: [],
    style: [],
    advanced: [],
  };

  for (const field of schema.fields) {
    const group = field.group || "content";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(field);
  }

  return groups;
}

/**
 * Get default values from a block schema
 */
export function getSchemaDefaults(blockType: string): Record<string, unknown> {
  const schema = getBlockSchema(blockType);
  if (!schema) return {};

  const defaults: Record<string, unknown> = {};

  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      const parts = field.name.split(".");
      if (parts.length === 1) {
        defaults[field.name] = field.defaultValue;
      } else {
        // Handle nested defaults (e.g., "style.backgroundColor")
        let target: Record<string, unknown> = defaults;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!target[parts[i]]) {
            target[parts[i]] = {};
          }
          target = target[parts[i]] as Record<string, unknown>;
        }
        target[parts[parts.length - 1]] = field.defaultValue;
      }
    }
  }

  return defaults;
}

/**
 * Component Property Schemas
 *
 * Type definitions and defaults for all page builder components.
 */

// =============================================================================
// Import all for re-export and aggregation
// =============================================================================

import {
  sectionDefaults,
  sectionPropertyGroups,
  sectionPropertyLabels,
} from "./section";

import {
  containerDefaults,
  containerPropertyGroups,
  containerPropertyLabels,
} from "./container";

import { textDefaults, textPropertyGroups, textPropertyLabels } from "./text";

import {
  headingDefaults,
  headingPropertyGroups,
  headingPropertyLabels,
} from "./heading";

import {
  buttonDefaults,
  buttonPropertyGroups,
  buttonPropertyLabels,
} from "./button";

import {
  imageDefaults,
  imagePropertyGroups,
  imagePropertyLabels,
} from "./image";

import type { TextProperties } from "./text";
import type { HeadingProperties } from "./heading";
import type { ButtonProperties } from "./button";
import type { ImageProperties } from "./image";

// =============================================================================
// Re-exports
// =============================================================================

// Base properties
export {
  type VisibilityProperties,
  type PaddingProperties,
  type MarginProperties,
  type GapProperties,
  type BackgroundType,
  type GradientDirection,
  type ComponentGradientStop,
  type BackgroundProperties,
  type BorderProperties,
  type ShadowProperties,
  type LayoutProperties,
  type SizeProperties,
  type TypographyProperties,
  type AnimationProperties,
  type HoverProperties,
  type BaseComponentProperties,
  type BaseContainerProperties,
  type BaseTextProperties,
} from "./base-properties";

// Section
export {
  type SectionSpacingProperties,
  type SectionLayoutProperties,
  type SectionProperties,
  sectionDefaults,
  sectionPropertyGroups,
  sectionPropertyLabels,
} from "./section";

// Container
export {
  type ContainerLayoutType,
  type ContainerLayoutProperties,
  type ContainerSizeProperties,
  type ContainerProperties,
  containerDefaults,
  containerPropertyGroups,
  containerPropertyLabels,
} from "./container";

// Text
export {
  type TextTypographyProperties,
  type TextLayoutProperties,
  type TextProperties,
  textDefaults,
  textPropertyGroups,
  textPropertyLabels,
} from "./text";

// Heading
export {
  type HeadingLevelNumber,
  type HeadingTypographyProperties,
  type HeadingLayoutProperties,
  type HeadingProperties,
  headingLevelDefaults,
  headingDefaults,
  headingPropertyGroups,
  headingPropertyLabels,
} from "./heading";

// Button
export {
  type ButtonVariant,
  type ButtonSize,
  type ButtonStyleProperties,
  type ButtonTypographyProperties,
  type ButtonSpacingProperties,
  type ButtonHoverProperties,
  type ButtonIconProperties,
  type ButtonInteractionProperties,
  type ButtonProperties,
  buttonSizePresets,
  buttonDefaults,
  buttonPropertyGroups,
  buttonPropertyLabels,
} from "./button";

// Image
export {
  type ImageObjectFit,
  type ImageObjectPosition,
  type ImageSourceProperties,
  type ImageSizeProperties,
  type ImageFitProperties,
  type ImageEffectsProperties,
  type ImageHoverProperties,
  type ImageLoadingProperties,
  type ImageLayoutProperties,
  type ImageProperties,
  imageDefaults,
  imagePropertyGroups,
  imagePropertyLabels,
} from "./image";

// =============================================================================
// Block Type Union
// =============================================================================

export type BlockType = "text" | "heading" | "button" | "image";

export type BlockProperties =
  | TextProperties
  | HeadingProperties
  | ButtonProperties
  | ImageProperties;

// =============================================================================
// Component Defaults Map
// =============================================================================

export const componentDefaults = {
  section: sectionDefaults,
  container: containerDefaults,
  text: textDefaults,
  heading: headingDefaults,
  button: buttonDefaults,
  image: imageDefaults,
} as const;

// =============================================================================
// Component Property Groups Map
// =============================================================================

export const componentPropertyGroups = {
  section: sectionPropertyGroups,
  container: containerPropertyGroups,
  text: textPropertyGroups,
  heading: headingPropertyGroups,
  button: buttonPropertyGroups,
  image: imagePropertyGroups,
} as const;

// =============================================================================
// Component Property Labels Map
// =============================================================================

export const componentPropertyLabels = {
  section: sectionPropertyLabels,
  container: containerPropertyLabels,
  text: textPropertyLabels,
  heading: headingPropertyLabels,
  button: buttonPropertyLabels,
  image: imagePropertyLabels,
} as const;

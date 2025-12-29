/**
 * Semantic Token Scales
 *
 * Semantic abstractions over Tailwind primitives for component usage.
 */

// Scales
export {
  sizeScale,
  sectionSizeScale,
  textSizeScale,
  headingSizeScale,
  weightScale,
  leadingScale,
  radiusScale,
  shadowScale,
  containerScale,
  gapScale,
  scales,
  type SizeScaleKey,
  type SectionSizeScaleKey,
  type TextSizeScaleKey,
  type HeadingSizeScaleKey,
  type WeightScaleKey,
  type LeadingScaleKey,
  type RadiusScaleKey,
  type ShadowScaleKey,
  type ContainerScaleKey,
  type GapScaleKey,
} from "./scales";

// CSS Variables
export {
  cssVar,
  cssVarRef,
  generateSpacingVariables,
  scaleToCSS,
  dataAttributeSelectors,
  generateDataAttributeCSS,
  generateAllCSSVariables,
} from "./css-variables";

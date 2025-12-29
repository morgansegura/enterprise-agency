/**
 * Tailwind CSS Primitives
 *
 * Complete export of all Tailwind CSS primitive values.
 * These are the raw values from Tailwind CSS v3.4 that can be used
 * to build semantic tokens and component property schemas.
 */

// =============================================================================
// Colors
// =============================================================================

export {
  // Individual color palettes
  slate,
  gray,
  zinc,
  neutral,
  stone,
  red,
  orange,
  amber,
  yellow,
  lime,
  green,
  emerald,
  teal,
  cyan,
  sky,
  blue,
  indigo,
  violet,
  purple,
  fuchsia,
  pink,
  rose,
  // Special colors
  white,
  black,
  transparent,
  current,
  // All colors combined
  colors,
  // Helper function
  getColor,
  // Types
  type ColorName,
  type ColorShade,
  type ColorValue,
} from "./colors";

// =============================================================================
// Spacing
// =============================================================================

export {
  spacing,
  spacingWithPx,
  negativeSpacing,
  getSpacing,
  getSpacingPx,
  type SpacingKey,
  type SpacingValue,
  type NegativeSpacingKey,
} from "./spacing";

// =============================================================================
// Typography
// =============================================================================

export {
  fontSize,
  fontSizeWithPx,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  textDecoration,
  textDecorationStyle,
  textDecorationThickness,
  textTransform,
  textAlign,
  verticalAlign,
  textOverflow,
  whitespace,
  wordBreak,
  typography,
  type FontSizeKey,
  type FontWeightKey,
  type LineHeightKey,
  type LetterSpacingKey,
  type FontFamilyKey,
  type TextAlignKey,
  type TextTransformKey,
} from "./typography";

// =============================================================================
// Borders
// =============================================================================

export {
  borderWidth,
  borderWidthNamed,
  borderRadius,
  borderRadiusWithPx,
  borderStyle,
  outlineWidth,
  outlineStyle,
  outlineOffset,
  ringWidth,
  ringOffsetWidth,
  divideWidth,
  borders,
  type BorderWidthKey,
  type BorderWidthNamedKey,
  type BorderRadiusKey,
  type BorderStyleKey,
  type RingWidthKey,
} from "./borders";

// =============================================================================
// Effects
// =============================================================================

export {
  boxShadow,
  boxShadowNamed,
  dropShadow,
  opacity,
  blur,
  backdropBlur,
  brightness,
  contrast,
  grayscale,
  hueRotate,
  invert,
  saturate,
  sepia,
  mixBlendMode,
  backgroundBlendMode,
  effects,
  type BoxShadowKey,
  type BoxShadowNamedKey,
  type OpacityKey,
  type BlurKey,
  type MixBlendModeKey,
} from "./effects";

// =============================================================================
// Layout
// =============================================================================

export {
  // Sizing
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  // Aspect Ratio
  aspectRatio,
  // Flexbox
  flexDirection,
  flexWrap,
  flex,
  flexGrow,
  flexShrink,
  flexBasis,
  // Grid
  gridTemplateColumns,
  gridColumn,
  gridTemplateRows,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  // Gap
  gap,
  // Justify & Align
  justifyContent,
  justifyItems,
  justifySelf,
  alignContent,
  alignItems,
  alignSelf,
  // Position
  position,
  // Object
  objectFit,
  objectPosition,
  // Overflow
  overflow,
  // Display
  display,
  // Z-index
  zIndex,
  // Combined
  layout,
  // Types
  type WidthKey,
  type MaxWidthKey,
  type HeightKey,
  type FlexDirectionKey,
  type JustifyContentKey,
  type AlignItemsKey,
  type PositionKey,
  type DisplayKey,
  type ZIndexKey,
  type OverflowKey,
  type ObjectFitKey,
} from "./layout";

// =============================================================================
// Transitions & Animations
// =============================================================================

export {
  transitionProperty,
  transitionDuration,
  transitionTimingFunction,
  transitionDelay,
  animation,
  keyframes,
  transformOrigin,
  scale,
  rotate,
  rotateNegative,
  translate,
  skew,
  skewNegative,
  cursor,
  userSelect,
  pointerEvents,
  resize,
  scrollBehavior,
  scrollSnapType,
  scrollSnapStrictness,
  scrollSnapAlign,
  willChange,
  transitions,
  type TransitionPropertyKey,
  type TransitionDurationKey,
  type TransitionTimingFunctionKey,
  type AnimationKey,
  type TransformOriginKey,
  type ScaleKey,
  type RotateKey,
  type CursorKey,
} from "./transitions";

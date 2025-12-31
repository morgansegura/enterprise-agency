/**
 * @enterprise/ui
 *
 * Shared UI component library for the Enterprise platform.
 * Provides reusable presentation components with consistent
 * styling via data-slot CSS selectors.
 */

// Button
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/button";

// Heading
export {
  Heading,
  type HeadingProps,
  type HeadingLevel,
  type HeadingSize,
  type HeadingVariant,
  type FontWeight,
  type TextAlign,
  type LetterSpacing,
  type LineHeight,
  type FontStyle,
  type TextTransform,
  type TextDecoration,
  type WhiteSpace,
  type MaxWidthPreset,
  type OpacityPreset,
  type ColorPreset,
} from "./components/heading";

// Text
export {
  Text,
  type TextProps,
  type TextElement,
  type TextSize,
  type TextVariant,
  type Columns,
  type ColumnGap,
} from "./components/text";

// Utils
export * from "./utils";

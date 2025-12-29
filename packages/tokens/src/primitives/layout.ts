/**
 * Tailwind CSS Layout Primitives
 *
 * Sizing, flexbox, grid, positioning from Tailwind CSS v3.4
 */

// =============================================================================
// Width
// =============================================================================

export const width = {
  auto: "auto",
  // Spacing scale (same as spacing)
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
  // Fractions
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%",
  "1/12": "8.333333%",
  "2/12": "16.666667%",
  "3/12": "25%",
  "4/12": "33.333333%",
  "5/12": "41.666667%",
  "6/12": "50%",
  "7/12": "58.333333%",
  "8/12": "66.666667%",
  "9/12": "75%",
  "10/12": "83.333333%",
  "11/12": "91.666667%",
  full: "100%",
  screen: "100vw",
  svw: "100svw",
  lvw: "100lvw",
  dvw: "100dvw",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
} as const;

// =============================================================================
// Max Width
// =============================================================================

export const maxWidth = {
  none: "none",
  "0": "0rem",
  xs: "20rem", // 320px
  sm: "24rem", // 384px
  md: "28rem", // 448px
  lg: "32rem", // 512px
  xl: "36rem", // 576px
  "2xl": "42rem", // 672px
  "3xl": "48rem", // 768px
  "4xl": "56rem", // 896px
  "5xl": "64rem", // 1024px
  "6xl": "72rem", // 1152px
  "7xl": "80rem", // 1280px
  full: "100%",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
  prose: "65ch",
  // Screen sizes
  "screen-sm": "640px",
  "screen-md": "768px",
  "screen-lg": "1024px",
  "screen-xl": "1280px",
  "screen-2xl": "1536px",
} as const;

// =============================================================================
// Min Width
// =============================================================================

export const minWidth = {
  "0": "0px",
  full: "100%",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
} as const;

// =============================================================================
// Height
// =============================================================================

export const height = {
  auto: "auto",
  // Spacing scale (same as width)
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
  // Fractions
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%",
  full: "100%",
  screen: "100vh",
  svh: "100svh",
  lvh: "100lvh",
  dvh: "100dvh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
} as const;

// =============================================================================
// Max Height
// =============================================================================

export const maxHeight = {
  none: "none",
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  // ... continues with spacing scale
  full: "100%",
  screen: "100vh",
  svh: "100svh",
  lvh: "100lvh",
  dvh: "100dvh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
} as const;

// =============================================================================
// Min Height
// =============================================================================

export const minHeight = {
  "0": "0px",
  full: "100%",
  screen: "100vh",
  svh: "100svh",
  lvh: "100lvh",
  dvh: "100dvh",
  min: "min-content",
  max: "max-content",
  fit: "fit-content",
} as const;

// =============================================================================
// Aspect Ratio
// =============================================================================

export const aspectRatio = {
  auto: "auto",
  square: "1 / 1",
  video: "16 / 9",
} as const;

// =============================================================================
// Display
// =============================================================================

export const display = {
  block: "block",
  "inline-block": "inline-block",
  inline: "inline",
  flex: "flex",
  "inline-flex": "inline-flex",
  table: "table",
  "inline-table": "inline-table",
  "table-caption": "table-caption",
  "table-cell": "table-cell",
  "table-column": "table-column",
  "table-column-group": "table-column-group",
  "table-footer-group": "table-footer-group",
  "table-header-group": "table-header-group",
  "table-row-group": "table-row-group",
  "table-row": "table-row",
  "flow-root": "flow-root",
  grid: "grid",
  "inline-grid": "inline-grid",
  contents: "contents",
  "list-item": "list-item",
  hidden: "none",
} as const;

// =============================================================================
// Flex
// =============================================================================

export const flex = {
  "1": "1 1 0%",
  auto: "1 1 auto",
  initial: "0 1 auto",
  none: "none",
} as const;

export const flexDirection = {
  row: "row",
  "row-reverse": "row-reverse",
  col: "column",
  "col-reverse": "column-reverse",
} as const;

export const flexWrap = {
  wrap: "wrap",
  "wrap-reverse": "wrap-reverse",
  nowrap: "nowrap",
} as const;

export const flexGrow = {
  "0": "0",
  "": "1",
} as const;

export const flexShrink = {
  "0": "0",
  "": "1",
} as const;

export const flexBasis = {
  auto: "auto",
  // ... includes spacing scale and fractions like width
  "0": "0px",
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  full: "100%",
} as const;

// =============================================================================
// Justify Content / Items / Self
// =============================================================================

export const justifyContent = {
  normal: "normal",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  stretch: "stretch",
} as const;

export const justifyItems = {
  start: "start",
  end: "end",
  center: "center",
  stretch: "stretch",
} as const;

export const justifySelf = justifyItems;

// =============================================================================
// Align Content / Items / Self
// =============================================================================

export const alignContent = {
  normal: "normal",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  baseline: "baseline",
  stretch: "stretch",
} as const;

export const alignItems = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
} as const;

export const alignSelf = {
  auto: "auto",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
} as const;

// =============================================================================
// Gap
// =============================================================================

// Gap uses the spacing scale
export { spacing as gap } from "./spacing";

// =============================================================================
// Grid
// =============================================================================

export const gridTemplateColumns = {
  none: "none",
  subgrid: "subgrid",
  "1": "repeat(1, minmax(0, 1fr))",
  "2": "repeat(2, minmax(0, 1fr))",
  "3": "repeat(3, minmax(0, 1fr))",
  "4": "repeat(4, minmax(0, 1fr))",
  "5": "repeat(5, minmax(0, 1fr))",
  "6": "repeat(6, minmax(0, 1fr))",
  "7": "repeat(7, minmax(0, 1fr))",
  "8": "repeat(8, minmax(0, 1fr))",
  "9": "repeat(9, minmax(0, 1fr))",
  "10": "repeat(10, minmax(0, 1fr))",
  "11": "repeat(11, minmax(0, 1fr))",
  "12": "repeat(12, minmax(0, 1fr))",
} as const;

export const gridTemplateRows = {
  none: "none",
  subgrid: "subgrid",
  "1": "repeat(1, minmax(0, 1fr))",
  "2": "repeat(2, minmax(0, 1fr))",
  "3": "repeat(3, minmax(0, 1fr))",
  "4": "repeat(4, minmax(0, 1fr))",
  "5": "repeat(5, minmax(0, 1fr))",
  "6": "repeat(6, minmax(0, 1fr))",
  "7": "repeat(7, minmax(0, 1fr))",
  "8": "repeat(8, minmax(0, 1fr))",
  "9": "repeat(9, minmax(0, 1fr))",
  "10": "repeat(10, minmax(0, 1fr))",
  "11": "repeat(11, minmax(0, 1fr))",
  "12": "repeat(12, minmax(0, 1fr))",
} as const;

export const gridColumn = {
  auto: "auto",
  "span-1": "span 1 / span 1",
  "span-2": "span 2 / span 2",
  "span-3": "span 3 / span 3",
  "span-4": "span 4 / span 4",
  "span-5": "span 5 / span 5",
  "span-6": "span 6 / span 6",
  "span-7": "span 7 / span 7",
  "span-8": "span 8 / span 8",
  "span-9": "span 9 / span 9",
  "span-10": "span 10 / span 10",
  "span-11": "span 11 / span 11",
  "span-12": "span 12 / span 12",
  "span-full": "1 / -1",
} as const;

export const gridRow = {
  auto: "auto",
  "span-1": "span 1 / span 1",
  "span-2": "span 2 / span 2",
  "span-3": "span 3 / span 3",
  "span-4": "span 4 / span 4",
  "span-5": "span 5 / span 5",
  "span-6": "span 6 / span 6",
  "span-7": "span 7 / span 7",
  "span-8": "span 8 / span 8",
  "span-9": "span 9 / span 9",
  "span-10": "span 10 / span 10",
  "span-11": "span 11 / span 11",
  "span-12": "span 12 / span 12",
  "span-full": "1 / -1",
} as const;

export const gridAutoFlow = {
  row: "row",
  col: "column",
  dense: "dense",
  "row-dense": "row dense",
  "col-dense": "column dense",
} as const;

export const gridAutoColumns = {
  auto: "auto",
  min: "min-content",
  max: "max-content",
  fr: "minmax(0, 1fr)",
} as const;

export const gridAutoRows = gridAutoColumns;

// =============================================================================
// Position
// =============================================================================

export const position = {
  static: "static",
  fixed: "fixed",
  absolute: "absolute",
  relative: "relative",
  sticky: "sticky",
} as const;

// =============================================================================
// Overflow
// =============================================================================

export const overflow = {
  auto: "auto",
  hidden: "hidden",
  clip: "clip",
  visible: "visible",
  scroll: "scroll",
} as const;

// =============================================================================
// Object Fit
// =============================================================================

export const objectFit = {
  contain: "contain",
  cover: "cover",
  fill: "fill",
  none: "none",
  "scale-down": "scale-down",
} as const;

// =============================================================================
// Object Position
// =============================================================================

export const objectPosition = {
  bottom: "bottom",
  center: "center",
  left: "left",
  "left-bottom": "left bottom",
  "left-top": "left top",
  right: "right",
  "right-bottom": "right bottom",
  "right-top": "right top",
  top: "top",
} as const;

// =============================================================================
// Z-Index
// =============================================================================

export const zIndex = {
  auto: "auto",
  "0": "0",
  "10": "10",
  "20": "20",
  "30": "30",
  "40": "40",
  "50": "50",
} as const;

// =============================================================================
// Types
// =============================================================================

export type WidthKey = keyof typeof width;
export type MaxWidthKey = keyof typeof maxWidth;
export type HeightKey = keyof typeof height;
export type DisplayKey = keyof typeof display;
export type FlexDirectionKey = keyof typeof flexDirection;
export type JustifyContentKey = keyof typeof justifyContent;
export type AlignItemsKey = keyof typeof alignItems;
export type PositionKey = keyof typeof position;
export type OverflowKey = keyof typeof overflow;
export type ObjectFitKey = keyof typeof objectFit;
export type ZIndexKey = keyof typeof zIndex;

// =============================================================================
// Combined Layout Config
// =============================================================================

export const layout = {
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  aspectRatio,
  display,
  flex,
  flexDirection,
  flexWrap,
  flexGrow,
  flexShrink,
  flexBasis,
  justifyContent,
  justifyItems,
  justifySelf,
  alignContent,
  alignItems,
  alignSelf,
  gridTemplateColumns,
  gridTemplateRows,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  position,
  overflow,
  objectFit,
  objectPosition,
  zIndex,
} as const;

/**
 * Tailwind CSS Transitions & Animations Primitives
 *
 * Transition properties, durations, timing functions, and animations from Tailwind CSS v3.4
 */

// =============================================================================
// Transition Property
// =============================================================================

export const transitionProperty = {
  none: "none",
  all: "all",
  "": "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  colors:
    "color, background-color, border-color, text-decoration-color, fill, stroke",
  opacity: "opacity",
  shadow: "box-shadow",
  transform: "transform",
} as const;

// =============================================================================
// Transition Duration
// =============================================================================

export const transitionDuration = {
  "0": "0s",
  "75": "75ms",
  "100": "100ms",
  "150": "150ms",
  "200": "200ms",
  "300": "300ms",
  "500": "500ms",
  "700": "700ms",
  "1000": "1000ms",
} as const;

// =============================================================================
// Transition Timing Function
// =============================================================================

export const transitionTimingFunction = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// =============================================================================
// Transition Delay
// =============================================================================

export const transitionDelay = {
  "0": "0s",
  "75": "75ms",
  "100": "100ms",
  "150": "150ms",
  "200": "200ms",
  "300": "300ms",
  "500": "500ms",
  "700": "700ms",
  "1000": "1000ms",
} as const;

// =============================================================================
// Animation
// =============================================================================

export const animation = {
  none: "none",
  spin: "spin 1s linear infinite",
  ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  bounce: "bounce 1s infinite",
} as const;

// =============================================================================
// Keyframes (for reference/CSS generation)
// =============================================================================

export const keyframes = {
  spin: {
    to: { transform: "rotate(360deg)" },
  },
  ping: {
    "75%, 100%": { transform: "scale(2)", opacity: "0" },
  },
  pulse: {
    "50%": { opacity: ".5" },
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
    },
    "50%": {
      transform: "none",
      animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
    },
  },
} as const;

// =============================================================================
// Transform Origin
// =============================================================================

export const transformOrigin = {
  center: "center",
  top: "top",
  "top-right": "top right",
  right: "right",
  "bottom-right": "bottom right",
  bottom: "bottom",
  "bottom-left": "bottom left",
  left: "left",
  "top-left": "top left",
} as const;

// =============================================================================
// Scale
// =============================================================================

export const scale = {
  "0": "0",
  "50": ".5",
  "75": ".75",
  "90": ".9",
  "95": ".95",
  "100": "1",
  "105": "1.05",
  "110": "1.1",
  "125": "1.25",
  "150": "1.5",
} as const;

// =============================================================================
// Rotate
// =============================================================================

export const rotate = {
  "0": "0deg",
  "1": "1deg",
  "2": "2deg",
  "3": "3deg",
  "6": "6deg",
  "12": "12deg",
  "45": "45deg",
  "90": "90deg",
  "180": "180deg",
} as const;

// Negative rotations
export const rotateNegative = {
  "-1": "-1deg",
  "-2": "-2deg",
  "-3": "-3deg",
  "-6": "-6deg",
  "-12": "-12deg",
  "-45": "-45deg",
  "-90": "-90deg",
  "-180": "-180deg",
} as const;

// =============================================================================
// Translate
// =============================================================================

export const translate = {
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
  full: "100%",
} as const;

// =============================================================================
// Skew
// =============================================================================

export const skew = {
  "0": "0deg",
  "1": "1deg",
  "2": "2deg",
  "3": "3deg",
  "6": "6deg",
  "12": "12deg",
} as const;

export const skewNegative = {
  "-1": "-1deg",
  "-2": "-2deg",
  "-3": "-3deg",
  "-6": "-6deg",
  "-12": "-12deg",
} as const;

// =============================================================================
// Cursor
// =============================================================================

export const cursor = {
  auto: "auto",
  default: "default",
  pointer: "pointer",
  wait: "wait",
  text: "text",
  move: "move",
  help: "help",
  "not-allowed": "not-allowed",
  none: "none",
  "context-menu": "context-menu",
  progress: "progress",
  cell: "cell",
  crosshair: "crosshair",
  "vertical-text": "vertical-text",
  alias: "alias",
  copy: "copy",
  "no-drop": "no-drop",
  grab: "grab",
  grabbing: "grabbing",
  "all-scroll": "all-scroll",
  "col-resize": "col-resize",
  "row-resize": "row-resize",
  "n-resize": "n-resize",
  "e-resize": "e-resize",
  "s-resize": "s-resize",
  "w-resize": "w-resize",
  "ne-resize": "ne-resize",
  "nw-resize": "nw-resize",
  "se-resize": "se-resize",
  "sw-resize": "sw-resize",
  "ew-resize": "ew-resize",
  "ns-resize": "ns-resize",
  "nesw-resize": "nesw-resize",
  "nwse-resize": "nwse-resize",
  "zoom-in": "zoom-in",
  "zoom-out": "zoom-out",
} as const;

// =============================================================================
// User Select
// =============================================================================

export const userSelect = {
  none: "none",
  text: "text",
  all: "all",
  auto: "auto",
} as const;

// =============================================================================
// Pointer Events
// =============================================================================

export const pointerEvents = {
  none: "none",
  auto: "auto",
} as const;

// =============================================================================
// Resize
// =============================================================================

export const resize = {
  none: "none",
  y: "vertical",
  x: "horizontal",
  "": "both",
} as const;

// =============================================================================
// Scroll Behavior
// =============================================================================

export const scrollBehavior = {
  auto: "auto",
  smooth: "smooth",
} as const;

// =============================================================================
// Scroll Snap Type
// =============================================================================

export const scrollSnapType = {
  none: "none",
  x: "x var(--tw-scroll-snap-strictness)",
  y: "y var(--tw-scroll-snap-strictness)",
  both: "both var(--tw-scroll-snap-strictness)",
} as const;

export const scrollSnapStrictness = {
  mandatory: "mandatory",
  proximity: "proximity",
} as const;

// =============================================================================
// Scroll Snap Align
// =============================================================================

export const scrollSnapAlign = {
  start: "start",
  end: "end",
  center: "center",
  none: "none",
} as const;

// =============================================================================
// Will Change
// =============================================================================

export const willChange = {
  auto: "auto",
  scroll: "scroll-position",
  contents: "contents",
  transform: "transform",
} as const;

// =============================================================================
// Types
// =============================================================================

export type TransitionPropertyKey = keyof typeof transitionProperty;
export type TransitionDurationKey = keyof typeof transitionDuration;
export type TransitionTimingFunctionKey = keyof typeof transitionTimingFunction;
export type AnimationKey = keyof typeof animation;
export type TransformOriginKey = keyof typeof transformOrigin;
export type ScaleKey = keyof typeof scale;
export type RotateKey = keyof typeof rotate;
export type CursorKey = keyof typeof cursor;

// =============================================================================
// Combined Transitions Config
// =============================================================================

export const transitions = {
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
} as const;

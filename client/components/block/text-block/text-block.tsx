import type { TextBlockData } from "@/lib/blocks";
import { Text } from "@/components/ui/text";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import Link from "next/link";

type TextBlockProps = {
  data: TextBlockData;
};

// Size class maps for responsive overrides
const sizeClasses: Record<string, string> = {
  xs: "text-size-xs",
  sm: "text-size-sm",
  base: "text-size-base",
  md: "text-size-base",
  lg: "text-size-lg",
  xl: "text-size-xl",
  "2xl": "text-size-2xl",
  "3xl": "text-size-3xl",
  "4xl": "text-size-4xl",
  "5xl": "text-size-5xl",
  "6xl": "text-size-6xl",
};

// Align class maps for responsive overrides
const alignClasses: Record<string, string> = {
  left: "text-align-left",
  center: "text-align-center",
  right: "text-align-right",
  justify: "text-align-justify",
};

// Map opacity number to preset string
function getOpacityPreset(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return "10";
  if (opacity <= 25) return "25";
  if (opacity <= 50) return "50";
  if (opacity <= 75) return "75";
  if (opacity <= 90) return "90";
  return "100";
}

/**
 * Check if a URL is external (starts with http:// or https://)
 */
function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/**
 * Markdown link pattern: [text](url)
 */
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Parse text that may contain markdown-style links into React nodes.
 * Internal links use Next.js Link, external links use <a>.
 * Newlines are converted to <br /> elements.
 */
function parseMarkdownLinks(text: string): React.ReactNode {
  if (!MARKDOWN_LINK_RE.test(text)) {
    return text;
  }

  // Reset regex lastIndex since we used .test() above
  MARKDOWN_LINK_RE.lastIndex = 0;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = MARKDOWN_LINK_RE.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const linkText = match[1];
    const url = match[2];

    if (isExternalUrl(url)) {
      nodes.push(
        <a
          key={`link-${keyIndex++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>,
      );
    } else {
      nodes.push(
        <Link key={`link-${keyIndex++}`} href={url}>
          {linkText}
        </Link>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/**
 * Render text content, parsing markdown links and converting newlines to <br />.
 */
function renderTextContent(text: string): React.ReactNode {
  // Split by newlines first, then parse links in each segment
  const lines = text.split("\n");

  if (lines.length === 1) {
    return parseMarkdownLinks(text);
  }

  const result: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) {
      result.push(<br key={`br-${i}`} />);
    }
    result.push(
      <span key={`line-${i}`}>{parseMarkdownLinks(line)}</span>,
    );
  });

  return result;
}

/**
 * TextBlock - Data adapter for Text UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Text component with CMS data
 *
 * Supports comprehensive typography properties via data-* attributes:
 * - Size & Spacing: size, letterSpacing, lineHeight
 * - Style: weight, fontStyle, textTransform, textDecoration, variant
 * - Font: color (presets only)
 * - Layout: align, maxWidth, whiteSpace
 * - Multi-column: columns, columnGap
 * - Effects: opacity, dropCap
 * - Responsive overrides for size and align
 */
export function TextBlock({ data }: TextBlockProps) {
  const {
    size = "base",
    align = "left",
    variant = "default",
    weight,
    letterSpacing,
    lineHeight,
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    columns,
    columnGap,
    opacity,
    dropCap,
  } = data;

  // Check if we have HTML content (from TipTap editor)
  const hasHtml = Boolean(data.html);

  // Get plain text content for fallback
  const plainContent = data.text ?? data.content ?? "";

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Convert opacity number to preset string
  const opacityPreset = getOpacityPreset(opacity);

  // Render HTML content if available (uses data-* attributes on wrapper div)
  if (hasHtml) {
    // Get responsive values for HTML rendering
    const sizeValues = getResponsiveValues<string>(
      data as Record<string, unknown>,
      "size",
    );
    const alignValues = getResponsiveValues<string>(
      data as Record<string, unknown>,
      "align",
    );

    const responsiveClasses = hasOverrides
      ? cn(
          generateResponsiveClasses(sizeClasses, sizeValues, size),
          generateResponsiveClasses(alignClasses, alignValues, align),
        )
      : "";

    return (
      <div
        className={cn(
          "text text-block prose prose-sm max-w-none",
          responsiveClasses,
        )}
        data-size={!hasOverrides ? size : undefined}
        data-align={!hasOverrides ? align : undefined}
        data-variant={variant}
        data-weight={weight}
        data-letter-spacing={letterSpacing}
        data-line-height={lineHeight}
        data-font-style={fontStyle}
        data-text-transform={textTransform}
        data-text-decoration={textDecoration}
        data-white-space={whiteSpace}
        data-max-width={maxWidth}
        data-columns={columns}
        data-column-gap={columnGap}
        data-opacity={opacityPreset}
        data-color={color}
        data-drop-cap={dropCap}
        dangerouslySetInnerHTML={{ __html: data.html! }}
      />
    );
  }

  // Get responsive values for plain text
  const sizeValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "size",
  );
  const alignValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "align",
  );

  const responsiveClasses = hasOverrides
    ? cn(
        generateResponsiveClasses(sizeClasses, sizeValues, size),
        generateResponsiveClasses(alignClasses, alignValues, align),
      )
    : "";

  return (
    <Text
      as="p"
      size={
        !hasOverrides ? (size as "base" | "xs" | "sm" | "lg" | "xl") : undefined
      }
      align={!hasOverrides ? align : undefined}
      variant={variant as "default" | "muted" | "lead" | "subtle"}
      weight={weight}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      fontStyle={fontStyle}
      textTransform={textTransform}
      textDecoration={textDecoration}
      whiteSpace={whiteSpace}
      maxWidth={
        maxWidth as
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "prose"
          | "none"
          | undefined
      }
      columns={columns}
      columnGap={columnGap}
      opacity={
        opacityPreset as "10" | "25" | "50" | "75" | "90" | "100" | undefined
      }
      color={
        color as
          | "default"
          | "primary"
          | "secondary"
          | "muted"
          | "accent"
          | "destructive"
          | undefined
      }
      dropCap={dropCap}
      className={responsiveClasses}
    >
      {renderTextContent(plainContent)}
    </Text>
  );
}

/**
 * Generate responsive CSS classes using Tailwind prefixes
 */
function generateResponsiveClasses(
  classMap: Record<string, string>,
  values: { base?: string; tablet?: string; mobile?: string },
  defaultValue?: string,
): string {
  const classes: string[] = [];
  const { base, tablet, mobile } = values;

  // Determine effective values at each breakpoint (mobile-first)
  const mobileValue = mobile ?? tablet ?? base ?? defaultValue;
  const tabletValue = tablet ?? base ?? defaultValue;
  const desktopValue = base ?? defaultValue;

  // If all values are the same, just return base class
  if (mobileValue === tabletValue && tabletValue === desktopValue) {
    if (desktopValue && classMap[desktopValue]) {
      return classMap[desktopValue];
    }
    return "";
  }

  // Mobile base (no prefix)
  if (mobileValue && classMap[mobileValue]) {
    classes.push(classMap[mobileValue]);
  }

  // Tablet override (md: prefix)
  if (tabletValue && tabletValue !== mobileValue && classMap[tabletValue]) {
    classes.push(`md:${classMap[tabletValue]}`);
  }

  // Desktop override (lg: prefix)
  if (desktopValue && desktopValue !== tabletValue && classMap[desktopValue]) {
    classes.push(`lg:${classMap[desktopValue]}`);
  }

  return classes.join(" ");
}

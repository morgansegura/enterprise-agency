import type { VideoBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./video-block.css";

type VideoBlockProps = {
  data: VideoBlockData;
};

// Aspect ratio class maps for responsive
const aspectClasses: Record<string, string> = {
  "16:9": "video-aspect-16-9",
  "4:3": "video-aspect-4-3",
  "1:1": "video-aspect-1-1",
  "21:9": "video-aspect-21-9",
};

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

/**
 * VideoBlock - Renders video content (YouTube, Vimeo, or native)
 * Content block (leaf node) - cannot have children
 * Data should contain pre-processed embed URL
 *
 * Supports responsive overrides for aspectRatio
 */
export function VideoBlock({ data }: VideoBlockProps) {
  const {
    url,
    provider = "native",
    aspectRatio = "16:9",
    autoplay = false,
    controls = true,
    muted = false,
    loop = false,
    caption,
  } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <figure data-slot="video-block">
        <div data-slot="video-block-wrapper" data-aspect-ratio={aspectRatio}>
          {provider === "native" ? (
            <video
              data-slot="video-block-video"
              src={url}
              controls={controls}
              autoPlay={autoplay}
              muted={muted}
              loop={loop}
            />
          ) : (
            <iframe
              data-slot="video-block-iframe"
              src={url}
              title={caption || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        {caption ? (
          <figcaption data-slot="video-block-caption">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  // Get responsive values
  const aspectValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "aspectRatio",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(aspectClasses, aspectValues, aspectRatio),
  );

  return (
    <figure data-slot="video-block">
      <div data-slot="video-block-wrapper" className={responsiveClasses}>
        {provider === "native" ? (
          <video
            data-slot="video-block-video"
            src={url}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
          />
        ) : (
          <iframe
            data-slot="video-block-iframe"
            src={url}
            title={caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {caption ? (
        <figcaption data-slot="video-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

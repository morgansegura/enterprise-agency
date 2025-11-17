"use client";

import type { LogoConfig, LogoSize } from "@/lib/logos/types";
import { isImageLogo, isSvgLogo } from "@/lib/logos/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import "./logo.css";

type LogoProps = {
  config: LogoConfig;
  size?: LogoSize;
  className?: string;
  clickable?: boolean; // Whether logo should be a link (default: true)
};

/**
 * Logo Component
 * Reusable logo that supports both image and SVG
 * Can be used in header, footer, content blocks, etc.
 */
export function Logo({
  config,
  size = "md",
  className,
  clickable = true,
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const logoLink = config.link || "/";

  const renderLogo = () => {
    if (isImageLogo(config)) {
      // Image-based logo
      const src = isDark && config.srcDark ? config.srcDark : config.src;

      return (
        <Image
          src={src}
          alt={config.alt}
          width={config.width}
          height={config.height}
          className="logo-image"
          priority
        />
      );
    }

    if (isSvgLogo(config)) {
      // SVG-based logo
      const svgMarkup = isDark && config.svgDark ? config.svgDark : config.svg;

      return (
        <div
          className="logo-svg"
          style={{
            width: config.width,
            height: config.height,
          }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
          aria-label={config.alt}
        />
      );
    }

    return null;
  };

  const logoElement = (
    <div className={cn("logo", className)} data-size={size}>
      {renderLogo()}
    </div>
  );

  // Wrap in link if clickable
  if (clickable) {
    return (
      <Link href={logoLink} className="logo-link">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

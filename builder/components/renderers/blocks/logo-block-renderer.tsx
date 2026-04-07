/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface LogoBlockData {
  src: string;
  alt: string;
  href?: string;
  size: "sm" | "md" | "lg" | "xl";
  align: "left" | "center" | "right";
  openInNewTab?: boolean;
}

export default function LogoBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as LogoBlockData;
  const {
    src,
    alt = "Logo",
    href,
    size = "md",
    align = "left",
    openInNewTab,
  } = data;

  if (!src) {
    return (
      <div data-slot="logo-block" data-align={align}>
        <span data-slot="logo-block-empty">No logo set</span>
      </div>
    );
  }

  const logoImage = (
    <img
      src={src}
      alt={alt}
      data-size={size}
      data-slot="logo-image"
    />
  );

  return (
    <div data-slot="logo-block" data-align={align}>
      {href ? (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          data-slot="logo-link"
        >
          {logoImage}
        </a>
      ) : (
        logoImage
      )}
    </div>
  );
}

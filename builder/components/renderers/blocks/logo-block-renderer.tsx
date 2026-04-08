/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

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

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  if (!src) {
    return (
      <div
        className={elementClass}
        data-slot="logo-block"
        data-align={hasStyle("textAlign") ? undefined : align}
      >
        <span data-slot="logo-block-empty">No logo set</span>
      </div>
    );
  }

  const logoImage = (
    <img
      src={src}
      alt={alt}
      data-size={hasStyle("width") ? undefined : size}
      data-slot="logo-image"
    />
  );

  return (
    <div
      className={elementClass}
      data-slot="logo-block"
      data-align={hasStyle("textAlign") ? undefined : align}
    >
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

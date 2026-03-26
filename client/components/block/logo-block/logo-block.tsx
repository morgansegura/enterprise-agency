/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
import "./logo-block.css";

type LogoBlockData = {
  src: string;
  alt: string;
  href?: string;
  size: "sm" | "md" | "lg" | "xl";
  align: "left" | "center" | "right";
  openInNewTab?: boolean;
};

/**
 * LogoBlock - Logo as a content block
 * Can be dropped anywhere in the block editor (footer, privacy page, etc.)
 */
export function LogoBlock({ data }: { data: LogoBlockData }) {
  const { src, alt, href, size = "md", align = "left", openInNewTab } = data;

  if (!src) {
    return null;
  }

  const logoImage = (
    <img
      src={src}
      alt={alt || "Logo"}
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

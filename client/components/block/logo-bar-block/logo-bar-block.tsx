import type { LogoBarBlockData } from "@/lib/blocks";
import "./logo-bar-block.css";

type LogoBarBlockProps = {
  data: LogoBarBlockData;
};

/**
 * LogoBarBlock - Renders a horizontal strip of logos with optional heading
 * Content block (leaf node) - cannot have children
 */
export function LogoBarBlock({ data }: LogoBarBlockProps) {
  const {
    logos = [],
    heading,
    variant = "default",
    size = "md",
  } = data;

  if (logos.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="logo-bar-block"
      data-variant={variant}
      data-size={size}
    >
      {heading ? (
        <div data-slot="logo-bar-block-heading">{heading}</div>
      ) : null}

      <div data-slot="logo-bar-block-logos">
        {logos.map((logo, index) => {
          const img = (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic CMS images
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              data-slot="logo-bar-block-img"
            />
          );

          if (logo.href) {
            return (
              <a
                key={index}
                href={logo.href}
                data-slot="logo-bar-block-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {img}
              </a>
            );
          }

          return img;
        })}
      </div>
    </div>
  );
}

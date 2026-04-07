/* eslint-disable @next/next/no-img-element -- dynamic CMS images */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface LogoBarBlockData {
  logos: { src: string; alt: string; href?: string }[];
  heading?: string;
  variant?: "default" | "grayscale" | "bordered";
  size?: "sm" | "md" | "lg";
}

export default function LogoBarBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as LogoBarBlockData;
  const {
    logos = [],
    heading,
    variant = "default",
    size = "md",
  } = data;

  if (logos.length === 0) {
    return (
      <div data-slot="logo-bar-block" data-variant={variant} data-size={size}>
        <p data-slot="logo-bar-block-empty">No logos added yet</p>
      </div>
    );
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
        {logos.map((logo, i) => {
          const img = (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              data-slot="logo-bar-block-img"
            />
          );

          if (logo.href) {
            return (
              <a
                key={i}
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

import type { HeroBlockData } from "@/lib/blocks";
import Link from "next/link";
import "./hero-block.css";

type HeroBlockProps = {
  data: HeroBlockData;
};

/**
 * HeroBlock - Renders a hero section with heading, subheading,
 * description, CTA buttons, and optional background image.
 * Content block (leaf node) - cannot have children
 */
export function HeroBlock({ data }: HeroBlockProps) {
  const {
    heading,
    subheading,
    description,
    primaryCta,
    secondaryCta,
    image,
    layout = "centered",
    overlay = false,
    align = "center",
    size = "md",
  } = data;

  return (
    <section
      data-slot="hero-block"
      data-layout={layout}
      data-align={align}
      data-size={size}
      data-overlay={overlay || undefined}
    >
      {image?.src ? (
        <div data-slot="hero-block-bg">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic CMS images */}
          <img
            src={image.src}
            alt={image.alt}
            data-slot="hero-block-bg-img"
          />
          {overlay ? <div data-slot="hero-block-overlay" /> : null}
        </div>
      ) : null}

      <div data-slot="hero-block-content">
        {subheading ? (
          <p data-slot="hero-block-subheading">{subheading}</p>
        ) : null}

        <h1 data-slot="hero-block-heading">{heading}</h1>

        {description ? (
          <p data-slot="hero-block-description">{description}</p>
        ) : null}

        {primaryCta || secondaryCta ? (
          <div data-slot="hero-block-actions">
            {primaryCta ? (
              <Link
                href={primaryCta.href}
                data-slot="hero-block-primary-cta"
              >
                {primaryCta.text}
              </Link>
            ) : null}

            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                data-slot="hero-block-secondary-cta"
              >
                {secondaryCta.text}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

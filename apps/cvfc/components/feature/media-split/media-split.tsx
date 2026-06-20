import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

import "./media-split.css";

export type MediaSplitButton = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
  iconToken?: string;
  /** Set to "_blank" for external links (opens in a new tab, plain anchor). */
  target?: "_blank";
};

type MediaSplitProps = {
  className?: string;
  eyebrow?: string;
  heading: string;
  body: React.ReactNode;
  image: { src: string; alt: string };
  tags?: string[];
  buttons?: MediaSplitButton[];
  reverse?: boolean;
  background?: "bone" | "white";
  /** "side" = image and content side-by-side (default). "stack" = image above content. */
  layout?: "side" | "stack";
  /** "cover" = full bleed photo (default). "avatar" = small circular thumbnail. */
  imageStyle?: "cover" | "avatar";
};

export function MediaSplit({
  className,
  eyebrow,
  heading,
  body,
  image,
  tags,
  buttons,
  reverse = false,
  background = "bone",
  layout = "side",
  imageStyle = "cover",
}: MediaSplitProps) {
  return (
    <section
      data-bg={background}
      data-reverse={reverse ? "true" : "false"}
      data-layout={layout}
      data-image-style={imageStyle}
      className={cn("media-split", className)}
    >
      <div className="media-split-inner contain">
        <figure className="media-split-figure">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 320px, 100vw"
            className="media-split-image"
          />
          {tags && tags.length > 0 ? (
            <div className="media-split-tags">
              {tags.map((tag) => (
                <span key={tag} className="media-split-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </figure>

        <div className="media-split-content">
          {eyebrow ? (
            <p className="media-split-eyebrow">
              <span className="eyebrow-rule" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h2 className="media-split-heading">{heading}</h2>
          <div className="media-split-body">{body}</div>
          {buttons && buttons.length > 0 ? (
            <div className="media-split-buttons">
              {buttons.map((btn) => (
                <Button
                  key={btn.label}
                  variant={btn.variant ?? "default"}
                  render={
                    btn.target === "_blank" ? (
                      <a
                        href={btn.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ) : (
                      <Link href={btn.href} />
                    )
                  }
                >
                  {btn.iconToken ? (
                    <Icon token={btn.iconToken as never} aria-hidden="true" />
                  ) : null}
                  <span>{btn.label}</span>
                  <Icon token="ri:arrow-right" aria-hidden="true" />
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

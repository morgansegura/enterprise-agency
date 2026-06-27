"use client";

import { CmsImage as Image } from "@/components/ui/cms-image";

import { LogoIcon } from "@/components/layout";
import { useReveal } from "@/lib/hooks/use-reveal";
import { cn } from "@/lib/utils";

import "./welcome-banner.css";

const DEFAULT_BODY =
  "Since 1982, Chula Vista FC has been dedicated and driven by a passion for developing players as athletes and as people. We're committed to providing the highest level of training, mentorship, and opportunity so every player can reach their full potential in the game and in life. Our passion lies in helping athletes grow, fostering a love for playing beautiful football, and creating opportunities for every player to reach their highest potential.";

const DEFAULT_IMAGE = {
  src: "https://chulavistafc.com/wp-content/uploads/2023/02/SEB01049-scaled.jpg",
  alt: "Chula Vista FC players celebrating",
};

type WelcomeBannerProps = {
  className?: string;
  eyebrow?: string;
  heading?: string;
  headingAs?: "h1" | "h2";
  body?: React.ReactNode;
  image?: { src: string; alt: string };
};

export function WelcomeBanner({
  className,
  eyebrow = "Since 1982",
  heading = "Welcome to Chula Vista Fútbol Club",
  headingAs = "h1",
  body = DEFAULT_BODY,
  image = DEFAULT_IMAGE,
}: WelcomeBannerProps) {
  const [ref, revealed] = useReveal<HTMLElement>();

  const HeadingComponent = headingAs;

  return (
    <section
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className={cn("welcome-banner", className)}
      aria-labelledby="welcome-banner-heading"
    >
      <div className="welcome-banner-grain" aria-hidden="true" />

      <div className="welcome-banner-inner contain">
        <figure className="welcome-banner-figure">
          <div className="welcome-banner-figure-frame">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="welcome-banner-image"
            />
            <div className="welcome-banner-figure-tint" aria-hidden="true" />
            <LogoIcon className="welcome-banner-figure-mark" />
          </div>
          <figcaption className="welcome-banner-figure-caption">
            <span>Est. 1982</span>
            <span className="welcome-banner-figure-dot" />
            <span>Chula Vista, California</span>
          </figcaption>
        </figure>

        <div className="welcome-banner-content">
          <p className="welcome-banner-eyebrow">
            <span className="eyebrow-rule" aria-hidden="true" />
            {eyebrow}
          </p>

          <HeadingComponent
            id="welcome-banner-heading"
            className="welcome-banner-heading"
          >
            {heading}
          </HeadingComponent>

          <div className="welcome-banner-body">{body}</div>

          <dl className="welcome-banner-stats">
            <div>
              <dt>Club Founded</dt>
              <dd>1982</dd>
            </div>
            <div>
              <dt>Players Developed</dt>
              <dd>4,000+</dd>
            </div>
            <div>
              <dt>Pathway Stages</dt>
              <dd>04</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { FaqAccordion } from "@/components/feature/faq-accordion";
import {
  landingScreenMock,
  type TestimonialsBlock,
} from "@/data/mocks/landing-screen.mock";

import "./testimonials.css";

type TestimonialsProps = {
  content?: TestimonialsBlock;
};

/** Testimonials — eyebrow + heading + reviews link, an accordion of quotes, and
 *  an image. `imagePosition` swaps sides. Mock-driven. */
export function Testimonials({
  content = landingScreenMock.testimonials,
}: TestimonialsProps) {
  const position = content.imagePosition ?? "right";

  return (
    <Section
      ariaLabel={content.eyebrow ?? "Testimonials"}
      className="testimonials"
    >
      <div className="testimonials-grid" data-image={position}>
        <div className="testimonials-copy">
          {content.eyebrow ? (
            <Eyebrow className="testimonials-eyebrow">
              {content.eyebrow}
            </Eyebrow>
          ) : null}

          <Heading as="h2" size="lg" className="testimonials-heading">
            {content.heading}
          </Heading>

          {content.link ? (
            <p className="testimonials-link">
              <Link href={content.link.href} className="testimonials-link-cta">
                {content.link.label}
              </Link>
              {content.note ? (
                <span className="testimonials-note"> - {content.note}</span>
              ) : null}
            </p>
          ) : null}

          <FaqAccordion
            items={content.items}
            className="testimonials-accordion"
          />
        </div>

        <div className="testimonials-media">
          <Image
            src={content.image.url}
            alt={content.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="testimonials-image"
          />
        </div>
      </div>
    </Section>
  );
}

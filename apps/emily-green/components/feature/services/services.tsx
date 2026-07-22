import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout";
import { Button, Eyebrow, Heading } from "@/components/ui";
import {
  landingScreenMock,
  type ServiceCard,
  type ServicesBlock,
} from "@/data/mocks/landing-screen.mock";

import "./services.css";

type ServicesProps = {
  content?: ServicesBlock;
};

function Card({ card }: { card: ServiceCard }) {
  if (card.image) {
    return (
      <figure className="services-card-figure">
        <div className="services-card-media">
          <Image
            src={card.image.url}
            alt={card.image.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="services-card-image"
          />
        </div>
        {card.label ? (
          <figcaption className="services-card-label">{card.label}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div className="services-card-text">
      {card.heading ? (
        <p className="services-card-heading">{card.heading}</p>
      ) : null}
      {card.body ? <p className="services-card-body">{card.body}</p> : null}
      {card.cta ? (
        <Button variant="outline" asChild className="services-card-cta">
          <Link href={card.cta.href}>{card.cta.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}

/** Services — dark section: eyebrow + heading + a grid of cards (a text card and
 *  image cards). Mock-driven. */
export function Services({
  content = landingScreenMock.services,
}: ServicesProps) {
  return (
    <Section
      bg="primary"
      ariaLabel={content.eyebrow ?? "Services"}
      className="services"
    >
      {content.eyebrow ? (
        <Eyebrow className="services-eyebrow">{content.eyebrow}</Eyebrow>
      ) : null}

      <Heading as="h2" size="xl" className="services-heading">
        {content.heading}
      </Heading>

      <div className="services-resource-links">
        <h3 className="services-resource-links-title">
          {content?.resourceTitle}
        </h3>
        {content?.resourceLinks?.map((link, index) => (
          <div className="services-resource-link" key={index}>
            <Link href={link?.href} target={link?.target} rel={link?.rel}>
              {link?.label}
            </Link>
          </div>
        ))}
      </div>

      <ul className="services-cards">
        {content.cards.map((card, i) => (
          <li key={i} className="services-card">
            <Card card={card} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

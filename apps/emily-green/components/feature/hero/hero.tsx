import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout";
import { Button, Heading, Text } from "@/components/ui";
import {
  landingScreenMock,
  type HeroBlock,
} from "@/data/mocks/landing-screen.mock";

import "./hero.css";

type HeroProps = {
  content?: HeroBlock;
};

/** Landing hero — name + serif headline + intro beside a portrait, on the brand
 *  dark ground. Renders from the mock; a CMS hero block overrides it (same shape). */
export function Hero({ content = landingScreenMock.hero }: HeroProps) {
  return (
    <Section size="hero" bg="primary" ariaLabel="Introduction" className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          {content.eyebrow ? (
            <p className="hero-eyebrow">{content.eyebrow}</p>
          ) : null}
          {content.role ? <p className="hero-role">{content.role}</p> : null}

          <Heading as="h1" size="xl" className="hero-heading">
            {content.heading}
          </Heading>

          {content.body?.length ? (
            <div className="hero-body">
              {content.body.map((paragraph, i) => (
                <Text key={i} className="hero-paragraph">
                  {paragraph}
                </Text>
              ))}
            </div>
          ) : null}

          {content.stats?.length ? (
            <ul className="hero-stats">
              {content.stats.map((stat) => (
                <li key={stat.label} className="hero-stat">
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {content.cta ? (
            <Button asChild className="hero-cta">
              <Link href={content.cta.href}>{content.cta.label}</Link>
            </Button>
          ) : null}
        </div>

        <div className="hero-media">
          <Image
            src={content.image.url}
            alt={content.image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="hero-image"
          />
        </div>
      </div>
    </Section>
  );
}

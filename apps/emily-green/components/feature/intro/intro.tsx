import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout";
import { Button, Eyebrow, Heading, Text } from "@/components/ui";
import {
  landingScreenMock,
  type IntroBlock,
} from "@/data/mocks/landing-screen.mock";

import "./intro.css";

type IntroProps = {
  content?: IntroBlock;
};

/** Intro / about block — eyebrow → heading → body → CTA, stacked (optional image
 *  stacks below). Mock-driven; a CMS block overrides it (same shape). */
export function Intro({ content = landingScreenMock.intro }: IntroProps) {
  return (
    <Section ariaLabel={content.eyebrow ?? "About"} className="intro">
      <div className="intro-inner">
        {content.eyebrow ? (
          <Eyebrow className="intro-eyebrow">{content.eyebrow}</Eyebrow>
        ) : null}

        <Heading as="h2" size="lg" className="intro-heading">
          {content.heading}
        </Heading>

        {content.body?.length ? (
          <div className="intro-body">
            {content.body.map((paragraph, i) => (
              <Text key={i} className="intro-paragraph">
                {paragraph}
              </Text>
            ))}
          </div>
        ) : null}

        {content.cta ? (
          <Button asChild className="intro-cta">
            <Link href={content.cta.href}>{content.cta.label}</Link>
          </Button>
        ) : null}

        {content.image ? (
          <div className="intro-media">
            <Image
              src={content.image.url}
              alt={content.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="intro-image"
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

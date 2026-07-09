import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout";
import { Button, Eyebrow, Heading, Text } from "@/components/ui";
import { Stats } from "@/components/feature/stats";
import {
  landingScreenMock,
  type ImageTextBlock,
} from "@/data/mocks/landing-screen.mock";

import "./image-text.css";

type ImageTextProps = {
  content?: ImageTextBlock;
};

/** Image + text, two columns. `imagePosition` swaps the sides (desktop). Text
 *  side: eyebrow → heading → body → CTA → optional stats. Mock-driven. */
export function ImageText({
  content = landingScreenMock.serving,
}: ImageTextProps) {
  const position = content.imagePosition ?? "left";

  return (
    <Section
      ariaLabel={content.eyebrow ?? content.heading}
      className="image-text"
    >
      <div className="image-text-grid" data-image={position}>
        <div className="image-text-media">
          <Image
            src={content.image.url}
            alt={content.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="image-text-image"
          />
        </div>

        <div className="image-text-copy">
          {content.eyebrow ? (
            <Eyebrow className="image-text-eyebrow">{content.eyebrow}</Eyebrow>
          ) : null}

          <Heading as="h2" size="lg" className="image-text-heading">
            {content.heading}
          </Heading>

          {content.body?.length ? (
            <div className="image-text-body">
              {content.body.map((paragraph, i) => (
                <Text key={i} className="image-text-paragraph">
                  {paragraph}
                </Text>
              ))}
            </div>
          ) : null}

          {content.cta ? (
            <Button asChild className="image-text-cta">
              <Link href={content.cta.href}>{content.cta.label}</Link>
            </Button>
          ) : null}

          {content.stats?.length ? (
            <Stats
              items={content.stats}
              variant="divider"
              className="image-text-stats"
            />
          ) : null}
        </div>
      </div>
    </Section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout";
import { Text } from "@/components/ui";
import { Stats } from "@/components/feature/stats";
import {
  landingScreenMock,
  type StatsImageBlock,
} from "@/data/mocks/landing-screen.mock";

import "./stats-image.css";

type StatsImageProps = {
  content?: StatsImageBlock;
};

/** Stats + supporting copy over a full-width image. Mock-driven. */
export function StatsImage({
  content = landingScreenMock.statsImage,
}: StatsImageProps) {
  return (
    <Section ariaLabel="By the numbers" className="stats-image">
      <div className="stats-image-top">
        <Stats
          items={content.stats}
          variant="plain"
          className="stats-image-stats"
        />

        <div className="stats-image-text">
          {content.body?.length ? (
            <div className="stats-image-body">
              {content.body.map((paragraph, i) => (
                <Text key={i} className="stats-image-paragraph">
                  {paragraph}
                </Text>
              ))}
            </div>
          ) : null}

          {content.cta ? (
            <Link href={content.cta.href} className="stats-image-cta">
              {content.cta.label}
              <ArrowRight className="stats-image-cta-icon" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="stats-image-media">
        <Image
          src={content.image.url}
          alt={content.image.alt}
          fill
          sizes="100vw"
          className="stats-image-image"
        />
      </div>
    </Section>
  );
}

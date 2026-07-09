import Image from "next/image";

import { Section } from "@/components/layout";
import {
  landingScreenMock,
  type LogoCarouselBlock,
  type LogoItem,
} from "@/data/mocks/landing-screen.mock";

import "./logo-carousel.css";

type LogoCarouselProps = {
  content?: LogoCarouselBlock;
};

function LogoMark({ logo }: { logo: LogoItem }) {
  if (logo.image?.url) {
    return (
      <Image
        src={logo.image.url}
        alt={logo.image.alt}
        width={160}
        height={48}
        className="logo-carousel-image"
      />
    );
  }
  return <span className="logo-carousel-name">{logo.name}</span>;
}

/** Auto-scrolling banner of partner/lender logos. Seamless loop (track rendered
 *  twice), pauses on hover, respects reduced motion. Mock-driven. */
export function LogoCarousel({
  content = landingScreenMock.logoCarousel,
}: LogoCarouselProps) {
  const { heading, logos } = content;
  if (!logos?.length) return null;

  return (
    <Section
      size="compact"
      ariaLabel={heading ?? "Partners"}
      className="logo-carousel"
    >
      {heading ? <p className="logo-carousel-heading">{heading}</p> : null}

      <div className="logo-carousel-viewport">
        <div className="logo-carousel-marquee">
          {[0, 1].map((track) => (
            <ul
              key={track}
              className="logo-carousel-track"
              aria-hidden={track === 1 ? "true" : undefined}
            >
              {logos.map((logo, i) => (
                <li key={`${track}-${i}`} className="logo-carousel-item">
                  <LogoMark logo={logo} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Section>
  );
}

import { Section } from "@/components/layout";
import { Heading, Text } from "@/components/ui";
import {
  landingScreenMock,
  type TitleBlock,
} from "@/data/mocks/landing-screen.mock";

import "./title.css";

type TitleProps = {
  content?: TitleBlock;
};

/** Section title — serif heading + optional subtitle. Mock-driven. */
export function Title({ content = landingScreenMock.title }: TitleProps) {
  return (
    <Section size="compact" ariaLabel={content.heading} className="title">
      <div className="title-inner">
        <Heading as="h2" size="xl" className="title-heading">
          {content.heading}
        </Heading>
        {content.subtitle ? (
          <Text size="sm" tone="muted" className="title-subtitle">
            {content.subtitle}
          </Text>
        ) : null}
      </div>
    </Section>
  );
}

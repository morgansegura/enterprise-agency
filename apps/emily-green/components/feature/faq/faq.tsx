import { Section } from "@/components/layout";
import { FaqSchema } from "@/components/seo";
import { Heading, Text } from "@/components/ui";
import { FaqAccordion } from "@/components/feature/faq-accordion";
import {
  landingScreenMock,
  type FaqBlock,
} from "@/data/mocks/landing-screen.mock";

import "./faq.css";

type FaqProps = {
  content?: FaqBlock;
};

/** FAQ — centered header + an accordion of Q&A (reuses FaqAccordion). Mock-driven. */
export function Faq({ content = landingScreenMock.faq }: FaqProps) {
  return (
    <Section ariaLabel={content.heading} className="faq">
      <FaqSchema
        items={content.items.map((item) => ({
          question: item.title,
          answer: item.content,
        }))}
      />
      <div className="faq-head">
        {content.eyebrow ? (
          <p className="faq-eyebrow">{content.eyebrow}</p>
        ) : null}
        <Heading as="h2" size="lg" className="faq-heading">
          {content.heading}
        </Heading>
        {content.subtitle ? (
          <Text size="sm" tone="muted" className="faq-subtitle">
            {content.subtitle}
          </Text>
        ) : null}
      </div>

      <FaqAccordion items={content.items} className="faq-list" />
    </Section>
  );
}

import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/ui";
import { Icon } from "@/components/icon";
import { FAQ_ENTRIES, type FaqEntry } from "@/data/faq";
import { cn } from "@/lib/utils";

import "./faq-section.css";

type FaqSectionProps = {
  className?: string;
  heading?: string;
  description?: string;
  entries?: FaqEntry[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function FaqSection({
  className,
  heading = "Questions from our community.",
  description = "At Chula Vista FC, we’re more than a club — we’re a connected, supportive community. Explore our FAQ to learn how you and your player can become part of our journey and grow with us.",
  entries = FAQ_ENTRIES,
  ctaLabel = "Read More FAQ's",
  ctaHref = "/faq",
}: FaqSectionProps) {
  return (
    <section className={cn("faq-section", className)}>
      <div className="faq-section-inner contain">
        <header className="faq-section-heading-block">
          <p className="eyebrow-full">FAQ</p>
          <h2 className="faq-section-heading">{heading}</h2>
          {description ? (
            <p className="faq-section-description">{description}</p>
          ) : null}
        </header>

        <Accordion type="single" collapsible className="faq-section-accordion">
          {entries.map((entry) => (
            <AccordionItem key={entry.id} value={entry.id}>
              <AccordionTrigger>{entry.question}</AccordionTrigger>
              <AccordionContent>
                <p className="faq-section-answer">{entry.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="faq-section-cta-row">
          <Button variant="secondary" render={<Link href={ctaHref} />}>
            <Icon
              token="ri:clipboard-list"
              className="faq-section-cta-icon-left"
            />
            <span>{ctaLabel}</span>
            <span className="faq-section-cta-arrow" aria-hidden="true">
              →
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}

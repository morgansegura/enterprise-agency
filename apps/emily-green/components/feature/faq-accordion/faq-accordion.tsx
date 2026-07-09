"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import type { AccordionEntry } from "@/data/mocks/landing-screen.mock";
import { cn } from "@/lib/utils";

import "./faq-accordion.css";

type FaqAccordionProps = {
  items: AccordionEntry[];
  className?: string;
};

/** Reusable expandable list — testimonial quotes, FAQ Q&A, etc. Each row is a
 *  title trigger that expands to its content. */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  if (!items?.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("faq-accordion", className)}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="faq-accordion-item"
        >
          <AccordionTrigger className="faq-accordion-trigger">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="faq-accordion-content">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

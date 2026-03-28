"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FaqBlockProps {
  data: {
    heading?: string;
    description?: string;
    items?: Array<{ question: string; answer: string }>;
  };
}

export function FaqBlock({ data }: FaqBlockProps) {
  const { heading, description, items = [] } = data;
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {heading && <h3 className="text-xl font-bold text-center mb-2">{heading}</h3>}
      {description && <p className="text-muted-foreground text-center mb-6">{description}</p>}
      <div className="border rounded-lg divide-y">
        {items.map((item, i) => (
          <div key={i}>
            <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-muted/50" onClick={() => toggle(i)}>
              <span>{item.question}</span>
              <span className={cn("transition-transform duration-200", openItems.has(i) && "rotate-180")}>▾</span>
            </button>
            {openItems.has(i) && <div className="px-4 pb-4 text-sm text-muted-foreground">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

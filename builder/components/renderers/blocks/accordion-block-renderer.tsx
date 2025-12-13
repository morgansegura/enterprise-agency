"use client";

import * as React from "react";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

interface AccordionBlockData {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
}

const variantClasses = {
  default: "border border-border rounded-lg divide-y divide-border",
  bordered: "border border-border rounded-lg divide-y divide-border shadow-sm",
  separated: "space-y-2",
};

const itemVariantClasses = {
  default: "",
  bordered: "",
  separated: "border border-border rounded-lg",
};

export default function AccordionBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as AccordionBlockData;
  const { items = [], allowMultiple = false, variant = "default" } = data;

  const [openItems, setOpenItems] = React.useState<Set<number>>(() => {
    const initial = new Set<number>();
    items.forEach((item, index) => {
      if (item.defaultOpen) initial.add(index);
    });
    return initial;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={variantClasses[variant]}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index} className={itemVariantClasses[variant]}>
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50",
                variant === "separated" && "rounded-lg",
              )}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

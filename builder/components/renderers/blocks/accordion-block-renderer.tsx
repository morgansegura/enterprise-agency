"use client";

import * as React from "react";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { ChevronDown } from "lucide-react";
import { getElementClass } from "@enterprise/tokens";

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

export default function AccordionBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as AccordionBlockData;
  const {
    items = [],
    allowMultiple = false,
    variant = "default",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  // Suppress unused-var lint — hasStyle is available for future style overrides
  void hasStyle;

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
    <div
      className={elementClass}
      data-slot="accordion-block"
      data-variant={variant}
      data-allow-multiple={allowMultiple}
    >
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div
            key={index}
            data-slot="accordion-block-item"
            data-open={isOpen || undefined}
          >
            <button
              type="button"
              data-slot="accordion-block-trigger"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== item.title && onChange) {
                    const updated = [...items];
                    updated[index] = { ...item, title: v };
                    onChange({
                      ...block,
                      data: { ...block.data, items: updated },
                    });
                  }
                }}
                onClick={(e) => isEditing && e.stopPropagation()}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {item.title}
              </span>
              <ChevronDown
                data-slot="accordion-block-icon"
                data-open={isOpen || undefined}
              />
            </button>
            {isOpen ? (
              <div
                data-slot="accordion-block-content"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (v !== item.content && onChange) {
                    const updated = [...items];
                    updated[index] = { ...item, content: v };
                    onChange({
                      ...block,
                      data: { ...block.data, items: updated },
                    });
                  }
                }}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

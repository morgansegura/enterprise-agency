"use client";

import * as React from "react";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqBlockData {
  heading?: string;
  description?: string;
  items: FaqItem[];
}

export default function FaqBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as FaqBlockData;
  const { heading, description, items = [] } = data;
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    if (!onChange) return;
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...block, data: { ...block.data, items: updated } });
  };

  return (
    <div data-slot="faq-block" className="max-w-2xl mx-auto">
      {(heading || isEditing) && (
        <h3
          data-slot="faq-block-heading"
          className="text-xl font-bold text-center mb-2"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== heading && onChange)
              onChange({
                ...block,
                data: { ...block.data, heading: v },
              });
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {heading || "Frequently Asked Questions"}
        </h3>
      )}
      {(description || isEditing) && (
        <p
          data-slot="faq-block-description"
          className="text-[14px] text-(--el-500) text-center mb-6"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== description && onChange)
              onChange({
                ...block,
                data: { ...block.data, description: v },
              });
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {description || "Find answers to common questions"}
        </p>
      )}
      <div
        data-slot="faq-block-list"
        className="border border-(--border-default) rounded-lg divide-y divide-(--border-default)"
      >
        {items.map((item, i) => {
          const isOpen = openItems.has(i);
          return (
            <div key={i} data-slot="faq-block-item">
              <button
                data-slot="faq-block-trigger"
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-(--el-100)/50"
                onClick={() => toggleItem(i)}
              >
                <span
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (v !== item.question) updateItem(i, "question", v);
                  }}
                  onClick={(e) => isEditing && e.stopPropagation()}
                  style={
                    isEditing
                      ? { cursor: "text", outline: "none" }
                      : undefined
                  }
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <div
                  data-slot="faq-block-answer"
                  className="px-4 pb-4 text-[14px] text-(--el-500)"
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (v !== item.answer) updateItem(i, "answer", v);
                  }}
                  style={
                    isEditing
                      ? { cursor: "text", outline: "none" }
                      : undefined
                  }
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

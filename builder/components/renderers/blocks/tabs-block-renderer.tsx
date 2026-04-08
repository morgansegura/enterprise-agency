"use client";

import * as React from "react";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface TabItem {
  label: string;
  content: string;
}

interface TabsBlockData {
  tabs: TabItem[];
  defaultTab?: number;
  variant?: "default" | "pills" | "underline";
}

export default function TabsBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as TabsBlockData;
  const { tabs = [], defaultTab = 0, variant = "default" } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  // Suppress unused-var lint — hasStyle is available for future style overrides
  void hasStyle;

  const [activeTab, setActiveTab] = React.useState(defaultTab);

  if (tabs.length === 0) {
    return (
      <div
        className={elementClass}
        data-slot="tabs-block"
        data-variant={variant}
      >
        <p data-slot="tabs-block-empty">No tabs configured</p>
      </div>
    );
  }

  return (
    <div
      className={elementClass}
      data-slot="tabs-block"
      data-variant={variant}
    >
      <div data-slot="tabs-block-list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            data-slot="tabs-block-trigger"
            data-active={activeTab === index}
            role="tab"
            aria-selected={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            <span
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== tab.label && onChange) {
                  const updated = [...tabs];
                  updated[index] = { ...tab, label: v };
                  onChange({
                    ...block,
                    data: { ...block.data, tabs: updated },
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
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={index}
          data-slot="tabs-block-content"
          data-active={activeTab === index}
          role="tabpanel"
          hidden={activeTab !== index}
          contentEditable={activeTab === index ? !!isEditing : undefined}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== tab.content && onChange) {
              const updated = [...tabs];
              updated[index] = { ...updated[index], content: v };
              onChange({
                ...block,
                data: { ...block.data, tabs: updated },
              });
            }
          }}
          style={
            isEditing && activeTab === index
              ? { cursor: "text", outline: "none" }
              : undefined
          }
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

"use client";

import * as React from "react";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface TabItem {
  label: string;
  content: string;
}

interface TabsBlockData {
  tabs: TabItem[];
  defaultTab?: number;
  variant?: "default" | "pills" | "underline";
}

const tabListVariantClasses = {
  default: "border-b border-border",
  pills: "bg-[var(--el-100)] p-1 rounded-lg",
  underline: "border-b border-border",
};

const tabVariantClasses = {
  default: {
    base: "px-4 py-2 text-sm font-medium transition-colors",
    active: "border-b-2 border-primary text-[var(--accent-primary)] -mb-px",
    inactive: "text-[var(--el-500)] hover:text-[var(--el-800)]",
  },
  pills: {
    base: "px-4 py-2 text-sm font-medium rounded-md transition-colors",
    active: "bg-[var(--el-0)] text-[var(--el-800)] shadow-sm",
    inactive: "text-[var(--el-500)] hover:text-[var(--el-800)]",
  },
  underline: {
    base: "px-4 py-2 text-sm font-medium transition-colors",
    active: "border-b-2 border-primary text-[var(--accent-primary)] -mb-px",
    inactive: "text-[var(--el-500)] hover:text-[var(--el-800)]",
  },
};

export default function TabsBlockRenderer({ block, onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as TabsBlockData;
  const { tabs = [], defaultTab = 0, variant = "default" } = data;

  const [activeTab, setActiveTab] = React.useState(defaultTab);

  if (tabs.length === 0) {
    return (
      <div className="text-[var(--el-500)] text-sm">No tabs configured</div>
    );
  }

  const variantStyles = tabVariantClasses[variant];

  return (
    <div>
      <div
        className={cn("flex", tabListVariantClasses[variant])}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            className={cn(
              variantStyles.base,
              activeTab === index
                ? variantStyles.active
                : variantStyles.inactive,
            )}
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
                  onChange({ ...block, data: { ...block.data, tabs: updated } });
                }
              }}
              onClick={(e) => isEditing && e.stopPropagation()}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >{tab.label}</span>
          </button>
        ))}
      </div>
      <div
        className="p-4"
        role="tabpanel"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          const v = e.currentTarget.textContent || "";
          if (v !== tabs[activeTab]?.content && onChange) {
            const updated = [...tabs];
            updated[activeTab] = { ...updated[activeTab], content: v };
            onChange({ ...block, data: { ...block.data, tabs: updated } });
          }
        }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

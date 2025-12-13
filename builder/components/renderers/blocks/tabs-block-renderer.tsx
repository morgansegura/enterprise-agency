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
  pills: "bg-muted p-1 rounded-lg",
  underline: "border-b border-border",
};

const tabVariantClasses = {
  default: {
    base: "px-4 py-2 text-sm font-medium transition-colors",
    active: "border-b-2 border-primary text-primary -mb-px",
    inactive: "text-muted-foreground hover:text-foreground",
  },
  pills: {
    base: "px-4 py-2 text-sm font-medium rounded-md transition-colors",
    active: "bg-background text-foreground shadow-sm",
    inactive: "text-muted-foreground hover:text-foreground",
  },
  underline: {
    base: "px-4 py-2 text-sm font-medium transition-colors",
    active: "border-b-2 border-primary text-primary -mb-px",
    inactive: "text-muted-foreground hover:text-foreground",
  },
};

export default function TabsBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as TabsBlockData;
  const { tabs = [], defaultTab = 0, variant = "default" } = data;

  const [activeTab, setActiveTab] = React.useState(defaultTab);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No tabs configured</div>
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
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4" role="tabpanel">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

"use client";

import type { TabsBlockData } from "@/lib/blocks";
import { useState } from "react";
import "./tabs-block.css";

type TabsBlockProps = {
  data: TabsBlockData;
};

/**
 * TabsBlock - Renders tabbed content
 * Content block (leaf node) - cannot have children
 */
export function TabsBlock({ data }: TabsBlockProps) {
  const { tabs, defaultTab = 0, variant = "default" } = data;
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div data-slot="tabs-block" data-variant={variant}>
      <div data-slot="tabs-block-list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            data-slot="tabs-block-trigger"
            data-active={activeTab === index}
            role="tab"
            aria-selected={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
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
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

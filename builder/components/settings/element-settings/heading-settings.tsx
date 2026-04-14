"use client";

import { Type } from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
} from "@/components/editor/settings-panel/components";
import type { Block } from "@/lib/types/section";

interface HeadingSettingsProps {
  block: Block;
  onChange: (block: Block) => void;
}

const LEVEL_OPTIONS = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

/**
 * HeadingSettings — structural settings only.
 * All visual styling (size, weight, align, color, font) is in the Style tab.
 */
export function HeadingSettings({ block, onChange }: HeadingSettingsProps) {
  return (
    <PropertySection
      title="Heading"
      icon={<Type className="h-3.5 w-3.5" />}
    >
      <PropertyRow label="Level" stacked>
        <PropertyToggle
          value={(block.data?.level as string) || "h2"}
          options={LEVEL_OPTIONS}
          onChange={(v) =>
            onChange({ ...block, data: { ...block.data, level: v || "h2" } })
          }
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

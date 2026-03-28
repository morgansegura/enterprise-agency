"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Type, Box } from "lucide-react";
import {
  PropertySection,
  PropertyRow,
  PropertyToggle,
  PropertySelect,
} from "./components";
import { HeadingSettings } from "@/components/settings/element-settings/heading-settings";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import {
  setResponsiveOverride,
  getResponsiveValue,
} from "@/lib/responsive";
import type { Block } from "@/lib/hooks/use-pages";

// =============================================================================
// Block Type-Specific Settings - Webflow-style
// =============================================================================

/**
 * HeadingBlockSettings - Uses shared HeadingSettings component
 *
 * Typography uses fluid scaling (no per-breakpoint overrides needed).
 * The fluid clamp() tokens in @enterprise/tokens handle responsive sizing.
 */
function HeadingBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <>
      <PropertySection title="Content" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Text" stacked>
          <Input
            value={(data.text as string) || ""}
            onChange={(e) => handleChange("text", e.target.value)}
            placeholder="Heading text"
            className="settings-input"
          />
        </PropertyRow>
      </PropertySection>
      <HeadingSettings block={block} onChange={onChange} />
    </>
  );
}

function TextBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const breakpoint = useCurrentBreakpoint();
  const data = block.data as Record<string, unknown>;

  // Responsive-aware change handler
  const handleDataChange = (field: string, value: unknown) => {
    const newData = setResponsiveOverride(data, breakpoint, field, value);
    onChange({ ...block, data: newData });
  };

  // Get responsive values for current breakpoint
  const size = getResponsiveValue<string>(data, "size", breakpoint) || "base";
  const align = getResponsiveValue<string>(data, "align", breakpoint) || "left";

  // Alignment options for toggle
  const alignOptions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "justify", label: "Justify" },
  ];

  const sizeOptions = [
    { value: "xs", label: "XS" },
    { value: "sm", label: "SM" },
    { value: "base", label: "Base" },
    { value: "lg", label: "LG" },
    { value: "xl", label: "XL" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
    { value: "4xl", label: "4XL" },
    { value: "5xl", label: "5XL" },
    { value: "6xl", label: "6XL" },
    { value: "7xl", label: "7XL" },
    { value: "8xl", label: "8XL" },
    { value: "9xl", label: "9XL" },
  ];

  return (
    <>
      <PropertySection title="Content" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Text" stacked>
          <textarea
            value={(data.content as string) || ""}
            onChange={(e) => handleDataChange("content", e.target.value)}
            placeholder="Enter text content..."
            rows={4}
            className="settings-input w-full resize-y text-sm rounded-md border border-[var(--el-150)] bg-[var(--el-0)] px-3 py-2"
          />
        </PropertyRow>
      </PropertySection>
      <PropertySection
        title="Typography"
        icon={<Type className="h-3.5 w-3.5" />}
      >
        <PropertyRow label="Size">
          <PropertySelect
            value={size}
            options={sizeOptions}
            onChange={(v) => handleDataChange("size", v)}
          />
        </PropertyRow>
        <PropertyRow label="Align" stacked>
          <PropertyToggle
            value={align}
            options={alignOptions}
            onChange={(v) => handleDataChange("align", v)}
            fullWidth
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}

function ButtonBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const handleDataChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  // Size options for toggle
  const sizeOptions = [
    { value: "sm", label: "SM" },
    { value: "default", label: "Default" },
    { value: "lg", label: "LG" },
  ];

  return (
    <PropertySection title="Button" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Label" stacked>
        <Input
          value={(block.data?.text as string) || ""}
          onChange={(e) => handleDataChange("text", e.target.value)}
          placeholder="Button text"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Variant">
        <PropertySelect
          value={(block.data?.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "secondary", label: "Secondary" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
            { value: "link", label: "Link" },
          ]}
          onChange={(v) => handleDataChange("variant", v)}
        />
      </PropertyRow>
      <PropertyRow label="Size" stacked>
        <PropertyToggle
          value={(block.data?.size as string) || "default"}
          options={sizeOptions}
          onChange={(v) => handleDataChange("size", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="URL" stacked>
        <Input
          value={(block.data?.href as string) || ""}
          onChange={(e) => handleDataChange("href", e.target.value)}
          placeholder="https://..."
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

function ImageBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <>
      <PropertySection title="Image" icon={<Box className="h-3.5 w-3.5" />}>
        <PropertyRow label="URL" stacked>
          <Input
            value={(data.url as string) || ""}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://..."
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Alt Text" stacked>
          <Input
            value={(data.alt as string) || ""}
            onChange={(e) => handleChange("alt", e.target.value)}
            placeholder="Describe the image"
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Caption" stacked>
          <Input
            value={(data.caption as string) || ""}
            onChange={(e) => handleChange("caption", e.target.value)}
            placeholder="Optional caption"
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Fit">
          <PropertySelect
            value={(data.objectFit as string) || "cover"}
            options={[
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
              { value: "fill", label: "Fill" },
              { value: "none", label: "None" },
            ]}
            onChange={(v) => handleChange("objectFit", v)}
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}

function CardBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Card" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Title" stacked>
        <Input
          value={(data.title as string) || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Description" stacked>
        <Input
          value={(data.description as string) || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Variant">
        <PropertySelect
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "outlined", label: "Outlined" },
            { value: "elevated", label: "Elevated" },
            { value: "ghost", label: "Ghost" },
          ]}
          onChange={(v) => handleChange("variant", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function QuoteBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Quote" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Quote" stacked>
        <Input
          value={(data.quote as string) || (data.text as string) || ""}
          onChange={(e) => handleChange("quote", e.target.value)}
          placeholder="Enter quote text"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Attribution" stacked>
        <Input
          value={(data.attribution as string) || (data.author as string) || ""}
          onChange={(e) => handleChange("attribution", e.target.value)}
          placeholder="Author name"
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

function DividerBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Divider" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Variant">
        <PropertySelect
          value={(data.variant as string) || "solid"}
          options={[
            { value: "solid", label: "Solid" },
            { value: "dashed", label: "Dashed" },
            { value: "dotted", label: "Dotted" },
            { value: "subtle", label: "Subtle" },
          ]}
          onChange={(v) => handleChange("variant", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function SpacerBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Spacer" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Size">
        <PropertySelect
          value={(data.size as string) || "md"}
          options={[
            { value: "xs", label: "XS" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
            { value: "2xl", label: "2XL" },
          ]}
          onChange={(v) => handleChange("size", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function ListBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="List" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Style">
        <PropertySelect
          value={
            (data.listType as string) || (data.variant as string) || "unordered"
          }
          options={[
            { value: "unordered", label: "Bullet" },
            { value: "ordered", label: "Numbered" },
            { value: "none", label: "None" },
          ]}
          onChange={(v) => handleChange("listType", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function VideoBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Video" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="URL" stacked>
        <Input
          value={(data.url as string) || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="YouTube or Vimeo URL"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Title" stacked>
        <Input
          value={(data.title as string) || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Video title"
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

function IconBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Icon" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Name" stacked>
        <Input
          value={(data.name as string) || (data.icon as string) || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Lucide icon name"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Size">
        <PropertySelect
          value={(data.size as string) || "md"}
          options={[
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
          ]}
          onChange={(v) => handleChange("size", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function StatsBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const stats = (data.stats as Array<{ label: string; value: string }>) || [];

  const handleStatChange = (index: number, field: string, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...block, data: { ...data, stats: updated } });
  };

  return (
    <PropertySection title="Stats" icon={<Box className="h-3.5 w-3.5" />}>
      {stats.map((stat, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={stat.value || ""}
            onChange={(e) => handleStatChange(i, "value", e.target.value)}
            placeholder="100+"
            className="settings-input flex-1"
          />
          <Input
            value={stat.label || ""}
            onChange={(e) => handleStatChange(i, "label", e.target.value)}
            placeholder="Label"
            className="settings-input flex-1"
          />
        </div>
      ))}
    </PropertySection>
  );
}

function MapBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Map" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="Address" stacked>
        <Input
          value={(data.address as string) || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="123 Main St, City"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Zoom">
        <PropertySelect
          value={String((data.zoom as number) || 14)}
          options={[
            { value: "10", label: "Far" },
            { value: "12", label: "Medium" },
            { value: "14", label: "Close" },
            { value: "16", label: "Street" },
          ]}
          onChange={(v) => handleChange("zoom", parseInt(v))}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function EmbedBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data as Record<string, unknown>;
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Embed" icon={<Box className="h-3.5 w-3.5" />}>
      <PropertyRow label="URL" stacked>
        <Input
          value={(data.url as string) || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://..."
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Title" stacked>
        <Input
          value={(data.title as string) || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Embed title"
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

// =============================================================================
// Composite Block Settings
// =============================================================================

function AudioBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Audio" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Source URL" stacked>
        <Input
          value={(data.src as string) || ""}
          onChange={(e) => handleChange("src", e.target.value)}
          placeholder="Audio file URL"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Title" stacked>
        <Input
          value={(data.title as string) || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Track title"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Artist" stacked>
        <Input
          value={(data.artist as string) || ""}
          onChange={(e) => handleChange("artist", e.target.value)}
          placeholder="Artist name"
          className="settings-input"
        />
      </PropertyRow>
    </PropertySection>
  );
}

function HeroBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <>
      <PropertySection title="Content" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Heading" stacked>
          <Input
            value={(data.heading as string) || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Subheading" stacked>
          <Input
            value={(data.subheading as string) || ""}
            onChange={(e) => handleChange("subheading", e.target.value)}
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Description" stacked>
          <Input
            value={(data.description as string) || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="settings-input"
          />
        </PropertyRow>
      </PropertySection>
      <PropertySection title="Layout" icon={<Box className="h-3.5 w-3.5" />}>
        <PropertyRow label="Layout" stacked>
          <PropertyToggle
            value={(data.layout as string) || "centered"}
            options={[
              { value: "centered", label: "Center" },
              { value: "split-right", label: "Split R" },
              { value: "split-left", label: "Split L" },
            ]}
            onChange={(v) => handleChange("layout", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Align" stacked>
          <PropertyToggle
            value={(data.align as string) || "center"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => handleChange("align", v)}
            fullWidth
          />
        </PropertyRow>
        <PropertyRow label="Size">
          <PropertySelect
            value={(data.size as string) || "lg"}
            options={[
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
            ]}
            onChange={(v) => handleChange("size", v)}
          />
        </PropertyRow>
      </PropertySection>
    </>
  );
}

function CtaBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="CTA" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Heading" stacked>
        <Input
          value={(data.heading as string) || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Description" stacked>
        <Input
          value={(data.description as string) || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "highlighted", label: "Highlight" },
            { value: "minimal", label: "Minimal" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="Align" stacked>
        <PropertyToggle
          value={(data.align as string) || "center"}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
          ]}
          onChange={(v) => handleChange("align", v)}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function AccordionBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Accordion" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "bordered", label: "Border" },
            { value: "separated", label: "Separate" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="Multiple Open">
        <PropertyToggle
          value={data.allowMultiple ? "yes" : "no"}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          onChange={(v) => handleChange("allowMultiple", v === "yes")}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function TabsBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Tabs" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "pills", label: "Pills" },
            { value: "underline", label: "Underline" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function TestimonialBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Testimonials" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Columns">
        <PropertySelect
          value={String((data.columns as number) || 2)}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
          ]}
          onChange={(v) => handleChange("columns", parseInt(v))}
        />
      </PropertyRow>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "card", label: "Card" },
            { value: "minimal", label: "Minimal" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="Show Rating">
        <PropertyToggle
          value={data.showRating ? "yes" : "no"}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          onChange={(v) => handleChange("showRating", v === "yes")}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function PricingBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Pricing" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Heading" stacked>
        <Input
          value={(data.heading as string) || ""}
          onChange={(e) => handleChange("heading", e.target.value)}
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "bordered", label: "Border" },
            { value: "elevated", label: "Elevated" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function TeamBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  return (
    <PropertySection title="Team" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Columns">
        <PropertySelect
          value={String((data.columns as number) || 3)}
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          onChange={(v) => handleChange("columns", parseInt(v))}
        />
      </PropertyRow>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "card", label: "Card" },
            { value: "minimal", label: "Minimal" },
          ]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
      <PropertyRow label="Show Bio">
        <PropertyToggle
          value={data.showBio ? "yes" : "no"}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          onChange={(v) => handleChange("showBio", v === "yes")}
        />
      </PropertyRow>
    </PropertySection>
  );
}

function GenericBlockSettings({
  block,
  onChange: _onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const blockName = block._type
    .replace("-block", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
      <p className="text-[14px] font-medium text-[var(--el-800)]">{blockName}</p>
      <p className="text-[12px] text-[var(--el-400)]">
        Select this block on the canvas to edit its content directly.
      </p>
    </div>
  );
}

export {
  HeadingBlockSettings,
  TextBlockSettings,
  ButtonBlockSettings,
  ImageBlockSettings,
  CardBlockSettings,
  QuoteBlockSettings,
  DividerBlockSettings,
  SpacerBlockSettings,
  ListBlockSettings,
  VideoBlockSettings,
  IconBlockSettings,
  StatsBlockSettings,
  MapBlockSettings,
  EmbedBlockSettings,
  AudioBlockSettings,
  HeroBlockSettings,
  CtaBlockSettings,
  TestimonialBlockSettings,
  PricingBlockSettings,
  TeamBlockSettings,
  AccordionBlockSettings,
  TabsBlockSettings,
  GenericBlockSettings,
};

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Type, Box } from "lucide-react";
import { ImagePickerField } from "./image-picker-field";
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

  return <HeadingSettings block={block} onChange={onChange} />;
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
      <PropertyRow label="Full Width">
        <PropertyToggle
          value={block.data?.fullWidth ? "yes" : "no"}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          onChange={(v) => handleDataChange("fullWidth", v === "yes")}
        />
      </PropertyRow>
      <PropertyRow label="New Tab">
        <PropertyToggle
          value={block.data?.openInNewTab ? "yes" : "no"}
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          onChange={(v) => handleDataChange("openInNewTab", v === "yes")}
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
        <ImagePickerField
          value={(data.url as string) || (data.src as string) || ""}
          onChange={(url) => {
            handleChange("url", url);
            handleChange("src", url);
          }}
        />
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
        <PropertyRow label="Ratio">
          <PropertySelect
            value={(data.aspectRatio as string) || "auto"}
            options={[
              { value: "auto", label: "Auto" },
              { value: "1/1", label: "1:1" },
              { value: "4/3", label: "4:3" },
              { value: "16/9", label: "16:9" },
              { value: "21/9", label: "21:9" },
            ]}
            onChange={(v) => handleChange("aspectRatio", v)}
          />
        </PropertyRow>
        <PropertyRow label="Rounded">
          <PropertyToggle
            value={data.rounded ? "yes" : "no"}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            onChange={(v) => handleChange("rounded", v === "yes")}
          />
        </PropertyRow>
        <PropertyRow label="Link URL" stacked>
          <Input
            value={(data.href as string) || ""}
            onChange={(e) => handleChange("href", e.target.value)}
            placeholder="Optional link URL"
            className="settings-input"
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
      <PropertyRow label="Type">
        <PropertyToggle
          value={data.ordered ? "ordered" : "unordered"}
          options={[
            { value: "unordered", label: "Bullet" },
            { value: "ordered", label: "Number" },
          ]}
          onChange={(v) => handleChange("ordered", v === "ordered")}
        />
      </PropertyRow>
      <PropertyRow label="Style">
        <PropertySelect
          value={(data.style as string) || "default"}
          options={[
            { value: "default", label: "Default" },
            { value: "check", label: "Checkmark" },
            { value: "arrow", label: "Arrow" },
          ]}
          onChange={(v) => handleChange("style", v)}
        />
      </PropertyRow>
      <PropertyRow label="Spacing">
        <PropertySelect
          value={(data.spacing as string) || "comfortable"}
          options={[
            { value: "tight", label: "Tight" },
            { value: "comfortable", label: "Default" },
            { value: "relaxed", label: "Relaxed" },
          ]}
          onChange={(v) => handleChange("spacing", v)}
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
      <PropertyRow label="Provider">
        <PropertySelect
          value={(data.provider as string) || "youtube"}
          options={[
            { value: "youtube", label: "YouTube" },
            { value: "vimeo", label: "Vimeo" },
            { value: "direct", label: "Direct" },
          ]}
          onChange={(v) => handleChange("provider", v)}
        />
      </PropertyRow>
      <PropertyRow label="Aspect Ratio">
        <PropertySelect
          value={(data.aspectRatio as string) || "16/9"}
          options={[
            { value: "16/9", label: "16:9" },
            { value: "4/3", label: "4:3" },
            { value: "1/1", label: "1:1" },
            { value: "21/9", label: "21:9" },
          ]}
          onChange={(v) => handleChange("aspectRatio", v)}
        />
      </PropertyRow>
      <PropertyRow label="Autoplay">
        <PropertyToggle
          value={data.autoplay ? "yes" : "no"}
          options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
          onChange={(v) => handleChange("autoplay", v === "yes")}
        />
      </PropertyRow>
      <PropertyRow label="Muted">
        <PropertyToggle
          value={data.muted ? "yes" : "no"}
          options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
          onChange={(v) => handleChange("muted", v === "yes")}
        />
      </PropertyRow>
      <PropertyRow label="Loop">
        <PropertyToggle
          value={data.loop ? "yes" : "no"}
          options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
          onChange={(v) => handleChange("loop", v === "yes")}
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
      <PropertyRow label="Latitude" stacked>
        <Input
          value={String(((data.center as Record<string, unknown>)?.lat as number) || "")}
          onChange={(e) => handleChange("center", { ...((data.center as Record<string, unknown>) || {}), lat: parseFloat(e.target.value) || 0 })}
          placeholder="40.7128"
          className="settings-input"
        />
      </PropertyRow>
      <PropertyRow label="Longitude" stacked>
        <Input
          value={String(((data.center as Record<string, unknown>)?.lng as number) || "")}
          onChange={(e) => handleChange("center", { ...((data.center as Record<string, unknown>) || {}), lng: parseFloat(e.target.value) || 0 })}
          placeholder="-74.0060"
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
      <PropertyRow label="Height">
        <PropertySelect
          value={(data.height as string) || "md"}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "xl", label: "X-Large" },
          ]}
          onChange={(v) => handleChange("height", v)}
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
      <ImagePickerField
        value={(data.src as string) || ""}
        onChange={(url) => handleChange("src", url)}
        label="Audio File"
        fileType="audio"
      />
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
      <PropertySection title="Links" icon={<Box className="h-3.5 w-3.5" />} defaultOpen={false}>
        <PropertyRow label="Primary CTA URL" stacked>
          <Input
            value={((data.primaryCta as Record<string, unknown>)?.href as string) || ""}
            onChange={(e) => handleChange("primaryCta", { ...(data.primaryCta as Record<string, unknown>), href: e.target.value })}
            placeholder="https://..."
            className="settings-input"
          />
        </PropertyRow>
        <PropertyRow label="Secondary CTA URL" stacked>
          <Input
            value={((data.secondaryCta as Record<string, unknown>)?.href as string) || ""}
            onChange={(e) => handleChange("secondaryCta", { ...(data.secondaryCta as Record<string, unknown>), href: e.target.value })}
            placeholder="https://..."
            className="settings-input"
          />
        </PropertyRow>
        <ImagePickerField
          value={((data.image as Record<string, unknown>)?.src as string) || ""}
          onChange={(url) => handleChange("image", { ...(data.image as Record<string, unknown>), src: url })}
          label="Background Image"
        />
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

interface FormField {
  id: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio" | "file" | "number" | "date" | "url";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select/radio
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "file", label: "File Upload" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "url", label: "URL" },
];

function ContactFormBlockSettings({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  const data = block.data || {};
  const fields = ((data.fields as FormField[]) || [
    { id: "name", type: "text", label: "Name", placeholder: "Your name", required: true },
    { id: "email", type: "email", label: "Email", placeholder: "you@example.com", required: true },
    { id: "message", type: "textarea", label: "Message", placeholder: "How can we help?", required: false },
  ]) as FormField[];

  const handleChange = (field: string, value: unknown) => {
    onChange({ ...block, data: { ...data, [field]: value } });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    handleChange("fields", updated);
  };

  const addField = () => {
    const id = `field-${Date.now()}`;
    handleChange("fields", [...fields, { id, type: "text", label: "New Field", placeholder: "", required: false }]);
  };

  const removeField = (index: number) => {
    handleChange("fields", fields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const updated = [...fields];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    handleChange("fields", updated);
  };

  return (
    <>
      <PropertySection title="Form Settings" icon={<Type className="h-3.5 w-3.5" />}>
        <PropertyRow label="Heading" stacked>
          <Input value={(data.heading as string) || ""} onChange={(e) => handleChange("heading", e.target.value)} className="settings-input" />
        </PropertyRow>
        <PropertyRow label="Description" stacked>
          <Input value={(data.description as string) || ""} onChange={(e) => handleChange("description", e.target.value)} className="settings-input" />
        </PropertyRow>
        <PropertyRow label="Button Text" stacked>
          <Input value={(data.submitText as string) || "Submit"} onChange={(e) => handleChange("submitText", e.target.value)} className="settings-input" />
        </PropertyRow>
        <PropertyRow label="Email To" stacked>
          <Input value={(data.recipientEmail as string) || ""} onChange={(e) => handleChange("recipientEmail", e.target.value)} className="settings-input" placeholder="you@company.com" />
        </PropertyRow>
        <PropertyRow label="Success Msg" stacked>
          <Input value={(data.successMessage as string) || ""} onChange={(e) => handleChange("successMessage", e.target.value)} className="settings-input" placeholder="Thanks! We'll be in touch." />
        </PropertyRow>
      </PropertySection>

      <PropertySection title="Form Fields" icon={<Box className="h-3.5 w-3.5" />}>
        {fields.map((field, i) => (
          <div key={field.id} className="border border-(--border-default) rounded-[3px] p-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-(--el-600)">{field.label}</span>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => moveField(i, -1)} disabled={i === 0} className="text-[11px] text-(--el-400) hover:text-(--el-800) disabled:opacity-30 bg-transparent border-none cursor-pointer">↑</button>
                <button type="button" onClick={() => moveField(i, 1)} disabled={i === fields.length - 1} className="text-[11px] text-(--el-400) hover:text-(--el-800) disabled:opacity-30 bg-transparent border-none cursor-pointer">↓</button>
                <button type="button" onClick={() => removeField(i)} className="text-[11px] text-(--status-error) hover:text-(--status-error) bg-transparent border-none cursor-pointer">×</button>
              </div>
            </div>
            <PropertyRow label="Label">
              <Input value={field.label} onChange={(e) => updateField(i, { label: e.target.value })} className="h-7 text-xs" />
            </PropertyRow>
            <PropertyRow label="Type">
              <PropertySelect
                value={field.type}
                options={FIELD_TYPES}
                onChange={(v) => updateField(i, { type: v as FormField["type"] })}
              />
            </PropertyRow>
            <PropertyRow label="Placeholder">
              <Input value={field.placeholder || ""} onChange={(e) => updateField(i, { placeholder: e.target.value })} className="h-7 text-xs" />
            </PropertyRow>
            <PropertyRow label="Required">
              <PropertyToggle
                value={field.required ? "yes" : "no"}
                options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
                onChange={(v) => updateField(i, { required: v === "yes" })}
              />
            </PropertyRow>
            {(field.type === "select" || field.type === "radio") && (
              <PropertyRow label="Options" stacked>
                <Input
                  value={(field.options || []).join(", ")}
                  onChange={(e) => updateField(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="h-7 text-xs"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </PropertyRow>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="w-full py-2 rounded-[3px] text-[12px] font-medium text-(--accent-primary) border border-dashed border-(--border-default) bg-transparent cursor-pointer hover:bg-(--accent-primary-subtle)/30 hover:border-(--accent-primary) transition-colors"
        >
          + Add Field
        </button>
      </PropertySection>
    </>
  );
}

function NewsletterBlockSettings({
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
    <PropertySection title="Newsletter" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Heading" stacked>
        <Input value={(data.heading as string) || ""} onChange={(e) => handleChange("heading", e.target.value)} className="settings-input" />
      </PropertyRow>
      <PropertyRow label="Button Text" stacked>
        <Input value={(data.buttonText as string) || ""} onChange={(e) => handleChange("buttonText", e.target.value)} className="settings-input" />
      </PropertyRow>
      <PropertyRow label="Placeholder" stacked>
        <Input value={(data.placeholder as string) || ""} onChange={(e) => handleChange("placeholder", e.target.value)} className="settings-input" />
      </PropertyRow>
      <PropertyRow label="Layout" stacked>
        <PropertyToggle
          value={(data.variant as string) || "inline"}
          options={[{ value: "inline", label: "Inline" }, { value: "stacked", label: "Stacked" }]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function FeatureGridBlockSettings({
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
    <PropertySection title="Feature Grid" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Heading" stacked>
        <Input value={(data.heading as string) || ""} onChange={(e) => handleChange("heading", e.target.value)} className="settings-input" />
      </PropertyRow>
      <PropertyRow label="Columns">
        <PropertySelect
          value={String((data.columns as number) || 3)}
          options={[{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }]}
          onChange={(v) => handleChange("columns", parseInt(v))}
        />
      </PropertyRow>
      <PropertyRow label="Variant" stacked>
        <PropertyToggle
          value={(data.variant as string) || "card"}
          options={[{ value: "default", label: "Default" }, { value: "card", label: "Card" }, { value: "centered", label: "Center" }]}
          onChange={(v) => handleChange("variant", v)}
          fullWidth
        />
      </PropertyRow>
    </PropertySection>
  );
}

function FaqBlockSettings({
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
    <PropertySection title="FAQ" icon={<Type className="h-3.5 w-3.5" />}>
      <PropertyRow label="Heading" stacked>
        <Input value={(data.heading as string) || ""} onChange={(e) => handleChange("heading", e.target.value)} className="settings-input" />
      </PropertyRow>
      <PropertyRow label="Description" stacked>
        <Input value={(data.description as string) || ""} onChange={(e) => handleChange("description", e.target.value)} className="settings-input" />
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
      <p className="text-[14px] font-medium text-(--el-800)">{blockName}</p>
      <p className="text-[12px] text-(--el-400)">
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
  ContactFormBlockSettings,
  NewsletterBlockSettings,
  FeatureGridBlockSettings,
  FaqBlockSettings,
  GenericBlockSettings,
};

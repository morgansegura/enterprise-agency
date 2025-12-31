"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Palette,
  Eye,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Link as LinkIcon,
  MousePointer,
  LayoutGrid,
} from "lucide-react";
import {
  generateColorScale,
  generateForegroundColor,
  getContrastRatio,
  hexToHslString,
  isValidHex,
  normalizeHex,
} from "@/lib/utils/color-utils";

// ============================================================================
// Types
// ============================================================================

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface StatusColors {
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
  info: string;
  infoForeground: string;
}

export interface UIColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface LinkColors {
  default: string;
  hover: string;
  visited: string;
  active: string;
}

export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
}

export interface ColorSettingsData {
  brand: BrandColors;
  status: StatusColors;
  ui: UIColors;
  link: LinkColors;
  chart: ChartColors;
}

interface ColorSettingsPanelProps {
  colors: ColorSettingsData;
  onChange: (colors: ColorSettingsData) => void;
  className?: string;
}

// ============================================================================
// Default Colors
// ============================================================================

export const defaultColorSettings: ColorSettingsData = {
  brand: {
    primary: "#1a3f56",
    secondary: "#ac8365",
    accent: "#047857",
  },
  status: {
    success: "#16a34a",
    successForeground: "#ffffff",
    warning: "#ca8a04",
    warningForeground: "#ffffff",
    error: "#dc2626",
    errorForeground: "#ffffff",
    info: "#0284c7",
    infoForeground: "#ffffff",
  },
  ui: {
    background: "#fafafa",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    popover: "#ffffff",
    popoverForeground: "#09090b",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#1a3f56",
  },
  link: {
    default: "#1a3f56",
    hover: "#0f2a3a",
    visited: "#6b21a8",
    active: "#047857",
  },
  chart: {
    chart1: "#1a3f56",
    chart2: "#ac8365",
    chart3: "#047857",
    chart4: "#0284c7",
    chart5: "#ca8a04",
    chart6: "#dc2626",
  },
};

// ============================================================================
// Color Scale Preview Component
// ============================================================================

interface ColorScalePreviewProps {
  baseColor: string;
  label: string;
  className?: string;
}

function ColorScalePreview({
  baseColor,
  label,
  className,
}: ColorScalePreviewProps) {
  const scale = React.useMemo(() => generateColorScale(baseColor), [baseColor]);
  const shades = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950",
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label} Scale
        </span>
        <span className="text-xs text-muted-foreground">{baseColor}</span>
      </div>
      <div className="flex rounded-lg overflow-hidden border">
        {shades.map((shade) => (
          <div
            key={shade}
            className="flex-1 h-8 relative group"
            style={{ backgroundColor: scale[shade] }}
            title={`${shade}: ${scale[shade]}`}
          >
            <span
              className="absolute inset-0 flex items-center justify-center text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: generateForegroundColor(scale[shade]) }}
            >
              {shade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Color Swatch with Input
// ============================================================================

interface ColorSwatchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showForeground?: boolean;
  foregroundValue?: string;
  onForegroundChange?: (value: string) => void;
  description?: string;
}

function ColorSwatchInput({
  label,
  value,
  onChange,
  showForeground,
  foregroundValue,
  onForegroundChange,
  description,
}: ColorSwatchInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const isValid = isValidHex(inputValue);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isValidHex(newValue)) {
      onChange(normalizeHex(newValue));
    }
  };

  const handleInputBlur = () => {
    if (!isValidHex(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="flex gap-2">
        <ColorPicker
          value={value}
          onChange={onChange}
          className="flex-shrink-0"
        />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={cn(
            "h-9 font-mono text-sm",
            !isValid && "border-destructive focus-visible:ring-destructive",
          )}
          placeholder="#000000"
        />
        {showForeground && onForegroundChange && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-2 gap-1.5"
            onClick={() => onForegroundChange(generateForegroundColor(value))}
            title="Auto-generate foreground color"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: foregroundValue }}
            />
          </Button>
        )}
      </div>
      {showForeground && foregroundValue && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Foreground:</span>
          <ColorPicker value={foregroundValue} onChange={onForegroundChange!} />
          <span className="text-xs font-mono text-muted-foreground">
            {foregroundValue}
          </span>
          <ContrastBadge background={value} foreground={foregroundValue} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Contrast Badge
// ============================================================================

interface ContrastBadgeProps {
  background: string;
  foreground: string;
}

function ContrastBadge({ background, foreground }: ContrastBadgeProps) {
  const ratio = getContrastRatio(background, foreground);
  const level =
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";
  const isGood = ratio >= 4.5;

  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 rounded font-medium",
        isGood
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      )}
    >
      {ratio.toFixed(1)}:1 {level}
    </span>
  );
}

// ============================================================================
// Collapsible Section
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted transition-colors rounded-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 px-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// Live Preview Component
// ============================================================================

interface LivePreviewProps {
  colors: ColorSettingsData;
}

function LivePreview({ colors }: LivePreviewProps) {
  const primaryScale = React.useMemo(
    () => generateColorScale(colors.brand.primary),
    [colors.brand.primary],
  );

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.ui.background,
        color: colors.ui.foreground,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: colors.brand.primary,
          color: generateForegroundColor(colors.brand.primary),
          borderColor: colors.ui.border,
        }}
      >
        <span className="font-semibold text-sm">Preview</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs rounded-md transition-colors"
            style={{
              backgroundColor: colors.brand.secondary,
              color: generateForegroundColor(colors.brand.secondary),
            }}
          >
            Secondary
          </button>
          <button
            className="px-3 py-1 text-xs rounded-md transition-colors"
            style={{
              backgroundColor: colors.brand.accent,
              color: generateForegroundColor(colors.brand.accent),
            }}
          >
            Accent
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Card */}
        <div
          className="rounded-lg border p-4"
          style={{
            backgroundColor: colors.ui.card,
            color: colors.ui.cardForeground,
            borderColor: colors.ui.border,
          }}
        >
          <h3 className="font-semibold mb-2">Card Title</h3>
          <p
            className="text-sm mb-3"
            style={{ color: colors.ui.mutedForeground }}
          >
            This is how your content will look with these colors.
          </p>
          <a
            href="#"
            className="text-sm underline"
            style={{ color: colors.link.default }}
          >
            Learn more
          </a>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className="px-2 py-1 text-xs rounded-md"
            style={{
              backgroundColor: colors.status.success,
              color: colors.status.successForeground,
            }}
          >
            Success
          </span>
          <span
            className="px-2 py-1 text-xs rounded-md"
            style={{
              backgroundColor: colors.status.warning,
              color: colors.status.warningForeground,
            }}
          >
            Warning
          </span>
          <span
            className="px-2 py-1 text-xs rounded-md"
            style={{
              backgroundColor: colors.status.error,
              color: colors.status.errorForeground,
            }}
          >
            Error
          </span>
          <span
            className="px-2 py-1 text-xs rounded-md"
            style={{
              backgroundColor: colors.status.info,
              color: colors.status.infoForeground,
            }}
          >
            Info
          </span>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            placeholder="Input field"
            className="w-full px-3 py-2 text-sm rounded-md border outline-none"
            style={{
              backgroundColor: colors.ui.background,
              borderColor: colors.ui.input,
              color: colors.ui.foreground,
            }}
          />
        </div>

        {/* Muted area */}
        <div
          className="rounded-md p-3 text-sm"
          style={{
            backgroundColor: colors.ui.muted,
            color: colors.ui.mutedForeground,
          }}
        >
          Muted content area
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ColorSettingsPanel({
  colors,
  onChange,
  className,
}: ColorSettingsPanelProps) {
  // Update handlers
  const updateBrand = (key: keyof BrandColors, value: string) => {
    onChange({
      ...colors,
      brand: { ...colors.brand, [key]: value },
    });
  };

  const updateStatus = (key: keyof StatusColors, value: string) => {
    onChange({
      ...colors,
      status: { ...colors.status, [key]: value },
    });
  };

  const updateUI = (key: keyof UIColors, value: string) => {
    onChange({
      ...colors,
      ui: { ...colors.ui, [key]: value },
    });
  };

  const updateLink = (key: keyof LinkColors, value: string) => {
    onChange({
      ...colors,
      link: { ...colors.link, [key]: value },
    });
  };

  const updateChart = (key: keyof ChartColors, value: string) => {
    onChange({
      ...colors,
      chart: { ...colors.chart, [key]: value },
    });
  };

  // Auto-generate derived colors
  const autoGenerateUI = () => {
    const primaryScale = generateColorScale(colors.brand.primary);
    const neutralScale = generateColorScale("#71717a"); // Neutral gray

    onChange({
      ...colors,
      ui: {
        background: "#fafafa",
        foreground: "#09090b",
        card: "#ffffff",
        cardForeground: "#09090b",
        popover: "#ffffff",
        popoverForeground: "#09090b",
        muted: neutralScale["100"],
        mutedForeground: neutralScale["500"],
        border: neutralScale["200"],
        input: neutralScale["200"],
        ring: colors.brand.primary,
      },
      link: {
        default: colors.brand.primary,
        hover: primaryScale["700"],
        visited: "#6b21a8",
        active: colors.brand.accent,
      },
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brand" className="gap-1.5">
            <Palette className="h-4 w-4" />
            Brand
          </TabsTrigger>
          <TabsTrigger value="ui" className="gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            UI
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Brand Colors Tab */}
        <TabsContent value="brand" className="space-y-6 mt-6">
          {/* Primary Color */}
          <CollapsibleSection
            title="Primary Color"
            icon={
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.brand.primary }}
              />
            }
          >
            <div className="space-y-4">
              <ColorSwatchInput
                label="Primary"
                value={colors.brand.primary}
                onChange={(v) => updateBrand("primary", v)}
                description="Main brand color"
              />
              <ColorScalePreview
                baseColor={colors.brand.primary}
                label="Primary"
              />
            </div>
          </CollapsibleSection>

          {/* Secondary Color */}
          <CollapsibleSection
            title="Secondary Color"
            icon={
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.brand.secondary }}
              />
            }
          >
            <div className="space-y-4">
              <ColorSwatchInput
                label="Secondary"
                value={colors.brand.secondary}
                onChange={(v) => updateBrand("secondary", v)}
                description="Supporting brand color"
              />
              <ColorScalePreview
                baseColor={colors.brand.secondary}
                label="Secondary"
              />
            </div>
          </CollapsibleSection>

          {/* Accent Color */}
          <CollapsibleSection
            title="Accent Color"
            icon={
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.brand.accent }}
              />
            }
          >
            <div className="space-y-4">
              <ColorSwatchInput
                label="Accent"
                value={colors.brand.accent}
                onChange={(v) => updateBrand("accent", v)}
                description="Highlight/CTA color"
              />
              <ColorScalePreview
                baseColor={colors.brand.accent}
                label="Accent"
              />
            </div>
          </CollapsibleSection>

          {/* Status Colors */}
          <CollapsibleSection
            title="Status Colors"
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="grid gap-4">
              <ColorSwatchInput
                label="Success"
                value={colors.status.success}
                onChange={(v) => updateStatus("success", v)}
                showForeground
                foregroundValue={colors.status.successForeground}
                onForegroundChange={(v) => updateStatus("successForeground", v)}
              />
              <ColorSwatchInput
                label="Warning"
                value={colors.status.warning}
                onChange={(v) => updateStatus("warning", v)}
                showForeground
                foregroundValue={colors.status.warningForeground}
                onForegroundChange={(v) => updateStatus("warningForeground", v)}
              />
              <ColorSwatchInput
                label="Error"
                value={colors.status.error}
                onChange={(v) => updateStatus("error", v)}
                showForeground
                foregroundValue={colors.status.errorForeground}
                onForegroundChange={(v) => updateStatus("errorForeground", v)}
              />
              <ColorSwatchInput
                label="Info"
                value={colors.status.info}
                onChange={(v) => updateStatus("info", v)}
                showForeground
                foregroundValue={colors.status.infoForeground}
                onForegroundChange={(v) => updateStatus("infoForeground", v)}
              />
            </div>
          </CollapsibleSection>

          {/* Chart Colors */}
          <CollapsibleSection
            title="Chart Colors"
            icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {(Object.keys(colors.chart) as Array<keyof ChartColors>).map(
                  (key, i) => (
                    <div key={key} className="space-y-1">
                      <ColorPicker
                        value={colors.chart[key]}
                        onChange={(v) => updateChart(key, v)}
                      />
                      <span className="text-[10px] text-muted-foreground text-center block">
                        {i + 1}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="flex h-4 rounded overflow-hidden">
                {(Object.keys(colors.chart) as Array<keyof ChartColors>).map(
                  (key) => (
                    <div
                      key={key}
                      className="flex-1"
                      style={{ backgroundColor: colors.chart[key] }}
                    />
                  ),
                )}
              </div>
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* UI Colors Tab */}
        <TabsContent value="ui" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={autoGenerateUI}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Auto-generate from brand
            </Button>
          </div>

          {/* Backgrounds */}
          <CollapsibleSection
            title="Backgrounds"
            icon={
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: colors.ui.background }}
              />
            }
          >
            <div className="grid gap-4">
              <ColorSwatchInput
                label="Background"
                value={colors.ui.background}
                onChange={(v) => updateUI("background", v)}
              />
              <ColorSwatchInput
                label="Foreground"
                value={colors.ui.foreground}
                onChange={(v) => updateUI("foreground", v)}
              />
              <ColorSwatchInput
                label="Card"
                value={colors.ui.card}
                onChange={(v) => updateUI("card", v)}
              />
              <ColorSwatchInput
                label="Card Foreground"
                value={colors.ui.cardForeground}
                onChange={(v) => updateUI("cardForeground", v)}
              />
              <ColorSwatchInput
                label="Popover"
                value={colors.ui.popover}
                onChange={(v) => updateUI("popover", v)}
              />
              <ColorSwatchInput
                label="Popover Foreground"
                value={colors.ui.popoverForeground}
                onChange={(v) => updateUI("popoverForeground", v)}
              />
            </div>
          </CollapsibleSection>

          {/* Muted */}
          <CollapsibleSection
            title="Muted & Borders"
            icon={
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.ui.muted }}
              />
            }
          >
            <div className="grid gap-4">
              <ColorSwatchInput
                label="Muted"
                value={colors.ui.muted}
                onChange={(v) => updateUI("muted", v)}
              />
              <ColorSwatchInput
                label="Muted Foreground"
                value={colors.ui.mutedForeground}
                onChange={(v) => updateUI("mutedForeground", v)}
              />
              <ColorSwatchInput
                label="Border"
                value={colors.ui.border}
                onChange={(v) => updateUI("border", v)}
              />
              <ColorSwatchInput
                label="Input Border"
                value={colors.ui.input}
                onChange={(v) => updateUI("input", v)}
              />
              <ColorSwatchInput
                label="Focus Ring"
                value={colors.ui.ring}
                onChange={(v) => updateUI("ring", v)}
              />
            </div>
          </CollapsibleSection>

          {/* Links */}
          <CollapsibleSection
            title="Link Colors"
            icon={<LinkIcon className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="grid gap-4">
              <ColorSwatchInput
                label="Default"
                value={colors.link.default}
                onChange={(v) => updateLink("default", v)}
              />
              <ColorSwatchInput
                label="Hover"
                value={colors.link.hover}
                onChange={(v) => updateLink("hover", v)}
              />
              <ColorSwatchInput
                label="Visited"
                value={colors.link.visited}
                onChange={(v) => updateLink("visited", v)}
              />
              <ColorSwatchInput
                label="Active"
                value={colors.link.active}
                onChange={(v) => updateLink("active", v)}
              />
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <LivePreview colors={colors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

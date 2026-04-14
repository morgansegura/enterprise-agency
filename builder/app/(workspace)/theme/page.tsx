"use client";

import * as React from "react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { useTenantTokens, useUpdateTenantTokens } from "@/lib/hooks";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { PropertyToggle } from "@/components/editor/settings-panel/components/property-toggle";
import { PropertySelect } from "@/components/editor/settings-panel/components/property-select";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { applyTokensToDOM, clearTokensFromDOM } from "@/lib/tokens/apply-tokens";

import "@/components/editor/settings-panel/settings-panel.css";
import "./theme.css";

// =============================================================================
// Constants
// =============================================================================

const COLOR_PRESETS = [
  {
    name: "Blue",
    primary: "#0052cc",
    accent: "#0065ff",
    bg: "#ffffff",
    fg: "#172b4d",
    border: "#dfe1e6",
  },
  {
    name: "Indigo",
    primary: "#4f46e5",
    accent: "#6366f1",
    bg: "#ffffff",
    fg: "#1e1b4b",
    border: "#e0e7ff",
  },
  {
    name: "Purple",
    primary: "#7c3aed",
    accent: "#8b5cf6",
    bg: "#ffffff",
    fg: "#2e1065",
    border: "#ede9fe",
  },
  {
    name: "Pink",
    primary: "#db2777",
    accent: "#ec4899",
    bg: "#ffffff",
    fg: "#500724",
    border: "#fce7f3",
  },
  {
    name: "Red",
    primary: "#dc2626",
    accent: "#ef4444",
    bg: "#ffffff",
    fg: "#450a0a",
    border: "#fee2e2",
  },
  {
    name: "Orange",
    primary: "#ea580c",
    accent: "#f97316",
    bg: "#ffffff",
    fg: "#431407",
    border: "#ffedd5",
  },
  {
    name: "Green",
    primary: "#16a34a",
    accent: "#22c55e",
    bg: "#ffffff",
    fg: "#052e16",
    border: "#dcfce7",
  },
  {
    name: "Teal",
    primary: "#0d9488",
    accent: "#14b8a6",
    bg: "#ffffff",
    fg: "#042f2e",
    border: "#ccfbf1",
  },
  {
    name: "Slate",
    primary: "#475569",
    accent: "#64748b",
    bg: "#ffffff",
    fg: "#0f172a",
    border: "#e2e8f0",
  },
];

const FONT_OPTIONS = [
  { value: "system", label: "System Default" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta" },
  { value: "'Outfit', sans-serif", label: "Outfit" },
  { value: "'Space Grotesk', sans-serif", label: "Space Grotesk" },
  { value: "'Playfair Display', serif", label: "Playfair" },
  { value: "'Lora', serif", label: "Lora" },
  { value: "'Merriweather', serif", label: "Merriweather" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Raleway', sans-serif", label: "Raleway" },
  { value: "'Nunito', sans-serif", label: "Nunito" },
];

// =============================================================================
// Types
// =============================================================================

interface ThemeTokens {
  colors?: {
    primaryHex?: string;
    accentHex?: string;
    background?: string;
    foreground?: string;
    borderColor?: string;
    linkColor?: string;
    darkMode?: boolean;
    darkBackground?: string;
    darkForeground?: string;
    darkBorderColor?: string;
  };
  fonts?: {
    heading?: { family?: string };
    body?: { family?: string };
  };
  spacing?: {
    sectionPadding?: string;
    contentGap?: string;
    containerMaxWidth?: string;
    containerPadding?: string;
  };
  borderRadius?: {
    default?: string;
  };
  effects?: {
    defaultShadow?: string;
    borderWidth?: string;
  };
  baseFontSize?: string;
  responsive?: {
    tablet?: {
      sectionPadding?: string;
      headingScale?: string;
      baseFontSize?: string;
      containerMaxWidth?: string;
    };
    mobile?: {
      sectionPadding?: string;
      headingScale?: string;
      baseFontSize?: string;
      containerMaxWidth?: string;
    };
  };
}

// =============================================================================
// Helpers
// =============================================================================

function get(obj: unknown, path: string, fallback: string): string;
function get<T>(obj: unknown, path: string, fallback: T): T;
function get<T>(obj: unknown, path: string, fallback: T): T {
  const keys = path.split(".");
  let val: unknown = obj;
  for (const k of keys) {
    if (val && typeof val === "object" && k in val) {
      val = (val as Record<string, unknown>)[k];
    } else {
      return fallback;
    }
  }
  return (val as T) ?? fallback;
}

function setNested(
  obj: ThemeTokens,
  path: string,
  value: unknown,
): ThemeTokens {
  const keys = path.split(".");
  const result = structuredClone(obj);
  let current: Record<string, unknown> = result as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

// =============================================================================
// Component
// =============================================================================

export default function ThemePage() {
  const { tenantId: resolvedTenantId } = useResolvedTenant();
  const tenantId = resolvedTenantId!;
  const { data: serverTokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  const [tokens, setTokens] = React.useState<ThemeTokens>({});
  const [isDirty, setIsDirty] = React.useState(false);
  const [breakpoint, setBreakpoint] = React.useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  // Sync from server on first load
  const [initialized, setInitialized] = React.useState(false);
  React.useEffect(() => {
    if (serverTokens && !initialized) {
      setTokens(serverTokens as ThemeTokens);
      setInitialized(true);
    }
  }, [serverTokens, initialized]);

  const update = (path: string, value: unknown) => {
    setTokens((prev) => setNested(prev, path, value));
    setIsDirty(true);
  };

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    update("colors.primaryHex", preset.primary);
    update("colors.accentHex", preset.accent);
    update("colors.background", preset.bg);
    update("colors.foreground", preset.fg);
    update("colors.borderColor", preset.border);
    update("colors.linkColor", preset.primary);
  };

  const resetToBlank = () => {
    setTokens({});
    clearTokensFromDOM();
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateTokens.mutateAsync({ tenantId, tokens: tokens as Record<string, unknown> });
      applyTokensToDOM(tokens as Record<string, unknown>);
      setIsDirty(false);
      toast.success("Theme saved");
    } catch {
      toast.error("Failed to save theme");
    }
  };

  // Current values
  const primary = get(tokens, "colors.primaryHex", "");
  const accent = get(tokens, "colors.accentHex", "");
  const bg = get(tokens, "colors.background", "");
  const fg = get(tokens, "colors.foreground", "");
  const borderColor = get(tokens, "colors.borderColor", "");
  const linkColor = get(tokens, "colors.linkColor", "");
  const headingFont = get(tokens, "fonts.heading.family", "");
  const bodyFont = get(tokens, "fonts.body.family", "");
  const baseFontSize = get(tokens, "baseFontSize", "");
  const sectionPadding = get(tokens, "spacing.sectionPadding", "");
  const contentGap = get(tokens, "spacing.contentGap", "");
  const containerMaxWidth = get(tokens, "spacing.containerMaxWidth", "");
  const containerPadding = get(tokens, "spacing.containerPadding", "");
  const radius = get(tokens, "borderRadius.default", "");
  const shadow = get(tokens, "effects.defaultShadow", "");
  const borderWidth = get(tokens, "effects.borderWidth", "");
  const darkMode = get(tokens, "colors.darkMode", false);

  // Responsive
  const rKey = breakpoint === "desktop" ? "" : breakpoint;
  const rSectionPadding = rKey
    ? get(tokens, `responsive.${rKey}.sectionPadding`, "")
    : sectionPadding;
  const rHeadingScale = rKey
    ? get(tokens, `responsive.${rKey}.headingScale`, "")
    : "";
  const rBaseFontSize = rKey
    ? get(tokens, `responsive.${rKey}.baseFontSize`, "")
    : baseFontSize;
  const rContainerMaxWidth = rKey
    ? get(tokens, `responsive.${rKey}.containerMaxWidth`, "")
    : containerMaxWidth;

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fonts = [headingFont, bodyFont].filter(
      (f) => f && f !== "system" && f !== "inherit",
    );
    for (const fontValue of fonts) {
      // Extract family name from CSS value like "'Playfair Display', serif"
      const family = fontValue.replace(/^'|'.*$/g, "");
      if (!family) continue;
      const linkId = `google-font-${family.replace(/\s+/g, "-")}`;
      if (document.getElementById(linkId)) continue;
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }, [headingFont, bodyFont]);

  // Preview values (with visual fallbacks for the preview only)
  const pBg = bg || "#ffffff";
  const pFg = fg || "#1a1a1a";
  const pPrimary = primary || "#3b82f6";
  const pRadius = radius || "0.375rem";
  const pShadow =
    shadow === "sm"
      ? "0 1px 2px rgba(0,0,0,0.05)"
      : shadow === "md"
        ? "0 4px 6px -1px rgba(0,0,0,0.1)"
        : shadow === "lg"
          ? "0 10px 15px -3px rgba(0,0,0,0.1)"
          : "none";
  const pBorderColor = borderColor || "#e5e7eb";
  const pBorderWidth = borderWidth || "1px";
  const pHeadingFont = headingFont || "inherit";
  const pBodyFont = bodyFont || "inherit";
  const pLinkColor = linkColor || pPrimary;
  const pPadding =
    sectionPadding === "sm"
      ? "1rem"
      : sectionPadding === "md"
        ? "2rem"
        : sectionPadding === "lg"
          ? "3rem"
          : sectionPadding === "xl"
            ? "4rem"
            : sectionPadding === "2xl"
              ? "6rem"
              : "2rem";

  if (isLoading) {
    return (
      <PageLayout title="Theme" description="Loading...">
        <div className="flex items-center gap-2 p-8">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading theme settings...</span>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Theme"
      description="Configure your site's design system"
      noPadding
      contentClassName="theme-content-reset"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={resetToBlank}
            disabled={updateTokens.isPending}
          >
            <RotateCcw className="size-3.5" />
            Reset to Blank
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || updateTokens.isPending}
          >
            {updateTokens.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            {updateTokens.isPending ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      }
    >
      <div className="theme-layout">
        {/* ================================================================
         * LIVE PREVIEW
         * ================================================================ */}
        <div className="theme-canvas">
          <div className="theme-canvas-inner">
            <div
              className="theme-preview"
              style={{
                backgroundColor: pBg,
                color: pFg,
                fontFamily: pBodyFont,
                fontSize: baseFontSize || undefined,
              }}
            >
              <div
                className="theme-preview-section"
                style={{ padding: pPadding }}
              >
                <h2
                  className="theme-preview-heading"
                  style={{ fontFamily: pHeadingFont }}
                >
                  Your Website Heading
                </h2>
                <p className="theme-preview-body">
                  This is a preview of how your site content will look with the
                  current theme settings. Body text uses the selected font,
                  size, and color. Everything updates in real-time.
                </p>

                <div className="theme-preview-row">
                  <button
                    type="button"
                    className="theme-preview-button"
                    style={{
                      backgroundColor: pPrimary,
                      borderRadius: pRadius,
                    }}
                  >
                    Call to Action
                  </button>
                  <a
                    className="theme-preview-link"
                    style={{ color: pLinkColor }}
                  >
                    Learn more
                  </a>
                </div>

                <div
                  className="theme-preview-card"
                  style={{
                    borderColor: pBorderColor,
                    borderWidth: pBorderWidth,
                    borderStyle: "solid",
                    borderRadius: pRadius,
                    boxShadow: pShadow,
                  }}
                >
                  <p
                    className="theme-preview-card-title"
                    style={{ fontFamily: pHeadingFont }}
                  >
                    Card Component
                  </p>
                  <p className="theme-preview-card-desc">
                    Cards inherit border radius, shadow, and border settings
                    from your theme.
                  </p>
                </div>

                <hr
                  className="theme-preview-divider"
                  style={{
                    borderColor: pBorderColor,
                    borderWidth: `${pBorderWidth} 0 0 0`,
                  }}
                />

                <p
                  className="theme-preview-body"
                  style={{ fontSize: "13px", opacity: 0.5 }}
                >
                  Footer text or caption preview
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
         * SETTINGS SIDEBAR
         * ================================================================ */}
        <div className="theme-sidebar scrollbar-y">
          {/* Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Preset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="theme-presets">
                <button
                  type="button"
                  className="theme-preset-btn"
                  data-active={Object.keys(tokens).length === 0 || undefined}
                  onClick={resetToBlank}
                >
                  <div className="theme-preset-blank" />
                  <span className="theme-preset-label">Blank</span>
                </button>
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    className="theme-preset-btn"
                    data-active={primary === preset.primary || undefined}
                    onClick={() => applyPreset(preset)}
                  >
                    <div
                      className="theme-preset-swatch"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span className="theme-preset-label">{preset.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <div className="theme-field-grid">
                <ColorPicker
                  label="Primary"
                  value={primary}
                  onChange={(v) => update("colors.primaryHex", v)}
                />
                <ColorPicker
                  label="Accent"
                  value={accent}
                  onChange={(v) => update("colors.accentHex", v)}
                />
                <ColorPicker
                  label="Background"
                  value={bg}
                  onChange={(v) => update("colors.background", v)}
                />
                <ColorPicker
                  label="Text"
                  value={fg}
                  onChange={(v) => update("colors.foreground", v)}
                />
                <ColorPicker
                  label="Border"
                  value={borderColor}
                  onChange={(v) => update("colors.borderColor", v)}
                />
                <ColorPicker
                  label="Link"
                  value={linkColor}
                  onChange={(v) => update("colors.linkColor", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <div className="theme-field-row">
                <Label className="theme-field-label">Heading Font</Label>
                <PropertySelect
                  value={headingFont}
                  options={FONT_OPTIONS}
                  onChange={(v) => update("fonts.heading.family", v)}
                  placeholder="System default"
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Body Font</Label>
                <PropertySelect
                  value={bodyFont}
                  options={FONT_OPTIONS}
                  onChange={(v) => update("fonts.body.family", v)}
                  placeholder="System default"
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Base Font Size</Label>
                <PropertyToggle
                  value={baseFontSize}
                  options={[
                    { value: "14px", label: "14" },
                    { value: "15px", label: "15" },
                    { value: "16px", label: "16" },
                    { value: "17px", label: "17" },
                    { value: "18px", label: "18" },
                  ]}
                  onChange={(v) => update("baseFontSize", v)}
                  fullWidth
                />
              </div>
              <div className="theme-font-preview">
                <p
                  className="theme-font-preview-heading"
                  style={{ fontFamily: pHeadingFont }}
                >
                  Heading Font Preview
                </p>
                <p
                  className="theme-font-preview-body"
                  style={{ fontFamily: pBodyFont }}
                >
                  Body font preview. This is how your paragraphs and content
                  will look.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Spacing & Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Spacing & Layout</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <div className="theme-field-row">
                <Label className="theme-field-label">Section Padding</Label>
                <PropertyToggle
                  value={sectionPadding}
                  options={[
                    { value: "none", label: "None" },
                    { value: "sm", label: "S" },
                    { value: "md", label: "M" },
                    { value: "lg", label: "L" },
                    { value: "xl", label: "XL" },
                    { value: "2xl", label: "2XL" },
                  ]}
                  onChange={(v) => update("spacing.sectionPadding", v)}
                  fullWidth
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Content Gap</Label>
                <PropertyToggle
                  value={contentGap}
                  options={[
                    { value: "sm", label: "S" },
                    { value: "md", label: "M" },
                    { value: "lg", label: "L" },
                    { value: "xl", label: "XL" },
                  ]}
                  onChange={(v) => update("spacing.contentGap", v)}
                  fullWidth
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Container Max Width</Label>
                <PropertyToggle
                  value={containerMaxWidth}
                  options={[
                    { value: "960px", label: "960" },
                    { value: "1080px", label: "1080" },
                    { value: "1200px", label: "1200" },
                    { value: "1400px", label: "1400" },
                    { value: "100%", label: "Full" },
                  ]}
                  onChange={(v) => update("spacing.containerMaxWidth", v)}
                  fullWidth
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Container Padding</Label>
                <PropertyToggle
                  value={containerPadding}
                  options={[
                    { value: "sm", label: "S" },
                    { value: "md", label: "M" },
                    { value: "lg", label: "L" },
                    { value: "xl", label: "XL" },
                  ]}
                  onChange={(v) => update("spacing.containerPadding", v)}
                  fullWidth
                />
              </div>
            </CardContent>
          </Card>

          {/* Borders & Effects */}
          <Card>
            <CardHeader>
              <CardTitle>Borders & Effects</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <div className="theme-field-row">
                <Label className="theme-field-label">Border Radius</Label>
                <PropertyToggle
                  value={radius}
                  options={[
                    { value: "0", label: "None" },
                    { value: "0.25rem", label: "S" },
                    { value: "0.5rem", label: "M" },
                    { value: "0.75rem", label: "L" },
                    { value: "1rem", label: "XL" },
                    { value: "9999px", label: "Full" },
                  ]}
                  onChange={(v) => update("borderRadius.default", v)}
                  fullWidth
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Default Shadow</Label>
                <PropertyToggle
                  value={shadow}
                  options={[
                    { value: "none", label: "None" },
                    { value: "sm", label: "S" },
                    { value: "md", label: "M" },
                    { value: "lg", label: "L" },
                  ]}
                  onChange={(v) => update("effects.defaultShadow", v)}
                  fullWidth
                />
              </div>
              <div className="theme-field-row">
                <Label className="theme-field-label">Border Width</Label>
                <PropertyToggle
                  value={borderWidth}
                  options={[
                    { value: "0", label: "None" },
                    { value: "1px", label: "1px" },
                    { value: "2px", label: "2px" },
                    { value: "3px", label: "3px" },
                  ]}
                  onChange={(v) => update("effects.borderWidth", v)}
                  fullWidth
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsive Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <PropertyToggle
                value={breakpoint}
                options={[
                  { value: "desktop", label: "Desktop" },
                  { value: "tablet", label: "Tablet" },
                  { value: "mobile", label: "Mobile" },
                ]}
                onChange={(v) => {
                  if (v) setBreakpoint(v as "desktop" | "tablet" | "mobile");
                }}
                fullWidth
              />

              {breakpoint === "desktop" ? (
                <p className="text-[12px] text-(--el-400)">
                  Desktop uses the main settings above. Select Tablet or Mobile
                  to set responsive overrides.
                </p>
              ) : (
                <div className="theme-responsive-overrides">
                  <div className="theme-field-row">
                    <Label className="theme-field-label">Section Padding</Label>
                    <PropertyToggle
                      value={rSectionPadding}
                      options={[
                        { value: "none", label: "None" },
                        { value: "sm", label: "S" },
                        { value: "md", label: "M" },
                        { value: "lg", label: "L" },
                        { value: "xl", label: "XL" },
                      ]}
                      onChange={(v) =>
                        update(`responsive.${breakpoint}.sectionPadding`, v)
                      }
                      fullWidth
                    />
                  </div>
                  <div className="theme-field-row">
                    <Label className="theme-field-label">Heading Scale</Label>
                    <PropertyToggle
                      value={rHeadingScale}
                      options={[
                        { value: "same", label: "Same" },
                        { value: "one-down", label: "-1" },
                        { value: "two-down", label: "-2" },
                      ]}
                      onChange={(v) =>
                        update(`responsive.${breakpoint}.headingScale`, v)
                      }
                      fullWidth
                    />
                  </div>
                  <div className="theme-field-row">
                    <Label className="theme-field-label">Base Font Size</Label>
                    <PropertyToggle
                      value={rBaseFontSize}
                      options={[
                        { value: "13px", label: "13" },
                        { value: "14px", label: "14" },
                        { value: "15px", label: "15" },
                        { value: "16px", label: "16" },
                      ]}
                      onChange={(v) =>
                        update(`responsive.${breakpoint}.baseFontSize`, v)
                      }
                      fullWidth
                    />
                  </div>
                  <div className="theme-field-row">
                    <Label className="theme-field-label">
                      Container Max Width
                    </Label>
                    <PropertyToggle
                      value={rContainerMaxWidth}
                      options={[
                        { value: "100%", label: "Full" },
                        { value: "768px", label: "768" },
                        { value: "640px", label: "640" },
                      ]}
                      onChange={(v) =>
                        update(`responsive.${breakpoint}.containerMaxWidth`, v)
                      }
                      fullWidth
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dark Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
            </CardHeader>
            <CardContent className="theme-field-group">
              <div className="flex items-center justify-between">
                <Label>Enable dark mode</Label>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(v) => update("colors.darkMode", v)}
                />
              </div>
              {darkMode && (
                <div className="theme-field-grid">
                  <ColorPicker
                    label="Dark Background"
                    value={get(tokens, "colors.darkBackground", "")}
                    onChange={(v) => update("colors.darkBackground", v)}
                  />
                  <ColorPicker
                    label="Dark Text"
                    value={get(tokens, "colors.darkForeground", "")}
                    onChange={(v) => update("colors.darkForeground", v)}
                  />
                  <ColorPicker
                    label="Dark Border"
                    value={get(tokens, "colors.darkBorderColor", "")}
                    onChange={(v) => update("colors.darkBorderColor", v)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

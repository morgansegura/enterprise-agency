"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useTenantTokens, useUpdateTenantTokens } from "@/lib/hooks";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import type { TenantTokens } from "@/lib/hooks/use-tenant-tokens";

import "./theme.css";

// Color preset options
const COLOR_PRESETS = [
  { name: "Blue", primary: "#0052cc", accent: "#0065ff" },
  { name: "Indigo", primary: "#4f46e5", accent: "#6366f1" },
  { name: "Purple", primary: "#7c3aed", accent: "#8b5cf6" },
  { name: "Pink", primary: "#db2777", accent: "#ec4899" },
  { name: "Red", primary: "#dc2626", accent: "#ef4444" },
  { name: "Orange", primary: "#ea580c", accent: "#f97316" },
  { name: "Green", primary: "#16a34a", accent: "#22c55e" },
  { name: "Teal", primary: "#0d9488", accent: "#14b8a6" },
  { name: "Slate", primary: "#475569", accent: "#64748b" },
];

const RADIUS_OPTIONS = [
  { label: "None", value: "0" },
  { label: "Small", value: "0.25rem" },
  { label: "Medium", value: "0.5rem" },
  { label: "Large", value: "0.75rem" },
  { label: "Full", value: "9999px" },
];

const FONT_OPTIONS = [
  { label: "System", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Plus Jakarta", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Playfair", value: "'Playfair Display', serif" },
  { label: "Lora", value: "'Lora', serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
];

export default function ThemePage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  const [localTokens, setLocalTokens] = React.useState<TenantTokens>({});
  const [isDirty, setIsDirty] = React.useState(false);

  // Sync from server
  React.useEffect(() => {
    if (tokens) {
      setLocalTokens(tokens);
    }
  }, [tokens]);

  const handleColorChange = (field: string, value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleFontChange = (value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        body: { family: value },
      },
    }));
    setIsDirty(true);
  };

  const handleRadiusChange = (value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      borderRadius: {
        ...prev.borderRadius,
        md: value,
      },
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateTokens.mutateAsync({
        tenantId,
        tokens: localTokens,
      });
      setIsDirty(false);
      toast.success("Theme saved");
    } catch {
      toast.error("Failed to save theme");
    }
  };

  // Get current values with fallbacks
  const colors = (localTokens.colors ?? {}) as unknown as Record<string, unknown>;
  const fonts = (localTokens.fonts ?? {}) as unknown as Record<string, unknown>;
  const radii = (localTokens.borderRadius ?? {}) as unknown as Record<string, unknown>;

  const primaryColor = (colors.primaryHex as string) || "#0052cc";
  const accentColor = (colors.accentHex as string) || "#0065ff";
  const bgColor = (colors.background as string) || "#ffffff";
  const fgColor = (colors.foreground as string) || "#172b4d";
  const bodyFont = (fonts.body as string) || FONT_OPTIONS[0].value;
  const radius = (radii.md as string) || "0.5rem";

  if (isLoading) {
    return (
      <PageLayout title="Theme" description="Loading...">
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-(--el-100) rounded animate-pulse" />
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Theme"
      description="Configure your site's colors, typography, and style"
      actions={
        <Button onClick={handleSave} disabled={!isDirty || updateTokens.isPending}>
          <Save className="size-4" />
          {updateTokens.isPending ? "Saving..." : "Save Theme"}
        </Button>
      }
    >
      <div className="theme-page">
        {/* Color Presets */}
        <section className="theme-section">
          <h3 className="theme-section-title">Color Preset</h3>
          <p className="theme-section-desc">
            Quick-start with a color palette
          </p>
          <div className="theme-color-presets">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="theme-color-preset"
                data-active={primaryColor === preset.primary || undefined}
                onClick={() => {
                  handleColorChange("primaryHex", preset.primary);
                  handleColorChange("accentHex", preset.accent);
                }}
                title={preset.name}
              >
                <div
                  className="theme-color-preset-swatch"
                  style={{ backgroundColor: preset.primary }}
                />
                <span className="theme-color-preset-label">{preset.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Colors */}
        <section className="theme-section">
          <h3 className="theme-section-title">Colors</h3>
          <div className="theme-color-grid">
            <div className="theme-color-field">
              <label className="theme-label">Primary</label>
              <div className="theme-color-input-row">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleColorChange("primaryHex", e.target.value)}
                  className="theme-color-picker"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => handleColorChange("primaryHex", e.target.value)}
                  className="theme-color-hex"
                />
              </div>
            </div>
            <div className="theme-color-field">
              <label className="theme-label">Accent</label>
              <div className="theme-color-input-row">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleColorChange("accentHex", e.target.value)}
                  className="theme-color-picker"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => handleColorChange("accentHex", e.target.value)}
                  className="theme-color-hex"
                />
              </div>
            </div>
            <div className="theme-color-field">
              <label className="theme-label">Background</label>
              <div className="theme-color-input-row">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleColorChange("background", e.target.value)}
                  className="theme-color-picker"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => handleColorChange("background", e.target.value)}
                  className="theme-color-hex"
                />
              </div>
            </div>
            <div className="theme-color-field">
              <label className="theme-label">Text</label>
              <div className="theme-color-input-row">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => handleColorChange("foreground", e.target.value)}
                  className="theme-color-picker"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => handleColorChange("foreground", e.target.value)}
                  className="theme-color-hex"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="theme-section">
          <h3 className="theme-section-title">Typography</h3>
          <div className="theme-font-grid">
            <div className="theme-field">
              <label className="theme-label">Body Font</label>
              <select
                className="theme-select"
                value={bodyFont}
                onChange={(e) => handleFontChange(e.target.value)}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.label} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="theme-font-preview" style={{ fontFamily: bodyFont }}>
            <p className="theme-font-preview-heading">
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="theme-font-preview-body">
              Pack my box with five dozen liquor jugs. How vexingly quick daft
              zebras jump.
            </p>
          </div>
        </section>

        {/* Border Radius */}
        <section className="theme-section">
          <h3 className="theme-section-title">Border Radius</h3>
          <div className="theme-radius-options">
            {RADIUS_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                className="theme-radius-option"
                data-active={radius === option.value || undefined}
                onClick={() => handleRadiusChange(option.value)}
              >
                <div
                  className="theme-radius-preview"
                  style={{ borderRadius: option.value }}
                />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dark Mode */}
        <section className="theme-section">
          <h3 className="theme-section-title">Dark Mode</h3>
          <p className="theme-section-desc">
            Enable dark mode for your site
          </p>
          <div className="theme-radius-options">
            <button
              type="button"
              className="theme-radius-option"
              data-active={!(colors.darkMode as boolean) || undefined}
              onClick={() => {
                handleColorChange("darkMode", false as unknown as string);
              }}
            >
              <div className="theme-radius-preview" style={{ background: "#ffffff" }} />
              <span>Light</span>
            </button>
            <button
              type="button"
              className="theme-radius-option"
              data-active={(colors.darkMode as boolean) || undefined}
              onClick={() => {
                handleColorChange("darkMode", true as unknown as string);
              }}
            >
              <div className="theme-radius-preview" style={{ background: "#1b2638" }} />
              <span>Dark</span>
            </button>
          </div>
        </section>

        {/* Preview */}
        <section className="theme-section">
          <h3 className="theme-section-title">Preview</h3>
          <div
            className="theme-preview-card"
            style={{
              backgroundColor: bgColor,
              color: fgColor,
              borderRadius: radius,
              fontFamily: bodyFont,
            }}
          >
            <h4 style={{ color: primaryColor }}>Your Website</h4>
            <p>This is how your site content will look with these theme settings.</p>
            <button
              style={{
                backgroundColor: primaryColor,
                color: "#fff",
                borderRadius: radius,
                padding: "8px 16px",
                border: "none",
                fontFamily: bodyFont,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Call to Action
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

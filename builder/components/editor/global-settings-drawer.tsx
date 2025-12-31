"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Palette, Type, Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useTenantTokens,
  useUpdateTenantTokens,
} from "@/lib/hooks/use-tenant-tokens";
import { toast } from "sonner";

import "./global-settings-drawer.css";

type SettingsTab = "colors" | "typography";

interface NavItem {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    description: "Brand colors",
  },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    description: "Fonts & text",
  },
];

interface GlobalSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}

export function GlobalSettingsDrawer({
  open,
  onOpenChange,
  tenantId,
}: GlobalSettingsDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("colors");

  // Fetch existing tokens
  const { data: tokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  // Define semantic color token structure
  interface SemanticColors {
    // Brand colors
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    // Background colors
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    // UI colors
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    // Status
    destructive: string;
  }

  // Default values matching globals.css
  const defaultColors: SemanticColors = {
    primary: "#1a3f56",
    primaryForeground: "#ffffff",
    secondary: "#ac8365",
    secondaryForeground: "#ffffff",
    accent: "#f4f4f5",
    accentForeground: "#18181b",
    background: "#fafafa",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    popover: "#ffffff",
    popoverForeground: "#09090b",
    muted: "#e4e4e7",
    mutedForeground: "#52525b",
    border: "#e4e4e7",
    input: "#d4d4d8",
    ring: "#047857",
    destructive: "#dc2626",
  };

  // Local state for editing
  const [localTokens, setLocalTokens] = React.useState<{
    colors: SemanticColors;
    typography: {
      fontFamily: {
        base: string;
        heading: string;
      };
      borderRadius: string;
    };
  }>({
    colors: defaultColors,
    typography: {
      fontFamily: { base: "Open_Sans", heading: "Roboto_Slab" },
      borderRadius: "0.5rem",
    },
  });

  // Track original values to detect changes
  const [originalTokens, setOriginalTokens] = React.useState<
    typeof localTokens
  >({
    colors: defaultColors,
    typography: {
      fontFamily: { base: "Open_Sans", heading: "Roboto_Slab" },
      borderRadius: "0.5rem",
    },
  });

  // Sync local state with fetched tokens
  React.useEffect(() => {
    if (tokens) {
      const semanticTokens = tokens as { semantic?: Partial<SemanticColors> };
      const initial = {
        colors: {
          primary: semanticTokens.semantic?.primary || defaultColors.primary,
          primaryForeground:
            semanticTokens.semantic?.primaryForeground ||
            defaultColors.primaryForeground,
          secondary:
            semanticTokens.semantic?.secondary || defaultColors.secondary,
          secondaryForeground:
            semanticTokens.semantic?.secondaryForeground ||
            defaultColors.secondaryForeground,
          accent: semanticTokens.semantic?.accent || defaultColors.accent,
          accentForeground:
            semanticTokens.semantic?.accentForeground ||
            defaultColors.accentForeground,
          background:
            semanticTokens.semantic?.background || defaultColors.background,
          foreground:
            semanticTokens.semantic?.foreground || defaultColors.foreground,
          card: semanticTokens.semantic?.card || defaultColors.card,
          cardForeground:
            semanticTokens.semantic?.cardForeground ||
            defaultColors.cardForeground,
          popover: semanticTokens.semantic?.popover || defaultColors.popover,
          popoverForeground:
            semanticTokens.semantic?.popoverForeground ||
            defaultColors.popoverForeground,
          muted: semanticTokens.semantic?.muted || defaultColors.muted,
          mutedForeground:
            semanticTokens.semantic?.mutedForeground ||
            defaultColors.mutedForeground,
          border: semanticTokens.semantic?.border || defaultColors.border,
          input: semanticTokens.semantic?.input || defaultColors.input,
          ring: semanticTokens.semantic?.ring || defaultColors.ring,
          destructive:
            semanticTokens.semantic?.destructive || defaultColors.destructive,
        },
        typography: {
          fontFamily: {
            base: tokens.typography?.fontFamily?.base || "Open_Sans",
            heading: tokens.typography?.fontFamily?.heading || "Roboto_Slab",
          },
          borderRadius:
            (tokens.borderRadius as { base?: string })?.base || "0.5rem",
        },
      };
      setLocalTokens(initial);
      setOriginalTokens(initial);
    }
  }, [tokens]);

  // Check if there are unsaved changes
  const hasChanges = React.useMemo(() => {
    return JSON.stringify(localTokens) !== JSON.stringify(originalTokens);
  }, [localTokens, originalTokens]);

  const handleColorChange = (
    key: keyof typeof defaultColors,
    value: string,
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleTypographyChange = (key: string, value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontFamily: {
          ...prev.typography.fontFamily,
          [key]: value,
        },
      },
    }));
  };

  const handleBorderRadiusChange = (value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        borderRadius: value,
      },
    }));
  };

  const handleSave = () => {
    // Save semantic colors directly + generate scales for primary/secondary
    const tokensToSave = {
      semantic: localTokens.colors,
      colors: {
        primary: generateColorScale(localTokens.colors.primary),
        secondary: generateColorScale(localTokens.colors.secondary),
        accent: generateColorScale(localTokens.colors.accent),
      },
      typography: {
        fontFamily: {
          base: localTokens.typography.fontFamily.base,
          heading: localTokens.typography.fontFamily.heading,
        },
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        base: localTokens.typography.borderRadius,
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    };

    updateTokens.mutate(
      { tenantId, tokens: tokensToSave as Record<string, unknown> },
      {
        onSuccess: () => {
          toast.success("Brand settings saved!");
          // Apply tokens as CSS variables immediately
          applyTokensToDOM(tokensToSave);
          // Update original tokens to match current (no more unsaved changes)
          setOriginalTokens(localTokens);
        },
        onError: () => {
          toast.error("Failed to save settings");
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="global-settings-drawer">
        <div className="global-settings-layout">
          {/* Sidebar Navigation */}
          <nav className="global-settings-sidebar">
            <SheetHeader className="global-settings-header">
              <SheetTitle className="font-(family-name:--font-heading) tracking-wide flex items-center gap-2">
                <Globe className="size-4" />
                Global Settings
              </SheetTitle>
            </SheetHeader>

            <ul className="global-settings-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className={cn(
                        "global-settings-nav-item",
                        activeTab === item.id && "is-active",
                      )}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="global-settings-nav-text">
                        <span className="global-settings-nav-label">
                          {item.label}
                        </span>
                        <span className="global-settings-nav-desc">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content Area */}
          <div className="global-settings-content">
            {/* Save Button - Top Right */}
            <div className="global-settings-actions">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={!hasChanges || updateTokens.isPending}
              >
                {updateTokens.isPending && (
                  <Loader2 className="h-4 w-4  animate-spin" />
                )}
                {hasChanges ? "Save Changes" : "Saved"}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {activeTab === "colors" && (
                  <ColorSettings
                    colors={localTokens.colors}
                    onChange={handleColorChange}
                  />
                )}
                {activeTab === "typography" && (
                  <TypographySettings
                    fontFamily={localTokens.typography?.fontFamily || {}}
                    borderRadius={
                      localTokens.typography?.borderRadius || "0.5rem"
                    }
                    onFontChange={handleTypographyChange}
                    onRadiusChange={handleBorderRadiusChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Generate a color scale from a base color (simplified - you may want a more sophisticated algorithm)
function generateColorScale(baseColor: string): Record<string, string> {
  // For now, just use the base color as 500 and derive others
  // In production, you'd use a color library to generate proper shades
  return {
    50: lightenColor(baseColor, 0.95),
    100: lightenColor(baseColor, 0.9),
    200: lightenColor(baseColor, 0.75),
    300: lightenColor(baseColor, 0.6),
    400: lightenColor(baseColor, 0.3),
    500: baseColor,
    600: darkenColor(baseColor, 0.1),
    700: darkenColor(baseColor, 0.25),
    800: darkenColor(baseColor, 0.4),
    900: darkenColor(baseColor, 0.55),
    950: darkenColor(baseColor, 0.7),
  };
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(
    255,
    Math.round((num >> 16) + (255 - (num >> 16)) * amount),
  );
  const g = Math.min(
    255,
    Math.round(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * amount),
  );
  const b = Math.min(
    255,
    Math.round((num & 0x0000ff) + (255 - (num & 0x0000ff)) * amount),
  );
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.round((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0x00ff) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0x0000ff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Map camelCase keys to CSS variable names
const semanticToCssVar: Record<string, string> = {
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  destructive: "--destructive",
};

// Apply tokens as CSS custom properties
function applyTokensToDOM(tokens: Record<string, unknown>) {
  const root = document.documentElement;

  // Apply semantic color tokens
  if (tokens.semantic) {
    const semantic = tokens.semantic as Record<string, string>;
    Object.entries(semantic).forEach(([key, value]) => {
      const cssVar = semanticToCssVar[key];
      if (cssVar) {
        root.style.setProperty(cssVar, value);
      }
    });
  }

  // Apply color scale tokens (primary-500, secondary-500, etc.)
  if (tokens.colors) {
    const colors = tokens.colors as Record<string, Record<string, string>>;
    Object.entries(colors).forEach(([colorName, scale]) => {
      Object.entries(scale).forEach(([shade, value]) => {
        root.style.setProperty(`--color-${colorName}-${shade}`, value);
      });
    });
  }

  // Apply border radius
  if (tokens.borderRadius) {
    const radius = tokens.borderRadius as Record<string, string>;
    Object.entries(radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
  }
}

// Tailwind color palette
const tailwindColors = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e",
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344",
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065",
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e",
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519",
  },
};

type ColorName = keyof typeof tailwindColors;
type ShadeKey = keyof (typeof tailwindColors)["slate"];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="color-picker" ref={containerRef}>
      <label className="color-picker-label">{label}</label>
      <button
        className="color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className="color-picker-swatch"
          style={{ backgroundColor: value }}
        />
        <span className="color-picker-value">{value}</span>
      </button>

      {isOpen && (
        <div className="color-picker-dropdown">
          <div className="color-palette">
            {(Object.keys(tailwindColors) as ColorName[]).map((colorName) => (
              <div key={colorName} className="color-row">
                <span className="color-row-label">{colorName}</span>
                <div className="color-row-shades">
                  {(
                    Object.keys(
                      tailwindColors[colorName],
                    ) as unknown as ShadeKey[]
                  ).map((shade) => {
                    const hex = tailwindColors[colorName][shade];
                    return (
                      <button
                        key={shade}
                        className={cn(
                          "color-swatch",
                          value === hex && "is-selected",
                        )}
                        style={{ backgroundColor: hex }}
                        onClick={() => {
                          onChange(hex);
                          setIsOpen(false);
                        }}
                        title={`${colorName}-${shade}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Semantic color token keys
type SemanticColorKey =
  | "primary"
  | "primaryForeground"
  | "secondary"
  | "secondaryForeground"
  | "accent"
  | "accentForeground"
  | "background"
  | "foreground"
  | "card"
  | "cardForeground"
  | "popover"
  | "popoverForeground"
  | "muted"
  | "mutedForeground"
  | "border"
  | "input"
  | "ring"
  | "destructive";

interface ColorSettingsProps {
  colors: Record<SemanticColorKey, string>;
  onChange: (key: SemanticColorKey, value: string) => void;
}

function ColorSettings({ colors, onChange }: ColorSettingsProps) {
  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Brand Colors</h3>
      <p className="settings-section-description">
        Configure all semantic color tokens for this website. These will be
        saved and applied globally to the site.
      </p>

      {/* Brand Colors */}
      <div className="settings-grid-block">
        <h4 className="settings-grid-title">Brand</h4>
        <div className="settings-grid">
          <ColorPicker
            label="Primary"
            value={colors.primary}
            onChange={(v) => onChange("primary", v)}
          />
          <ColorPicker
            label="Primary Foreground"
            value={colors.primaryForeground}
            onChange={(v) => onChange("primaryForeground", v)}
          />
          <ColorPicker
            label="Secondary"
            value={colors.secondary}
            onChange={(v) => onChange("secondary", v)}
          />
          <ColorPicker
            label="Secondary Foreground"
            value={colors.secondaryForeground}
            onChange={(v) => onChange("secondaryForeground", v)}
          />
          <ColorPicker
            label="Accent"
            value={colors.accent}
            onChange={(v) => onChange("accent", v)}
          />
          <ColorPicker
            label="Accent Foreground"
            value={colors.accentForeground}
            onChange={(v) => onChange("accentForeground", v)}
          />
        </div>
      </div>

      {/* Background Colors */}
      <div className="settings-grid-block">
        <h4 className="settings-grid-title">Backgrounds</h4>
        <div className="settings-grid">
          <ColorPicker
            label="Background"
            value={colors.background}
            onChange={(v) => onChange("background", v)}
          />
          <ColorPicker
            label="Foreground"
            value={colors.foreground}
            onChange={(v) => onChange("foreground", v)}
          />
          <ColorPicker
            label="Card"
            value={colors.card}
            onChange={(v) => onChange("card", v)}
          />
          <ColorPicker
            label="Card Foreground"
            value={colors.cardForeground}
            onChange={(v) => onChange("cardForeground", v)}
          />
          <ColorPicker
            label="Popover"
            value={colors.popover}
            onChange={(v) => onChange("popover", v)}
          />
          <ColorPicker
            label="Popover Foreground"
            value={colors.popoverForeground}
            onChange={(v) => onChange("popoverForeground", v)}
          />
        </div>
      </div>

      {/* UI Colors */}
      <div className="settings-grid-block">
        <h4 className="settings-grid-title">UI Elements</h4>
        <div className="settings-grid">
          <ColorPicker
            label="Muted"
            value={colors.muted}
            onChange={(v) => onChange("muted", v)}
          />
          <ColorPicker
            label="Muted Foreground"
            value={colors.mutedForeground}
            onChange={(v) => onChange("mutedForeground", v)}
          />
          <ColorPicker
            label="Border"
            value={colors.border}
            onChange={(v) => onChange("border", v)}
          />
          <ColorPicker
            label="Input"
            value={colors.input}
            onChange={(v) => onChange("input", v)}
          />
          <ColorPicker
            label="Ring (Focus)"
            value={colors.ring}
            onChange={(v) => onChange("ring", v)}
          />
        </div>
      </div>

      {/* Status Colors */}
      <div className="settings-grid-block">
        <h4 className="settings-grid-title">Status</h4>
        <div className="settings-grid">
          <ColorPicker
            label="Destructive"
            value={colors.destructive}
            onChange={(v) => onChange("destructive", v)}
          />
        </div>
      </div>
    </div>
  );
}

interface TypographySettingsProps {
  fontFamily: {
    base?: string;
    heading?: string;
  };
  borderRadius: string;
  onFontChange: (key: string, value: string) => void;
  onRadiusChange: (value: string) => void;
}

// Curated list of Next.js Google Fonts (all available via next/font/google)
const googleFonts = [
  // Sans-serif fonts
  { value: "Inter", label: "Inter", category: "sans" },
  { value: "Open_Sans", label: "Open Sans", category: "sans" },
  { value: "Roboto", label: "Roboto", category: "sans" },
  { value: "Lato", label: "Lato", category: "sans" },
  { value: "Poppins", label: "Poppins", category: "sans" },
  { value: "Montserrat", label: "Montserrat", category: "sans" },
  { value: "Source_Sans_3", label: "Source Sans 3", category: "sans" },
  { value: "Nunito", label: "Nunito", category: "sans" },
  { value: "Raleway", label: "Raleway", category: "sans" },
  { value: "Work_Sans", label: "Work Sans", category: "sans" },
  { value: "DM_Sans", label: "DM Sans", category: "sans" },
  { value: "Plus_Jakarta_Sans", label: "Plus Jakarta Sans", category: "sans" },
  // Serif fonts
  { value: "Merriweather", label: "Merriweather", category: "serif" },
  { value: "Playfair_Display", label: "Playfair Display", category: "serif" },
  { value: "Lora", label: "Lora", category: "serif" },
  { value: "PT_Serif", label: "PT Serif", category: "serif" },
  { value: "Libre_Baskerville", label: "Libre Baskerville", category: "serif" },
  { value: "Roboto_Slab", label: "Roboto Slab", category: "serif" },
  { value: "Source_Serif_4", label: "Source Serif 4", category: "serif" },
  { value: "Bitter", label: "Bitter", category: "serif" },
  { value: "Crimson_Text", label: "Crimson Text", category: "serif" },
  { value: "EB_Garamond", label: "EB Garamond", category: "serif" },
];

const radiusOptions = [
  { value: "0", label: "None (Square)" },
  { value: "0.25rem", label: "Small" },
  { value: "0.5rem", label: "Medium" },
  { value: "0.75rem", label: "Large" },
  { value: "1rem", label: "Extra Large" },
  { value: "9999px", label: "Full (Pill)" },
];

function TypographySettings({
  fontFamily,
  borderRadius,
  onFontChange,
  onRadiusChange,
}: TypographySettingsProps) {
  return (
    <div className="settings-section">
      <h3 className="settings-section-title">Typography & Style</h3>
      <p className="settings-section-description">
        Configure fonts and border radius for this website. Fonts are loaded via
        Next.js Google Fonts for optimal performance.
      </p>

      <div className="settings-form">
        settings-grid-block
        <div className="settings-field">
          <Label htmlFor="font-base">Base Font (Body Text)</Label>
          <Select
            value={fontFamily.base || "Open_Sans"}
            onValueChange={(v) => onFontChange("base", v)}
          >
            <SelectTrigger id="font-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-(--muted-foreground)">
                Sans-serif
              </div>
              {googleFonts
                .filter((f) => f.category === "sans")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-(--muted-foreground) border-t mt-1 pt-2">
                Serif
              </div>
              {googleFonts
                .filter((f) => f.category === "serif")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="settings-field">
          <Label htmlFor="font-heading">Heading Font</Label>
          <Select
            value={fontFamily.heading || "Roboto_Slab"}
            onValueChange={(v) => onFontChange("heading", v)}
          >
            <SelectTrigger id="font-heading">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-(--muted-foreground)">
                Sans-serif
              </div>
              {googleFonts
                .filter((f) => f.category === "sans")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-(--muted-foreground) border-t mt-1 pt-2">
                Serif
              </div>
              {googleFonts
                .filter((f) => f.category === "serif")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="settings-field">
          <Label htmlFor="border-radius">Border Radius</Label>
          <Select value={borderRadius} onValueChange={onRadiusChange}>
            <SelectTrigger id="border-radius">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

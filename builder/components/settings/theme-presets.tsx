"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Building2,
  Palette,
  Minimize2,
  PenTool,
  Check,
  Eye,
} from "lucide-react";

// Import actual types and defaults from panels
import {
  type ColorSettingsData,
  defaultColorSettings,
} from "./color-settings-panel";
import {
  type TypographySettingsData,
  defaultTypographySettings,
} from "./typography-settings-panel";
import {
  type AnimationSettingsData,
  defaultAnimationSettings,
} from "./animation-settings-panel";
import {
  type ComponentSettingsData,
  defaultComponentSettings,
} from "./component-settings-panel";

// ============================================================================
// Types
// ============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: "modern" | "classic" | "playful" | "corporate" | "minimal";
  icon: React.ComponentType<{ className?: string }>;
  colors: ColorSettingsData;
  typography: TypographySettingsData;
  animations: AnimationSettingsData;
  components: ComponentSettingsData;
  preview: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontHeading: string;
    fontBody: string;
  };
}

interface ThemePresetsProps {
  onApplyTheme: (preset: ThemePreset) => void;
  currentThemeId?: string;
  className?: string;
}

// ============================================================================
// Theme Presets
// ============================================================================

export const themePresets: ThemePreset[] = [
  // Modern Theme
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines, bold typography, and a contemporary feel",
    category: "modern",
    icon: Sparkles,
    preview: {
      primaryColor: "#0f172a",
      secondaryColor: "#64748b",
      accentColor: "#3b82f6",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    colors: {
      ...defaultColorSettings,
      brand: {
        primary: "#0f172a",
        secondary: "#64748b",
        accent: "#3b82f6",
      },
      ui: {
        ...defaultColorSettings.ui,
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        ring: "#3b82f6",
      },
    },
    typography: {
      ...defaultTypographySettings,
      fonts: [
        {
          id: "primary",
          family: "Inter",
          weights: [400, 500, 600, 700, 800],
          category: "sans-serif",
        },
        {
          id: "secondary",
          family: "Inter",
          weights: [400, 500, 600],
          category: "sans-serif",
        },
        {
          id: "accent",
          family: "JetBrains Mono",
          weights: [400, 500],
          category: "monospace",
        },
      ],
      headings: {
        ...defaultTypographySettings.headings,
        h1: {
          fontSize: "5xl",
          fontWeight: "extrabold",
          lineHeight: "tight",
          letterSpacing: "tighter",
        },
      },
    },
    animations: {
      ...defaultAnimationSettings,
      defaultTiming: "easeOut",
      presets: {
        ...defaultAnimationSettings.presets,
        fadeIn: { duration: "150", timing: "easeOut" },
        scaleIn: { duration: "150", timing: "easeOut", from: "0.98" },
      },
    },
    components: {
      ...defaultComponentSettings,
      dropdown: { ...defaultComponentSettings.dropdown, borderRadius: "lg" },
      modal: { ...defaultComponentSettings.modal, borderRadius: "xl" },
      badge: { ...defaultComponentSettings.badge, borderRadius: "md" },
    },
  },

  // Classic Theme
  {
    id: "classic",
    name: "Classic",
    description: "Timeless elegance with serif typography and refined details",
    category: "classic",
    icon: PenTool,
    preview: {
      primaryColor: "#1c1917",
      secondaryColor: "#78716c",
      accentColor: "#b45309",
      fontHeading: "Playfair Display",
      fontBody: "Source Serif Pro",
    },
    colors: {
      ...defaultColorSettings,
      brand: {
        primary: "#1c1917",
        secondary: "#78716c",
        accent: "#b45309",
      },
      ui: {
        ...defaultColorSettings.ui,
        background: "#faf9f7",
        foreground: "#1c1917",
        card: "#ffffff",
        muted: "#f5f5f4",
        mutedForeground: "#78716c",
        border: "#d6d3d1",
        ring: "#b45309",
      },
      link: {
        default: "#b45309",
        hover: "#92400e",
        visited: "#78350f",
        active: "#a16207",
      },
    },
    typography: {
      ...defaultTypographySettings,
      fonts: [
        {
          id: "primary",
          family: "Playfair Display",
          weights: [400, 600, 700],
          category: "serif",
        },
        {
          id: "secondary",
          family: "Source Serif Pro",
          weights: [400, 600],
          category: "serif",
        },
        {
          id: "accent",
          family: "IBM Plex Mono",
          weights: [400, 500],
          category: "monospace",
        },
      ],
      roles: {
        heading: "primary",
        body: "secondary",
        button: "secondary",
        link: "secondary",
        caption: "secondary",
        navigation: "primary",
      },
      baseFontSize: "18",
    },
    animations: {
      ...defaultAnimationSettings,
      defaultTiming: "easeInOut",
      presets: {
        ...defaultAnimationSettings.presets,
        fadeIn: { duration: "300", timing: "easeInOut" },
        slideUp: { duration: "400", timing: "easeInOut", distance: "20" },
      },
    },
    components: {
      ...defaultComponentSettings,
      dropdown: {
        ...defaultComponentSettings.dropdown,
        borderRadius: "sm",
        shadow: "lg",
      },
      modal: { ...defaultComponentSettings.modal, borderRadius: "md" },
      badge: {
        ...defaultComponentSettings.badge,
        borderRadius: "sm",
        textTransform: "uppercase",
      },
      tabs: { ...defaultComponentSettings.tabs, variant: "underline" },
    },
  },

  // Playful Theme
  {
    id: "playful",
    name: "Playful",
    description: "Vibrant colors, rounded shapes, and energetic animations",
    category: "playful",
    icon: Palette,
    preview: {
      primaryColor: "#7c3aed",
      secondaryColor: "#ec4899",
      accentColor: "#06b6d4",
      fontHeading: "Nunito",
      fontBody: "Nunito",
    },
    colors: {
      ...defaultColorSettings,
      brand: {
        primary: "#7c3aed",
        secondary: "#ec4899",
        accent: "#06b6d4",
      },
      ui: {
        ...defaultColorSettings.ui,
        background: "#fefce8",
        foreground: "#1e1b4b",
        card: "#ffffff",
        muted: "#f5f3ff",
        mutedForeground: "#6b7280",
        border: "#e5e7eb",
        ring: "#7c3aed",
      },
      status: {
        success: "#10b981",
        successForeground: "#ffffff",
        warning: "#fbbf24",
        warningForeground: "#1e1b4b",
        error: "#f43f5e",
        errorForeground: "#ffffff",
        info: "#06b6d4",
        infoForeground: "#ffffff",
      },
      chart: {
        chart1: "#7c3aed",
        chart2: "#ec4899",
        chart3: "#06b6d4",
        chart4: "#f59e0b",
        chart5: "#10b981",
        chart6: "#f43f5e",
      },
      link: {
        default: "#7c3aed",
        hover: "#6d28d9",
        visited: "#4c1d95",
        active: "#8b5cf6",
      },
    },
    typography: {
      ...defaultTypographySettings,
      fonts: [
        {
          id: "primary",
          family: "Nunito",
          weights: [400, 600, 700, 800, 900],
          category: "sans-serif",
        },
        {
          id: "secondary",
          family: "Nunito",
          weights: [400, 600, 700],
          category: "sans-serif",
        },
        {
          id: "accent",
          family: "Fira Code",
          weights: [400, 500],
          category: "monospace",
        },
      ],
      headings: {
        ...defaultTypographySettings.headings,
        display: {
          fontSize: "7xl",
          fontWeight: "black",
          lineHeight: "none",
          letterSpacing: "tighter",
        },
        h1: {
          fontSize: "5xl",
          fontWeight: "extrabold",
          lineHeight: "tight",
          letterSpacing: "tight",
        },
      },
    },
    animations: {
      ...defaultAnimationSettings,
      defaultTiming: "bounce",
      presets: {
        ...defaultAnimationSettings.presets,
        fadeIn: { duration: "200", timing: "easeOut" },
        slideUp: { duration: "300", timing: "bounce", distance: "15" },
        scaleIn: { duration: "250", timing: "bounce", from: "0.9" },
        bounce: { duration: "600", timing: "bounce" },
      },
    },
    components: {
      ...defaultComponentSettings,
      dropdown: {
        ...defaultComponentSettings.dropdown,
        borderRadius: "xl",
        shadow: "lg",
      },
      modal: { ...defaultComponentSettings.modal, borderRadius: "2xl" },
      drawer: {
        ...defaultComponentSettings.drawer,
        borderRadius: "2xl",
        mobile: {
          fullScreen: false,
          swipeToClose: true,
          showHandle: true,
          position: "bottom",
        },
      },
      badge: { ...defaultComponentSettings.badge, borderRadius: "full" },
      avatar: {
        ...defaultComponentSettings.avatar,
        borderRadius: "full",
        borderWidth: "4",
      },
      tabs: { ...defaultComponentSettings.tabs, variant: "pills" },
    },
  },

  // Corporate Theme
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional, trustworthy, and enterprise-ready design",
    category: "corporate",
    icon: Building2,
    preview: {
      primaryColor: "#1e40af",
      secondaryColor: "#475569",
      accentColor: "#0891b2",
      fontHeading: "IBM Plex Sans",
      fontBody: "IBM Plex Sans",
    },
    colors: {
      ...defaultColorSettings,
      brand: {
        primary: "#1e40af",
        secondary: "#475569",
        accent: "#0891b2",
      },
      ui: {
        ...defaultColorSettings.ui,
        background: "#f8fafc",
        foreground: "#1e293b",
        card: "#ffffff",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        border: "#cbd5e1",
        ring: "#1e40af",
      },
      status: {
        success: "#059669",
        successForeground: "#ffffff",
        warning: "#d97706",
        warningForeground: "#ffffff",
        error: "#dc2626",
        errorForeground: "#ffffff",
        info: "#0284c7",
        infoForeground: "#ffffff",
      },
      link: {
        default: "#1e40af",
        hover: "#1e3a8a",
        visited: "#312e81",
        active: "#3b82f6",
      },
    },
    typography: {
      ...defaultTypographySettings,
      fonts: [
        {
          id: "primary",
          family: "IBM Plex Sans",
          weights: [400, 500, 600, 700],
          category: "sans-serif",
        },
        {
          id: "secondary",
          family: "IBM Plex Sans",
          weights: [400, 500, 600],
          category: "sans-serif",
        },
        {
          id: "accent",
          family: "IBM Plex Mono",
          weights: [400, 500],
          category: "monospace",
        },
      ],
      headings: {
        ...defaultTypographySettings.headings,
        display: {
          fontSize: "6xl",
          fontWeight: "bold",
          lineHeight: "tight",
          letterSpacing: "tight",
        },
        h1: {
          fontSize: "4xl",
          fontWeight: "semibold",
          lineHeight: "tight",
          letterSpacing: "tight",
        },
      },
    },
    animations: {
      ...defaultAnimationSettings,
      defaultTiming: "easeOut",
      presets: {
        ...defaultAnimationSettings.presets,
        fadeIn: { duration: "200", timing: "easeOut" },
        slideUp: { duration: "250", timing: "easeOut", distance: "8" },
        scaleIn: { duration: "200", timing: "easeOut", from: "0.98" },
      },
    },
    components: {
      ...defaultComponentSettings,
      dropdown: {
        ...defaultComponentSettings.dropdown,
        borderRadius: "md",
        shadow: "md",
      },
      modal: { ...defaultComponentSettings.modal, borderRadius: "lg" },
      drawer: { ...defaultComponentSettings.drawer, borderRadius: "none" },
      badge: {
        ...defaultComponentSettings.badge,
        borderRadius: "sm",
        fontWeight: "semibold",
      },
      tabs: { ...defaultComponentSettings.tabs, variant: "default" },
      nav: {
        ...defaultComponentSettings.nav,
        shadow: "md",
        backdropBlur: "lg",
      },
    },
  },

  // Minimal Theme
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Ultra-clean design with maximum whitespace and subtle details",
    category: "minimal",
    icon: Minimize2,
    preview: {
      primaryColor: "#18181b",
      secondaryColor: "#a1a1aa",
      accentColor: "#18181b",
      fontHeading: "DM Sans",
      fontBody: "DM Sans",
    },
    colors: {
      ...defaultColorSettings,
      brand: {
        primary: "#18181b",
        secondary: "#a1a1aa",
        accent: "#18181b",
      },
      ui: {
        ...defaultColorSettings.ui,
        background: "#ffffff",
        foreground: "#18181b",
        card: "#ffffff",
        muted: "#fafafa",
        mutedForeground: "#71717a",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#18181b",
      },
      status: {
        success: "#16a34a",
        successForeground: "#ffffff",
        warning: "#ca8a04",
        warningForeground: "#ffffff",
        error: "#dc2626",
        errorForeground: "#ffffff",
        info: "#2563eb",
        infoForeground: "#ffffff",
      },
      link: {
        default: "#18181b",
        hover: "#3f3f46",
        visited: "#52525b",
        active: "#27272a",
      },
    },
    typography: {
      ...defaultTypographySettings,
      fonts: [
        {
          id: "primary",
          family: "DM Sans",
          weights: [400, 500, 600, 700],
          category: "sans-serif",
        },
        {
          id: "secondary",
          family: "DM Sans",
          weights: [400, 500],
          category: "sans-serif",
        },
        {
          id: "accent",
          family: "DM Mono",
          weights: [400, 500],
          category: "monospace",
        },
      ],
      headings: {
        ...defaultTypographySettings.headings,
        display: {
          fontSize: "6xl",
          fontWeight: "medium",
          lineHeight: "tight",
          letterSpacing: "tighter",
        },
        h1: {
          fontSize: "4xl",
          fontWeight: "medium",
          lineHeight: "snug",
          letterSpacing: "tight",
        },
        h2: {
          fontSize: "3xl",
          fontWeight: "medium",
          lineHeight: "snug",
          letterSpacing: "tight",
        },
      },
    },
    animations: {
      ...defaultAnimationSettings,
      defaultTiming: "linear",
      defaultDuration: "100",
      presets: {
        ...defaultAnimationSettings.presets,
        fadeIn: { duration: "100", timing: "linear" },
        slideUp: { duration: "150", timing: "linear", distance: "4" },
        scaleIn: { duration: "100", timing: "linear", from: "0.99" },
      },
    },
    components: {
      ...defaultComponentSettings,
      dropdown: {
        ...defaultComponentSettings.dropdown,
        borderRadius: "sm",
        shadow: "sm",
      },
      modal: {
        ...defaultComponentSettings.modal,
        borderRadius: "lg",
        shadow: "lg",
      },
      drawer: {
        ...defaultComponentSettings.drawer,
        borderRadius: "none",
        shadow: "lg",
      },
      badge: {
        ...defaultComponentSettings.badge,
        borderRadius: "sm",
        fontWeight: "normal",
      },
      avatar: {
        ...defaultComponentSettings.avatar,
        borderRadius: "sm",
        borderWidth: "1",
      },
      tabs: {
        ...defaultComponentSettings.tabs,
        variant: "underline",
        listBorderRadius: "none",
      },
      tooltip: {
        ...defaultComponentSettings.tooltip,
        borderRadius: "sm",
        shadow: "sm",
      },
      nav: {
        ...defaultComponentSettings.nav,
        shadow: "none",
        backdropBlur: "none",
      },
    },
  },
];

// ============================================================================
// Theme Preview Card
// ============================================================================

interface ThemePreviewCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onApply: () => void;
  onPreview: () => void;
}

function ThemePreviewCard({
  preset,
  isActive,
  onApply,
  onPreview,
}: ThemePreviewCardProps) {
  const Icon = preset.icon;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all cursor-pointer group",
        isActive && "ring-2 ring-primary",
      )}
    >
      {/* Color Preview Bar */}
      <div className="h-2 flex">
        <div
          className="flex-1"
          style={{ backgroundColor: preset.preview.primaryColor }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: preset.preview.secondaryColor }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: preset.preview.accentColor }}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{preset.name}</CardTitle>
          </div>
          {isActive && (
            <Badge variant="default" className="gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {preset.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Typography Preview */}
        <div
          className="mb-4 p-3 rounded-md border"
          style={{ backgroundColor: preset.colors.ui.background }}
        >
          <h3
            className="text-lg mb-1"
            style={{
              fontFamily: `'${preset.preview.fontHeading}', sans-serif`,
              color: preset.colors.ui.foreground,
              fontWeight: 600,
            }}
          >
            Heading Text
          </h3>
          <p
            className="text-sm"
            style={{
              fontFamily: `'${preset.preview.fontBody}', sans-serif`,
              color: preset.colors.ui.mutedForeground,
            }}
          >
            Body text preview with the selected font.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={isActive}
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
          >
            {isActive ? "Applied" : "Apply Theme"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ThemePresets({
  onApplyTheme,
  currentThemeId,
  className,
}: ThemePresetsProps) {
  const [previewingId, setPreviewingId] = React.useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Themes" },
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Classic" },
    { id: "playful", label: "Playful" },
    { id: "corporate", label: "Corporate" },
    { id: "minimal", label: "Minimal" },
  ];

  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredPresets =
    activeCategory === "all"
      ? themePresets
      : themePresets.filter((p) => p.category === activeCategory);

  const handlePreview = (preset: ThemePreset) => {
    setPreviewingId(preset.id);
    // TODO: Apply temporary preview styles to document
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold mb-1">Theme Presets</h3>
        <p className="text-sm text-muted-foreground">
          Start with a pre-designed theme and customize it to match your brand.
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map((preset) => (
              <ThemePreviewCard
                key={preset.id}
                preset={preset}
                isActive={currentThemeId === preset.id}
                onApply={() => onApplyTheme(preset)}
                onPreview={() => handlePreview(preset)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPresets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No themes found in this category.
        </div>
      )}
    </div>
  );
}

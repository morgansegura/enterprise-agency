"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import {
  ChevronDown,
  Type,
  Heading1,
  AlignLeft,
  Eye,
  RefreshCw,
} from "lucide-react";
import { googleFonts, findFont } from "@/lib/fonts/google-fonts";

// ============================================================================
// Types
// ============================================================================

export interface FontDefinition {
  id: "primary" | "secondary" | "accent";
  family: string;
  weights: number[];
  category: "sans-serif" | "serif" | "monospace" | "display" | "handwriting";
}

export interface FontRoles {
  heading: "primary" | "secondary" | "accent" | "system";
  body: "primary" | "secondary" | "accent" | "system";
  button: "primary" | "secondary" | "accent" | "system";
  link: "primary" | "secondary" | "accent" | "system";
  caption: "primary" | "secondary" | "accent" | "system";
  navigation: "primary" | "secondary" | "accent" | "system";
}

export interface TextStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface HeadingStyles {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  display: TextStyle;
}

export interface BodyStyles {
  xs: TextStyle;
  sm: TextStyle;
  base: TextStyle;
  lg: TextStyle;
  xl: TextStyle;
}

export interface TypographySettingsData {
  fonts: FontDefinition[];
  roles: FontRoles;
  baseFontSize: string;
  headings: HeadingStyles;
  body: BodyStyles;
}

interface TypographySettingsPanelProps {
  typography: TypographySettingsData;
  onChange: (typography: TypographySettingsData) => void;
  className?: string;
}

// ============================================================================
// Defaults
// ============================================================================

export const defaultTypographySettings: TypographySettingsData = {
  fonts: [
    {
      id: "primary",
      family: "Inter",
      weights: [400, 500, 600, 700],
      category: "sans-serif",
    },
    {
      id: "secondary",
      family: "Merriweather",
      weights: [400, 700],
      category: "serif",
    },
    {
      id: "accent",
      family: "Space Grotesk",
      weights: [400, 500, 600, 700],
      category: "sans-serif",
    },
  ],
  roles: {
    heading: "primary",
    body: "primary",
    button: "primary",
    link: "primary",
    caption: "primary",
    navigation: "primary",
  },
  baseFontSize: "16",
  headings: {
    display: {
      fontSize: "6xl",
      fontWeight: "extrabold",
      lineHeight: "none",
      letterSpacing: "tighter",
    },
    h1: {
      fontSize: "5xl",
      fontWeight: "bold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h2: {
      fontSize: "4xl",
      fontWeight: "bold",
      lineHeight: "tight",
      letterSpacing: "tight",
    },
    h3: {
      fontSize: "3xl",
      fontWeight: "semibold",
      lineHeight: "snug",
      letterSpacing: "normal",
    },
    h4: {
      fontSize: "2xl",
      fontWeight: "semibold",
      lineHeight: "snug",
      letterSpacing: "normal",
    },
    h5: {
      fontSize: "xl",
      fontWeight: "semibold",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
    h6: {
      fontSize: "lg",
      fontWeight: "semibold",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
  body: {
    xs: {
      fontSize: "xs",
      fontWeight: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
    sm: {
      fontSize: "sm",
      fontWeight: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
    base: {
      fontSize: "base",
      fontWeight: "normal",
      lineHeight: "relaxed",
      letterSpacing: "normal",
    },
    lg: {
      fontSize: "lg",
      fontWeight: "normal",
      lineHeight: "relaxed",
      letterSpacing: "normal",
    },
    xl: {
      fontSize: "xl",
      fontWeight: "normal",
      lineHeight: "relaxed",
      letterSpacing: "normal",
    },
  },
};

// ============================================================================
// Options
// ============================================================================

const fontSizeOptions = [
  { value: "xs", label: "XS", px: "12px" },
  { value: "sm", label: "SM", px: "14px" },
  { value: "base", label: "Base", px: "16px" },
  { value: "lg", label: "LG", px: "18px" },
  { value: "xl", label: "XL", px: "20px" },
  { value: "2xl", label: "2XL", px: "24px" },
  { value: "3xl", label: "3XL", px: "30px" },
  { value: "4xl", label: "4XL", px: "36px" },
  { value: "5xl", label: "5XL", px: "48px" },
  { value: "6xl", label: "6XL", px: "60px" },
  { value: "7xl", label: "7XL", px: "72px" },
  { value: "8xl", label: "8XL", px: "96px" },
  { value: "9xl", label: "9XL", px: "128px" },
];

const fontWeightOptions = [
  { value: "thin", label: "Thin", numeric: "100" },
  { value: "extralight", label: "Extra Light", numeric: "200" },
  { value: "light", label: "Light", numeric: "300" },
  { value: "normal", label: "Normal", numeric: "400" },
  { value: "medium", label: "Medium", numeric: "500" },
  { value: "semibold", label: "Semibold", numeric: "600" },
  { value: "bold", label: "Bold", numeric: "700" },
  { value: "extrabold", label: "Extra Bold", numeric: "800" },
  { value: "black", label: "Black", numeric: "900" },
];

const lineHeightOptions = [
  { value: "none", label: "None", numeric: "1" },
  { value: "tight", label: "Tight", numeric: "1.25" },
  { value: "snug", label: "Snug", numeric: "1.375" },
  { value: "normal", label: "Normal", numeric: "1.5" },
  { value: "relaxed", label: "Relaxed", numeric: "1.625" },
  { value: "loose", label: "Loose", numeric: "2" },
];

const letterSpacingOptions = [
  { value: "tighter", label: "Tighter", numeric: "-0.05em" },
  { value: "tight", label: "Tight", numeric: "-0.025em" },
  { value: "normal", label: "Normal", numeric: "0" },
  { value: "wide", label: "Wide", numeric: "0.025em" },
  { value: "wider", label: "Wider", numeric: "0.05em" },
  { value: "widest", label: "Widest", numeric: "0.1em" },
];

const textTransformOptions = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

const fontRoleOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "system", label: "System" },
];

const fontSlotLabels = {
  primary: { name: "Primary Font", description: "Main heading font" },
  secondary: { name: "Secondary Font", description: "Body text font" },
  accent: { name: "Accent Font", description: "Buttons & highlights" },
};

// ============================================================================
// Font Picker Component
// ============================================================================

interface FontPickerProps {
  value: string;
  onChange: (family: string) => void;
  category?: string;
}

// Load Google Font dynamically for preview
function useGoogleFont(fontFamily: string) {
  React.useEffect(() => {
    if (!fontFamily || fontFamily === "system") return;

    const linkId = `google-font-${fontFamily.replace(/\s+/g, "-")}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);
}

function FontPicker({ value, onChange, category }: FontPickerProps) {
  // Load the currently selected font for preview
  useGoogleFont(value);

  const filteredFonts = React.useMemo(() => {
    if (!category) return googleFonts;
    return googleFonts.filter((f) => f.category === category);
  }, [category]);

  // Get font category for fallback
  const selectedFont = googleFonts.find((f) => f.family === value);
  const fallbackStack =
    selectedFont?.category === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : selectedFont?.category === "monospace"
        ? "'SF Mono', Monaco, monospace"
        : "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <span
            className="flex items-center gap-2"
            style={{ fontFamily: `'${value}', ${fallbackStack}` }}
          >
            {value}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] min-w-[240px]">
        {filteredFonts.slice(0, 100).map((font) => {
          const fontFallback =
            font.category === "serif"
              ? "Georgia, serif"
              : font.category === "monospace"
                ? "monospace"
                : "sans-serif";
          return (
            <SelectItem key={font.family} value={font.family}>
              <div className="flex items-center justify-between w-full gap-3">
                <span
                  className="flex-1 truncate"
                  style={{ fontFamily: `'${font.family}', ${fontFallback}` }}
                >
                  {font.family}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase shrink-0 w-16 text-right">
                  {font.category}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// ============================================================================
// Text Style Editor
// ============================================================================

interface TextStyleEditorProps {
  label: string;
  style: TextStyle;
  onChange: (style: TextStyle) => void;
  showTextTransform?: boolean;
}

function TextStyleEditor({
  label,
  style,
  onChange,
  showTextTransform = false,
}: TextStyleEditorProps) {
  const update = <K extends keyof TextStyle>(key: K, value: TextStyle[K]) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="space-y-3 p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {fontSizeOptions.find((o) => o.value === style.fontSize)?.px}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Select
            value={style.fontSize}
            onValueChange={(v) => update("fontSize", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} ({opt.px})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Weight</Label>
          <Select
            value={style.fontWeight}
            onValueChange={(v) => update("fontWeight", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontWeightOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Line Height</Label>
          <Select
            value={style.lineHeight}
            onValueChange={(v) => update("lineHeight", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineHeightOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Letter Spacing
          </Label>
          <Select
            value={style.letterSpacing}
            onValueChange={(v) => update("letterSpacing", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {letterSpacingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showTextTransform && (
          <div className="space-y-1 col-span-2">
            <Label className="text-xs text-muted-foreground">Transform</Label>
            <Select
              value={style.textTransform || "none"}
              onValueChange={(v) =>
                update("textTransform", v as TextStyle["textTransform"])
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textTransformOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
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
// Typography Preview
// ============================================================================

interface TypographyPreviewProps {
  typography: TypographySettingsData;
}

function TypographyPreview({ typography }: TypographyPreviewProps) {
  const getFontFamily = (role: keyof FontRoles) => {
    const fontId = typography.roles[role];
    if (fontId === "system") return "system-ui, sans-serif";
    const font = typography.fonts.find((f) => f.id === fontId);
    return font
      ? `"${font.family}", ${font.category}`
      : "system-ui, sans-serif";
  };

  const getStyleCSS = (style: TextStyle): React.CSSProperties => {
    const sizeMap: Record<string, string> = {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    };
    const weightMap: Record<string, string> = {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    };
    const lineHeightMap: Record<string, string> = {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    };
    const letterSpacingMap: Record<string, string> = {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    };

    return {
      fontSize: sizeMap[style.fontSize] || style.fontSize,
      fontWeight: weightMap[style.fontWeight] || style.fontWeight,
      lineHeight: lineHeightMap[style.lineHeight] || style.lineHeight,
      letterSpacing:
        letterSpacingMap[style.letterSpacing] || style.letterSpacing,
      textTransform: style.textTransform || "none",
    };
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      {/* Headings Preview */}
      <div className="space-y-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Headings
        </span>
        <div style={{ fontFamily: getFontFamily("heading") }}>
          <div style={getStyleCSS(typography.headings.h1)}>Heading 1</div>
          <div style={getStyleCSS(typography.headings.h2)}>Heading 2</div>
          <div style={getStyleCSS(typography.headings.h3)}>Heading 3</div>
          <div style={getStyleCSS(typography.headings.h4)}>Heading 4</div>
          <div style={getStyleCSS(typography.headings.h5)}>Heading 5</div>
          <div style={getStyleCSS(typography.headings.h6)}>Heading 6</div>
        </div>
      </div>

      {/* Body Preview */}
      <div className="space-y-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Body Text
        </span>
        <div style={{ fontFamily: getFontFamily("body") }}>
          <p style={getStyleCSS(typography.body.base)}>
            The quick brown fox jumps over the lazy dog. This is how your body
            text will appear on the website. Good typography creates hierarchy
            and improves readability.
          </p>
        </div>
      </div>

      {/* Buttons & Links Preview */}
      <div className="space-y-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Buttons & Links
        </span>
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            style={{ fontFamily: getFontFamily("button") }}
          >
            Button Text
          </button>
          <a
            href="#"
            className="text-primary underline"
            style={{ fontFamily: getFontFamily("link") }}
          >
            Link Text
          </a>
          <span
            className="text-sm text-muted-foreground"
            style={{ fontFamily: getFontFamily("caption") }}
          >
            Caption text
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TypographySettingsPanel({
  typography,
  onChange,
  className,
}: TypographySettingsPanelProps) {
  // Update handlers
  const updateFont = (index: number, updates: Partial<FontDefinition>) => {
    const newFonts = [...typography.fonts];
    newFonts[index] = { ...newFonts[index], ...updates };
    onChange({ ...typography, fonts: newFonts });
  };

  const updateRole = (
    role: keyof FontRoles,
    value: FontRoles[keyof FontRoles],
  ) => {
    onChange({
      ...typography,
      roles: { ...typography.roles, [role]: value },
    });
  };

  const updateHeading = (level: keyof HeadingStyles, style: TextStyle) => {
    onChange({
      ...typography,
      headings: { ...typography.headings, [level]: style },
    });
  };

  const updateBody = (size: keyof BodyStyles, style: TextStyle) => {
    onChange({
      ...typography,
      body: { ...typography.body, [size]: style },
    });
  };

  const resetToDefaults = () => {
    onChange(defaultTypographySettings);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="fonts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fonts" className="gap-1.5">
            <Type className="h-4 w-4" />
            Fonts
          </TabsTrigger>
          <TabsTrigger value="headings" className="gap-1.5">
            <Heading1 className="h-4 w-4" />
            Headings
          </TabsTrigger>
          <TabsTrigger value="body" className="gap-1.5">
            <AlignLeft className="h-4 w-4" />
            Body
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to defaults
            </Button>
          </div>

          {/* Font Definitions */}
          {typography.fonts.map((font, index) => (
            <CollapsibleSection
              key={font.id}
              title={fontSlotLabels[font.id].name}
              icon={<Type className="h-4 w-4 text-muted-foreground" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <FontPicker
                    value={font.family}
                    onChange={(family) => updateFont(index, { family })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={font.category}
                    onValueChange={(v) =>
                      updateFont(index, {
                        category: v as FontDefinition["category"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans-serif">Sans Serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="display">Display</SelectItem>
                      <SelectItem value="handwriting">Handwriting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {fontSlotLabels[font.id].description}
                </p>
              </div>
            </CollapsibleSection>
          ))}

          {/* Font Roles */}
          <CollapsibleSection
            title="Font Role Assignments"
            icon={<Type className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {(Object.keys(typography.roles) as Array<keyof FontRoles>).map(
                (role) => (
                  <div key={role} className="flex items-center gap-2">
                    <Label className="capitalize text-xs text-muted-foreground w-16 shrink-0">
                      {role}
                    </Label>
                    <Select
                      value={typography.roles[role]}
                      onValueChange={(v) =>
                        updateRole(role, v as FontRoles[keyof FontRoles])
                      }
                    >
                      <SelectTrigger className="h-8 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontRoleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ),
              )}
            </div>
          </CollapsibleSection>

          {/* Base Font Size */}
          <CollapsibleSection
            title="Base Font Size"
            icon={<Type className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Root Font Size</Label>
                <span className="text-sm font-mono">
                  {typography.baseFontSize}px
                </span>
              </div>
              <Slider
                value={[parseInt(typography.baseFontSize)]}
                onValueChange={([v]) =>
                  onChange({ ...typography, baseFontSize: String(v) })
                }
                min={12}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                This affects all rem-based font sizes throughout the site.
              </p>
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Headings Tab */}
        <TabsContent value="headings" className="space-y-4 mt-6">
          {(["display", "h1", "h2", "h3", "h4", "h5", "h6"] as const).map(
            (level) => (
              <TextStyleEditor
                key={level}
                label={level === "display" ? "Display" : level.toUpperCase()}
                style={typography.headings[level]}
                onChange={(style) => updateHeading(level, style)}
                showTextTransform={level === "display"}
              />
            ),
          )}
        </TabsContent>

        {/* Body Tab */}
        <TabsContent value="body" className="space-y-4 mt-6">
          {(["xl", "lg", "base", "sm", "xs"] as const).map((size) => (
            <TextStyleEditor
              key={size}
              label={`Body ${size.toUpperCase()}`}
              style={typography.body[size]}
              onChange={(style) => updateBody(size, style)}
            />
          ))}
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <TypographyPreview typography={typography} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

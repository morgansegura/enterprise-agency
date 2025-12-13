"use client";

import * as React from "react";
import {
  SettingsDrawer,
  SettingsDrawerSidebar,
  SettingsDrawerNav,
  SettingsDrawerContent,
  SettingsDrawerActions,
  SettingsDrawerSaveButton,
  SettingsSection,
  SettingsGridBlock,
  SettingsForm,
  SettingsField,
  type SettingsNavItem,
} from "@/components/ui/settings-drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Palette,
  Type,
  Globe,
  RectangleHorizontal,
  FormInput,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useTenantTokens,
  useUpdateTenantTokens,
} from "@/lib/hooks/use-tenant-tokens";
import { toast } from "sonner";
import {
  spacingSelectOptions,
  fontSizeSelectOptions,
  fontWeightSelectOptions,
  lineHeightSelectOptions,
  letterSpacingSelectOptions,
  borderRadiusSelectOptions,
  borderWidthSelectOptions,
  shadowSelectOptions,
  transitionDurationSelectOptions,
  textTransformSelectOptions,
  getSpacingValue,
  getFontSizeValue,
  getFontWeightValue,
  getLineHeightValue,
  getLetterSpacingValue,
  getBorderRadiusValue,
  getBorderWidthValue,
  getShadowValue,
} from "@/lib/tokens/design-system";

type SettingsTab = "colors" | "typography" | "buttons" | "inputs" | "cards";

const navItems: SettingsNavItem<SettingsTab>[] = [
  { id: "colors", label: "Colors", icon: Palette, description: "Brand colors" },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    description: "Fonts & text",
  },
  {
    id: "buttons",
    label: "Buttons",
    icon: RectangleHorizontal,
    description: "Button styles",
  },
  {
    id: "inputs",
    label: "Inputs",
    icon: FormInput,
    description: "Form inputs",
  },
  {
    id: "cards",
    label: "Cards",
    icon: CreditCard,
    description: "Card components",
  },
];

interface GlobalSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
}

// ============================================================================
// Types
// ============================================================================

interface SemanticColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
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
  destructive: string;
}

interface TypographySettings {
  fontFamily: { base: string; heading: string };
  fontSize: { base: string; heading: string };
  borderRadius: string;
}

interface ButtonSizeSettings {
  // Spacing
  paddingX: string;
  paddingY: string;
  gap: string;
  minHeight: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textTransform: string;
  // Shape
  borderRadius: string;
  // Effects
  transitionDuration: string;
}

interface ButtonSettings {
  // Size variants - each size is fully independent
  sizes: {
    xs: ButtonSizeSettings;
    sm: ButtonSizeSettings;
    md: ButtonSizeSettings;
    lg: ButtonSizeSettings;
    xl: ButtonSizeSettings;
  };
}

interface InputSettings {
  // Shape
  borderRadius: string;
  borderWidth: string; // 0, DEFAULT, 2, 4, 8
  // Spacing
  paddingX: string;
  paddingY: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  // Effects
  transitionDuration: string;
}

interface CardSettings {
  // Container Shape
  borderRadius: string;
  borderWidth: string;
  shadow: string; // none, sm, DEFAULT, md, lg, xl, 2xl, inner
  // Section Spacing (all Tailwind spacing keys)
  headerPaddingX: string;
  headerPaddingY: string;
  contentPaddingX: string;
  contentPaddingY: string;
  footerPaddingX: string;
  footerPaddingY: string;
  // Section borders
  headerBorder: boolean;
  footerBorder: boolean;
  // Title Typography
  titleFontSize: string;
  titleFontWeight: string;
  titleLineHeight: string;
  titleLetterSpacing: string;
  // Description Typography
  descriptionFontSize: string;
  descriptionFontWeight: string;
  descriptionLineHeight: string;
  // Hover Effects
  hoverShadow: string;
  transitionDuration: string;
}

interface LocalTokens {
  colors: SemanticColors;
  typography: TypographySettings;
  buttons: ButtonSettings;
  inputs: InputSettings;
  cards: CardSettings;
}

// ============================================================================
// Default values
// ============================================================================

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

const defaultTypography: TypographySettings = {
  fontFamily: { base: "Open_Sans", heading: "Roboto_Slab" },
  fontSize: { base: "1rem", heading: "2rem" },
  borderRadius: "0.5rem",
};

const defaultButtons: ButtonSettings = {
  sizes: {
    xs: {
      paddingX: "2",
      paddingY: "1",
      gap: "1",
      minHeight: "6",
      fontSize: "xs",
      fontWeight: "medium",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      borderRadius: "md",
      transitionDuration: "150",
    },
    sm: {
      paddingX: "3",
      paddingY: "1.5",
      gap: "1.5",
      minHeight: "8",
      fontSize: "sm",
      fontWeight: "medium",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      borderRadius: "md",
      transitionDuration: "150",
    },
    md: {
      paddingX: "4",
      paddingY: "2",
      gap: "2",
      minHeight: "10",
      fontSize: "sm",
      fontWeight: "medium",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      borderRadius: "md",
      transitionDuration: "150",
    },
    lg: {
      paddingX: "6",
      paddingY: "2.5",
      gap: "2",
      minHeight: "12",
      fontSize: "base",
      fontWeight: "medium",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      borderRadius: "md",
      transitionDuration: "150",
    },
    xl: {
      paddingX: "8",
      paddingY: "3",
      gap: "3",
      minHeight: "14",
      fontSize: "lg",
      fontWeight: "medium",
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      borderRadius: "lg",
      transitionDuration: "150",
    },
  },
};

const defaultInputs: InputSettings = {
  // Shape
  borderRadius: "md",
  borderWidth: "DEFAULT",
  // Spacing
  paddingX: "3",
  paddingY: "2",
  // Typography
  fontSize: "sm",
  fontWeight: "normal",
  // Effects
  transitionDuration: "150",
};

const defaultCards: CardSettings = {
  // Container Shape
  borderRadius: "lg",
  borderWidth: "DEFAULT",
  shadow: "sm",
  // Section Spacing
  headerPaddingX: "6",
  headerPaddingY: "4",
  contentPaddingX: "6",
  contentPaddingY: "4",
  footerPaddingX: "6",
  footerPaddingY: "4",
  // Section borders
  headerBorder: true,
  footerBorder: true,
  // Title Typography
  titleFontSize: "lg",
  titleFontWeight: "semibold",
  titleLineHeight: "tight",
  titleLetterSpacing: "tight",
  // Description Typography
  descriptionFontSize: "sm",
  descriptionFontWeight: "normal",
  descriptionLineHeight: "normal",
  // Hover Effects
  hoverShadow: "md",
  transitionDuration: "200",
};

const defaultTokens: LocalTokens = {
  colors: defaultColors,
  typography: defaultTypography,
  buttons: defaultButtons,
  inputs: defaultInputs,
  cards: defaultCards,
};

// ============================================================================
// Main Component
// ============================================================================

export function GlobalSettingsDrawer({
  open,
  onOpenChange,
  tenantId,
}: GlobalSettingsDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("colors");

  const { data: tokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  const [localTokens, setLocalTokens] =
    React.useState<LocalTokens>(defaultTokens);
  const [originalTokens, setOriginalTokens] =
    React.useState<LocalTokens>(defaultTokens);

  // Sync local state with fetched tokens
  React.useEffect(() => {
    if (tokens) {
      const semanticTokens = tokens as { semantic?: Partial<SemanticColors> };
      const initial: LocalTokens = {
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
            base:
              tokens.typography?.fontFamily?.base ||
              defaultTypography.fontFamily.base,
            heading:
              tokens.typography?.fontFamily?.heading ||
              defaultTypography.fontFamily.heading,
          },
          fontSize: {
            base:
              tokens.typography?.fontSize?.base ||
              defaultTypography.fontSize.base,
            heading:
              tokens.typography?.fontSize?.heading ||
              defaultTypography.fontSize.heading,
          },
          borderRadius:
            (tokens.borderRadius as { base?: string })?.base ||
            defaultTypography.borderRadius,
        },
        buttons: {
          sizes: {
            xs: {
              ...defaultButtons.sizes.xs,
              ...tokens.components?.buttons?.sizes?.xs,
            },
            sm: {
              ...defaultButtons.sizes.sm,
              ...tokens.components?.buttons?.sizes?.sm,
            },
            md: {
              ...defaultButtons.sizes.md,
              ...tokens.components?.buttons?.sizes?.md,
            },
            lg: {
              ...defaultButtons.sizes.lg,
              ...tokens.components?.buttons?.sizes?.lg,
            },
            xl: {
              ...defaultButtons.sizes.xl,
              ...tokens.components?.buttons?.sizes?.xl,
            },
          },
        },
        inputs: {
          borderRadius:
            tokens.components?.inputs?.borderRadius ||
            defaultInputs.borderRadius,
          borderWidth:
            tokens.components?.inputs?.borderWidth || defaultInputs.borderWidth,
          paddingX:
            tokens.components?.inputs?.paddingX || defaultInputs.paddingX,
          paddingY:
            tokens.components?.inputs?.paddingY || defaultInputs.paddingY,
          fontSize:
            tokens.components?.inputs?.fontSize || defaultInputs.fontSize,
          fontWeight:
            tokens.components?.inputs?.fontWeight || defaultInputs.fontWeight,
          transitionDuration:
            tokens.components?.inputs?.transitionDuration ||
            defaultInputs.transitionDuration,
        },
        cards: {
          borderRadius:
            tokens.components?.cards?.borderRadius || defaultCards.borderRadius,
          borderWidth:
            tokens.components?.cards?.borderWidth || defaultCards.borderWidth,
          shadow: tokens.components?.cards?.shadow || defaultCards.shadow,
          headerPaddingX:
            tokens.components?.cards?.headerPaddingX ||
            defaultCards.headerPaddingX,
          headerPaddingY:
            tokens.components?.cards?.headerPaddingY ||
            defaultCards.headerPaddingY,
          contentPaddingX:
            tokens.components?.cards?.contentPaddingX ||
            defaultCards.contentPaddingX,
          contentPaddingY:
            tokens.components?.cards?.contentPaddingY ||
            defaultCards.contentPaddingY,
          footerPaddingX:
            tokens.components?.cards?.footerPaddingX ||
            defaultCards.footerPaddingX,
          footerPaddingY:
            tokens.components?.cards?.footerPaddingY ||
            defaultCards.footerPaddingY,
          headerBorder:
            tokens.components?.cards?.headerBorder ?? defaultCards.headerBorder,
          footerBorder:
            tokens.components?.cards?.footerBorder ?? defaultCards.footerBorder,
          titleFontSize:
            tokens.components?.cards?.titleFontSize ||
            defaultCards.titleFontSize,
          titleFontWeight:
            tokens.components?.cards?.titleFontWeight ||
            defaultCards.titleFontWeight,
          titleLineHeight:
            tokens.components?.cards?.titleLineHeight ||
            defaultCards.titleLineHeight,
          titleLetterSpacing:
            tokens.components?.cards?.titleLetterSpacing ||
            defaultCards.titleLetterSpacing,
          descriptionFontSize:
            tokens.components?.cards?.descriptionFontSize ||
            defaultCards.descriptionFontSize,
          descriptionFontWeight:
            tokens.components?.cards?.descriptionFontWeight ||
            defaultCards.descriptionFontWeight,
          descriptionLineHeight:
            tokens.components?.cards?.descriptionLineHeight ||
            defaultCards.descriptionLineHeight,
          hoverShadow:
            tokens.components?.cards?.hoverShadow || defaultCards.hoverShadow,
          transitionDuration:
            tokens.components?.cards?.transitionDuration ||
            defaultCards.transitionDuration,
        },
      };
      setLocalTokens(initial);
      setOriginalTokens(initial);
    }
  }, [tokens]);

  const hasChanges = React.useMemo(() => {
    return JSON.stringify(localTokens) !== JSON.stringify(originalTokens);
  }, [localTokens, originalTokens]);

  // Update handlers
  const updateColors = (key: keyof SemanticColors, value: string) => {
    setLocalTokens((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateTypography = <K extends keyof TypographySettings>(
    key: K,
    value: TypographySettings[K],
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: value },
    }));
  };

  const updateButtons = <K extends keyof ButtonSettings>(
    key: K,
    value: ButtonSettings[K],
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      buttons: { ...prev.buttons, [key]: value },
    }));
  };

  const updateInputs = <K extends keyof InputSettings>(
    key: K,
    value: InputSettings[K],
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [key]: value },
    }));
  };

  const updateCards = <K extends keyof CardSettings>(
    key: K,
    value: CardSettings[K],
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      cards: { ...prev.cards, [key]: value },
    }));
  };

  const handleSave = () => {
    const tokensToSave = {
      semantic: localTokens.colors,
      colors: {
        primary: generateColorScale(localTokens.colors.primary),
        secondary: generateColorScale(localTokens.colors.secondary),
        accent: generateColorScale(localTokens.colors.accent),
      },
      typography: {
        fontFamily: localTokens.typography.fontFamily,
        fontSize: localTokens.typography.fontSize,
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
      components: {
        buttons: localTokens.buttons,
        inputs: localTokens.inputs,
        cards: localTokens.cards,
      },
    };

    updateTokens.mutate(
      { tenantId, tokens: tokensToSave as Record<string, unknown> },
      {
        onSuccess: () => {
          toast.success("Settings saved!");
          applyTokensToDOM(tokensToSave);
          setOriginalTokens(localTokens);
        },
        onError: () => {
          toast.error("Failed to save settings");
        },
      },
    );
  };

  return (
    <SettingsDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Global Settings"
    >
      <SettingsDrawerSidebar
        title="Global Settings"
        titleIcon={<Globe className="size-4" />}
      >
        <SettingsDrawerNav<SettingsTab>
          items={navItems}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
      </SettingsDrawerSidebar>

      <SettingsDrawerContent isLoading={isLoading}>
        <SettingsDrawerActions>
          <SettingsDrawerSaveButton
            onClick={handleSave}
            isPending={updateTokens.isPending}
            hasChanges={hasChanges}
          />
        </SettingsDrawerActions>

        {activeTab === "colors" && (
          <ColorSettings colors={localTokens.colors} onChange={updateColors} />
        )}
        {activeTab === "typography" && (
          <TypographySettingsPanel
            settings={localTokens.typography}
            onChange={updateTypography}
          />
        )}
        {activeTab === "buttons" && (
          <ButtonSettingsPanel
            settings={localTokens.buttons}
            onChange={updateButtons}
            colors={localTokens.colors}
          />
        )}
        {activeTab === "inputs" && (
          <InputSettingsPanel
            settings={localTokens.inputs}
            onChange={updateInputs}
            colors={localTokens.colors}
          />
        )}
        {activeTab === "cards" && (
          <CardSettingsPanel
            settings={localTokens.cards}
            onChange={updateCards}
            colors={localTokens.colors}
          />
        )}
      </SettingsDrawerContent>
    </SettingsDrawer>
  );
}

// ============================================================================
// Color utilities
// ============================================================================

function generateColorScale(baseColor: string): Record<string, string> {
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

function applyTokensToDOM(tokens: Record<string, unknown>) {
  const root = document.documentElement;

  if (tokens.semantic) {
    const semantic = tokens.semantic as Record<string, string>;
    Object.entries(semantic).forEach(([key, value]) => {
      const cssVar = semanticToCssVar[key];
      if (cssVar) root.style.setProperty(cssVar, value);
    });
  }

  if (tokens.colors) {
    const colors = tokens.colors as Record<string, Record<string, string>>;
    Object.entries(colors).forEach(([colorName, scale]) => {
      Object.entries(scale).forEach(([shade, value]) => {
        root.style.setProperty(`--color-${colorName}-${shade}`, value);
      });
    });
  }

  if (tokens.borderRadius) {
    const radius = tokens.borderRadius as Record<string, string>;
    Object.entries(radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
  }

  // Apply component-specific tokens
  if (tokens.components) {
    const components = tokens.components as Record<
      string,
      Record<string, string>
    >;
    Object.entries(components).forEach(([component, settings]) => {
      Object.entries(settings).forEach(([key, value]) => {
        root.style.setProperty(`--${component}-${key}`, String(value));
      });
    });
  }
}

// ============================================================================
// Tailwind color palette
// ============================================================================

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

// ============================================================================
// ColorPicker component
// ============================================================================

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

// ============================================================================
// ColorSettings panel
// ============================================================================

type SemanticColorKey = keyof SemanticColors;

interface ColorSettingsProps {
  colors: SemanticColors;
  onChange: (key: SemanticColorKey, value: string) => void;
}

function ColorSettings({ colors, onChange }: ColorSettingsProps) {
  return (
    <SettingsSection
      title="Brand Colors"
      description="Configure all semantic color tokens for this website."
    >
      <SettingsGridBlock title="Brand">
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
      </SettingsGridBlock>

      <SettingsGridBlock title="Backgrounds">
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
      </SettingsGridBlock>

      <SettingsGridBlock title="UI Elements">
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
      </SettingsGridBlock>

      <SettingsGridBlock title="Status">
        <ColorPicker
          label="Destructive"
          value={colors.destructive}
          onChange={(v) => onChange("destructive", v)}
        />
      </SettingsGridBlock>
    </SettingsSection>
  );
}

// ============================================================================
// TypographySettings panel
// ============================================================================

const googleFonts = [
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

const fontSizeOptions = [
  { value: "0.75rem", label: "12px (xs)" },
  { value: "0.875rem", label: "14px (sm)" },
  { value: "1rem", label: "16px (base)" },
  { value: "1.125rem", label: "18px (lg)" },
  { value: "1.25rem", label: "20px (xl)" },
];

const headingSizeOptions = [
  { value: "1.5rem", label: "24px" },
  { value: "1.875rem", label: "30px" },
  { value: "2rem", label: "32px" },
  { value: "2.25rem", label: "36px" },
  { value: "3rem", label: "48px" },
];

const radiusOptions = [
  { value: "0", label: "None (Square)" },
  { value: "0.125rem", label: "Extra Small" },
  { value: "0.25rem", label: "Small" },
  { value: "0.375rem", label: "Medium" },
  { value: "0.5rem", label: "Large" },
  { value: "0.75rem", label: "Extra Large" },
  { value: "1rem", label: "2XL" },
  { value: "9999px", label: "Full (Pill)" },
];

interface TypographySettingsPanelProps {
  settings: TypographySettings;
  onChange: <K extends keyof TypographySettings>(
    key: K,
    value: TypographySettings[K],
  ) => void;
}

function TypographySettingsPanel({
  settings,
  onChange,
}: TypographySettingsPanelProps) {
  return (
    <SettingsSection
      title="Typography & Style"
      description="Configure fonts, sizes, and border radius for your website."
    >
      <SettingsGridBlock title="Fonts">
        <SettingsField>
          <Label>Base Font (Body)</Label>
          <Select
            value={settings.fontFamily.base}
            onValueChange={(v) =>
              onChange("fontFamily", { ...settings.fontFamily, base: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Sans-serif
              </div>
              {googleFonts
                .filter((f) => f.category === "sans")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
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
        </SettingsField>

        <SettingsField>
          <Label>Heading Font</Label>
          <Select
            value={settings.fontFamily.heading}
            onValueChange={(v) =>
              onChange("fontFamily", { ...settings.fontFamily, heading: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Sans-serif
              </div>
              {googleFonts
                .filter((f) => f.category === "sans")
                .map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
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
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Font Sizes">
        <SettingsField>
          <Label>Base Font Size</Label>
          <Select
            value={settings.fontSize.base}
            onValueChange={(v) =>
              onChange("fontSize", { ...settings.fontSize, base: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <Label>Heading Base Size</Label>
          <Select
            value={settings.fontSize.heading}
            onValueChange={(v) =>
              onChange("fontSize", { ...settings.fontSize, heading: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {headingSizeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Global Border Radius">
        <SettingsField>
          <Label>Default Border Radius</Label>
          <Select
            value={settings.borderRadius}
            onValueChange={(v) => onChange("borderRadius", v)}
          >
            <SelectTrigger>
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
        </SettingsField>
      </SettingsGridBlock>
    </SettingsSection>
  );
}

// ============================================================================
// ButtonSettings panel
// ============================================================================

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost"
  | "link";

interface ButtonSettingsPanelProps {
  settings: ButtonSettings;
  onChange: <K extends keyof ButtonSettings>(
    key: K,
    value: ButtonSettings[K],
  ) => void;
  colors: SemanticColors;
}

function ButtonSettingsPanel({
  settings,
  onChange,
  colors,
}: ButtonSettingsPanelProps) {
  const [activeSize, setActiveSize] = React.useState<ButtonSize>("md");

  // Ensure sizes is always defined with fallback to defaults
  const sizes = settings.sizes ?? defaultButtons.sizes;

  // Helper to update a specific size variant
  const updateSizeSettings = (
    size: ButtonSize,
    field: keyof ButtonSizeSettings,
    value: string,
  ) => {
    onChange("sizes", {
      ...sizes,
      [size]: {
        ...sizes[size],
        [field]: value,
      },
    });
  };

  // Get current size settings
  const currentSize = sizes[activeSize];

  // Get style for button preview
  const getButtonStyle = (variant: ButtonVariant): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      borderRadius: getBorderRadiusValue(currentSize.borderRadius),
      fontWeight: getFontWeightValue(currentSize.fontWeight),
      fontSize: getFontSizeValue(currentSize.fontSize),
      paddingLeft: getSpacingValue(currentSize.paddingX),
      paddingRight: getSpacingValue(currentSize.paddingX),
      paddingTop: getSpacingValue(currentSize.paddingY),
      paddingBottom: getSpacingValue(currentSize.paddingY),
      gap: getSpacingValue(currentSize.gap),
      minHeight: getSpacingValue(currentSize.minHeight),
      textTransform:
        currentSize.textTransform as React.CSSProperties["textTransform"],
      letterSpacing: getLetterSpacingValue(currentSize.letterSpacing),
      lineHeight: getLineHeightValue(currentSize.lineHeight),
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          color: colors.primaryForeground,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          color: colors.secondaryForeground,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          border: `1px solid ${colors.border}`,
          color: colors.foreground,
        };
      case "destructive":
        return {
          ...baseStyle,
          backgroundColor: colors.destructive,
          color: "#ffffff",
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: colors.foreground,
        };
      case "link":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: colors.primary,
          textDecoration: "underline",
          padding: 0,
          minHeight: "auto",
        };
    }
  };

  // Icon style for icon button preview
  const getIconButtonStyle = (): React.CSSProperties => ({
    borderRadius: getBorderRadiusValue(currentSize.borderRadius),
    fontWeight: getFontWeightValue(currentSize.fontWeight),
    fontSize: getFontSizeValue(currentSize.fontSize),
    width: getSpacingValue(currentSize.minHeight),
    height: getSpacingValue(currentSize.minHeight),
    padding: 0,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
    color: colors.foreground,
  });

  // Render a select with options
  const renderSelect = (
    label: string,
    value: string,
    onValueChange: (v: string) => void,
    options: Array<{ value: string; label: string; description: string }>,
  ) => (
    <SettingsField>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span className="flex justify-between w-full">
                <span>{opt.label}</span>
                <span className="text-muted-foreground ml-2">
                  {opt.description}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingsField>
  );

  const sizeLabels: Record<ButtonSize, string> = {
    xs: "Extra Small",
    sm: "Small",
    md: "Medium",
    lg: "Large",
    xl: "Extra Large",
  };

  return (
    <SettingsSection
      title="Button Styling"
      description="Configure each button size independently with full control over spacing, typography, and effects."
    >
      {/* Size Variant Selector */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 block">
          Select Size to Configure
        </Label>
        <div className="flex gap-1">
          {(["xs", "sm", "md", "lg", "xl"] as ButtonSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setActiveSize(size)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                activeSize === size
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview for Active Size */}
      <div
        className="mb-6 p-4 rounded-lg border"
        style={{ backgroundColor: colors.background }}
      >
        <Label
          className="text-xs mb-3 block"
          style={{ color: colors.mutedForeground }}
        >
          {sizeLabels[activeSize]} ({activeSize.toUpperCase()}) Preview
        </Label>
        <div className="flex gap-2 flex-wrap items-center">
          <button style={getButtonStyle("primary")}>Primary</button>
          <button style={getButtonStyle("secondary")}>Secondary</button>
          <button style={getButtonStyle("outline")}>Outline</button>
          <button style={getButtonStyle("destructive")}>Destructive</button>
          <button style={getButtonStyle("ghost")}>Ghost</button>
          <button style={getButtonStyle("link")}>Link</button>
          <button style={getIconButtonStyle()} title="Icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Spacing Settings */}
      <SettingsGridBlock title="Spacing">
        {renderSelect(
          "Padding X",
          currentSize.paddingX,
          (v) => updateSizeSettings(activeSize, "paddingX", v),
          spacingSelectOptions.slice(0, 14),
        )}
        {renderSelect(
          "Padding Y",
          currentSize.paddingY,
          (v) => updateSizeSettings(activeSize, "paddingY", v),
          spacingSelectOptions.slice(0, 10),
        )}
        {renderSelect(
          "Icon Gap",
          currentSize.gap,
          (v) => updateSizeSettings(activeSize, "gap", v),
          spacingSelectOptions.slice(0, 8),
        )}
        {renderSelect(
          "Min Height",
          currentSize.minHeight,
          (v) => updateSizeSettings(activeSize, "minHeight", v),
          spacingSelectOptions.slice(4, 16),
        )}
      </SettingsGridBlock>

      {/* Typography Settings */}
      <SettingsGridBlock title="Typography">
        {renderSelect(
          "Font Size",
          currentSize.fontSize,
          (v) => updateSizeSettings(activeSize, "fontSize", v),
          fontSizeSelectOptions.slice(0, 7),
        )}
        {renderSelect(
          "Font Weight",
          currentSize.fontWeight,
          (v) => updateSizeSettings(activeSize, "fontWeight", v),
          fontWeightSelectOptions,
        )}
        {renderSelect(
          "Letter Spacing",
          currentSize.letterSpacing,
          (v) => updateSizeSettings(activeSize, "letterSpacing", v),
          letterSpacingSelectOptions,
        )}
        {renderSelect(
          "Line Height",
          currentSize.lineHeight,
          (v) => updateSizeSettings(activeSize, "lineHeight", v),
          lineHeightSelectOptions,
        )}
        {renderSelect(
          "Text Transform",
          currentSize.textTransform,
          (v) => updateSizeSettings(activeSize, "textTransform", v),
          textTransformSelectOptions,
        )}
      </SettingsGridBlock>

      {/* Shape & Effects */}
      <SettingsGridBlock title="Shape & Effects">
        {renderSelect(
          "Border Radius",
          currentSize.borderRadius,
          (v) => updateSizeSettings(activeSize, "borderRadius", v),
          borderRadiusSelectOptions,
        )}
        {renderSelect(
          "Transition Duration",
          currentSize.transitionDuration,
          (v) => updateSizeSettings(activeSize, "transitionDuration", v),
          transitionDurationSelectOptions,
        )}
      </SettingsGridBlock>
    </SettingsSection>
  );
}

// ============================================================================
// InputSettings panel
// ============================================================================

interface InputSettingsPanelProps {
  settings: InputSettings;
  onChange: <K extends keyof InputSettings>(
    key: K,
    value: InputSettings[K],
  ) => void;
  colors: SemanticColors;
}

function InputSettingsPanel({
  settings,
  onChange,
  colors,
}: InputSettingsPanelProps) {
  const previewStyle: React.CSSProperties = {
    borderRadius: getBorderRadiusValue(settings.borderRadius),
    borderWidth: getBorderWidthValue(settings.borderWidth),
    borderStyle: "solid",
    borderColor: colors.input,
    fontSize: getFontSizeValue(settings.fontSize),
    fontWeight: getFontWeightValue(settings.fontWeight),
    paddingLeft: getSpacingValue(settings.paddingX),
    paddingRight: getSpacingValue(settings.paddingX),
    paddingTop: getSpacingValue(settings.paddingY),
    paddingBottom: getSpacingValue(settings.paddingY),
    backgroundColor: colors.background,
    color: colors.foreground,
    width: "100%",
    maxWidth: "300px",
    outline: "none",
  };

  return (
    <SettingsSection
      title="Input Styling"
      description="Customize the appearance of form inputs using Tailwind tokens."
    >
      {/* Preview */}
      <div
        className="mb-8 p-6 rounded-lg border"
        style={{ backgroundColor: colors.muted }}
      >
        <Label
          className="text-xs mb-3 block"
          style={{ color: colors.mutedForeground }}
        >
          Live Preview
        </Label>
        <input style={previewStyle} type="text" placeholder="Enter text..." />
      </div>

      <SettingsGridBlock title="Shape">
        <SettingsField>
          <Label>Border Radius</Label>
          <Select
            value={settings.borderRadius}
            onValueChange={(v) => onChange("borderRadius", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderRadiusSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <Label>Border Width</Label>
          <Select
            value={settings.borderWidth}
            onValueChange={(v) => onChange("borderWidth", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderWidthSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Spacing">
        <SettingsField>
          <Label>Padding X</Label>
          <Select
            value={settings.paddingX}
            onValueChange={(v) => onChange("paddingX", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spacingSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <Label>Padding Y</Label>
          <Select
            value={settings.paddingY}
            onValueChange={(v) => onChange("paddingY", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spacingSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Typography">
        <SettingsField>
          <Label>Font Size</Label>
          <Select
            value={settings.fontSize}
            onValueChange={(v) => onChange("fontSize", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizeSelectOptions.slice(0, 7).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <SettingsField>
          <Label>Font Weight</Label>
          <Select
            value={settings.fontWeight}
            onValueChange={(v) => onChange("fontWeight", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontWeightSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Effects">
        <SettingsField>
          <Label>Transition Duration</Label>
          <Select
            value={settings.transitionDuration}
            onValueChange={(v) => onChange("transitionDuration", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transitionDurationSelectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex justify-between w-full">
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground ml-2">
                      {opt.description}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsGridBlock>
    </SettingsSection>
  );
}

// ============================================================================
// CardSettings panel
// ============================================================================

interface CardSettingsPanelProps {
  settings: CardSettings;
  onChange: <K extends keyof CardSettings>(
    key: K,
    value: CardSettings[K],
  ) => void;
  colors: SemanticColors;
}

function CardSettingsPanel({
  settings,
  onChange,
  colors,
}: CardSettingsPanelProps) {
  // Convert Tailwind tokens to CSS values for preview
  const cardStyle: React.CSSProperties = {
    borderRadius: getBorderRadiusValue(settings.borderRadius),
    borderWidth: getBorderWidthValue(settings.borderWidth),
    borderStyle: "solid",
    borderColor: colors.border,
    boxShadow: getShadowValue(settings.shadow),
    backgroundColor: colors.card,
    color: colors.cardForeground,
    maxWidth: "320px",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    paddingLeft: getSpacingValue(settings.headerPaddingX),
    paddingRight: getSpacingValue(settings.headerPaddingX),
    paddingTop: getSpacingValue(settings.headerPaddingY),
    paddingBottom: getSpacingValue(settings.headerPaddingY),
    borderBottom: settings.headerBorder ? `1px solid ${colors.border}` : "none",
  };

  const contentStyle: React.CSSProperties = {
    paddingLeft: getSpacingValue(settings.contentPaddingX),
    paddingRight: getSpacingValue(settings.contentPaddingX),
    paddingTop: getSpacingValue(settings.contentPaddingY),
    paddingBottom: getSpacingValue(settings.contentPaddingY),
  };

  const footerStyle: React.CSSProperties = {
    paddingLeft: getSpacingValue(settings.footerPaddingX),
    paddingRight: getSpacingValue(settings.footerPaddingX),
    paddingTop: getSpacingValue(settings.footerPaddingY),
    paddingBottom: getSpacingValue(settings.footerPaddingY),
    borderTop: settings.footerBorder ? `1px solid ${colors.border}` : "none",
    backgroundColor: colors.muted,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: getFontSizeValue(settings.titleFontSize),
    fontWeight: getFontWeightValue(settings.titleFontWeight),
    lineHeight: getLineHeightValue(settings.titleLineHeight),
    letterSpacing: getLetterSpacingValue(settings.titleLetterSpacing),
    color: colors.cardForeground,
    margin: 0,
    marginBottom: "0.25rem",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: getFontSizeValue(settings.descriptionFontSize),
    fontWeight: getFontWeightValue(settings.descriptionFontWeight),
    lineHeight: getLineHeightValue(settings.descriptionLineHeight),
    color: colors.mutedForeground,
    margin: 0,
  };

  // Helper to render a select with Tailwind token options
  const renderSelect = <K extends keyof CardSettings>(
    label: string,
    key: K,
    options: Array<{ value: string; label: string; description: string }>,
  ) => (
    <SettingsField>
      <Label>{label}</Label>
      <Select
        value={settings[key] as string}
        onValueChange={(v) => onChange(key, v as CardSettings[K])}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span className="flex justify-between w-full">
                <span>{opt.label}</span>
                <span className="text-muted-foreground ml-2">
                  {opt.description}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingsField>
  );

  return (
    <SettingsSection
      title="Card Styling"
      description="Customize card components using Tailwind tokens."
    >
      {/* Preview */}
      <div
        className="mb-8 p-6 rounded-lg border"
        style={{ backgroundColor: colors.background }}
      >
        <Label
          className="text-xs mb-3 block"
          style={{ color: colors.mutedForeground }}
        >
          Live Preview
        </Label>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <h4 style={titleStyle}>Card Title</h4>
            <p style={descriptionStyle}>Card description text</p>
          </div>
          <div style={contentStyle}>
            <p
              style={{
                fontSize: getFontSizeValue("sm"),
                color: colors.cardForeground,
                margin: 0,
              }}
            >
              Card content area with text, images, or components.
            </p>
          </div>
          <div style={footerStyle}>
            <p
              style={{
                fontSize: getFontSizeValue("xs"),
                color: colors.mutedForeground,
                margin: 0,
              }}
            >
              Card Footer
            </p>
          </div>
        </div>
      </div>

      <SettingsGridBlock title="Container Shape">
        {renderSelect(
          "Border Radius",
          "borderRadius",
          borderRadiusSelectOptions,
        )}
        {renderSelect("Border Width", "borderWidth", borderWidthSelectOptions)}
        {renderSelect("Shadow", "shadow", shadowSelectOptions)}
        {renderSelect("Hover Shadow", "hoverShadow", shadowSelectOptions)}
      </SettingsGridBlock>

      <SettingsGridBlock title="Header Spacing">
        {renderSelect("Padding X", "headerPaddingX", spacingSelectOptions)}
        {renderSelect("Padding Y", "headerPaddingY", spacingSelectOptions)}
        <SettingsField>
          <Label>Show Border</Label>
          <Switch
            checked={settings.headerBorder}
            onCheckedChange={(v) => onChange("headerBorder", v)}
          />
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Content Spacing">
        {renderSelect("Padding X", "contentPaddingX", spacingSelectOptions)}
        {renderSelect("Padding Y", "contentPaddingY", spacingSelectOptions)}
      </SettingsGridBlock>

      <SettingsGridBlock title="Footer Spacing">
        {renderSelect("Padding X", "footerPaddingX", spacingSelectOptions)}
        {renderSelect("Padding Y", "footerPaddingY", spacingSelectOptions)}
        <SettingsField>
          <Label>Show Border</Label>
          <Switch
            checked={settings.footerBorder}
            onCheckedChange={(v) => onChange("footerBorder", v)}
          />
        </SettingsField>
      </SettingsGridBlock>

      <SettingsGridBlock title="Title Typography">
        {renderSelect("Font Size", "titleFontSize", fontSizeSelectOptions)}
        {renderSelect(
          "Font Weight",
          "titleFontWeight",
          fontWeightSelectOptions,
        )}
        {renderSelect(
          "Line Height",
          "titleLineHeight",
          lineHeightSelectOptions,
        )}
        {renderSelect(
          "Letter Spacing",
          "titleLetterSpacing",
          letterSpacingSelectOptions,
        )}
      </SettingsGridBlock>

      <SettingsGridBlock title="Description Typography">
        {renderSelect(
          "Font Size",
          "descriptionFontSize",
          fontSizeSelectOptions.slice(0, 5),
        )}
        {renderSelect(
          "Font Weight",
          "descriptionFontWeight",
          fontWeightSelectOptions,
        )}
        {renderSelect(
          "Line Height",
          "descriptionLineHeight",
          lineHeightSelectOptions,
        )}
      </SettingsGridBlock>

      <SettingsGridBlock title="Effects">
        {renderSelect(
          "Transition Duration",
          "transitionDuration",
          transitionDurationSelectOptions,
        )}
      </SettingsGridBlock>
    </SettingsSection>
  );
}

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
  SettingsField,
  type SettingsNavItem,
} from "@/components/ui/settings-drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Palette,
  Type,
  Globe,
  RectangleHorizontal,
  FormInput,
  CreditCard,
  Home,
  Sparkles,
  Zap,
  Layers,
  Loader2,
  Search,
} from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { PageList, type PageCardData, type PageCardActions } from "@/components/ui/page-card";
import { cn } from "@/lib/utils";
import {
  useTenantTokens,
  useUpdateTenantTokens,
} from "@/lib/hooks/use-tenant-tokens";
import {
  usePages,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
  useDuplicatePage,
  useDeletePage
} from "@/lib/hooks/use-pages";
import { useParams, useRouter } from "next/navigation";
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
import { googleFonts, findFont } from "@/lib/fonts/google-fonts";
import type {
  FontDefinition,
  FontRole,
  FontRoles,
  FontConfig,
} from "@/lib/tokens/types";
import { Checkbox } from "@/components/ui/checkbox";

// New comprehensive settings panels
import {
  ColorSettingsPanel,
  type ColorSettingsData,
  defaultColorSettings,
} from "./color-settings-panel";
import {
  TypographySettingsPanel as NewTypographySettingsPanel,
  type TypographySettingsData,
  defaultTypographySettings,
} from "./typography-settings-panel";
import {
  AnimationSettingsPanel,
  type AnimationSettingsData,
  defaultAnimationSettings,
} from "./animation-settings-panel";
import {
  ComponentSettingsPanel,
  type ComponentSettingsData,
  defaultComponentSettings,
} from "./component-settings-panel";
import {
  ThemePresets,
  type ThemePreset,
} from "./theme-presets";
import {
  LoadingSettingsPanel,
  type LoadingSettingsData,
  defaultLoadingSettings,
} from "./loading-settings-panel";
import {
  SEOSettingsPanel,
  type SEOSettingsData,
  defaultSEOSettings,
} from "./seo-settings-panel";

type SettingsTab =
  | "presets"
  | "site"
  | "seo"
  | "colors"
  | "typography"
  | "animations"
  | "components"
  | "loading"
  | "buttons"
  | "inputs"
  | "cards";

const navItems: SettingsNavItem<SettingsTab>[] = [
  // TODO: Re-enable when settings are wired to CSS variables and presets can be previewed
  // {
  //   id: "presets",
  //   label: "Theme Presets",
  //   icon: Sparkles,
  //   description: "Quick start themes",
  // },
  {
    id: "site",
    label: "Site",
    icon: Home,
    description: "Site settings",
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    description: "Search & analytics",
  },
  { id: "colors", label: "Colors", icon: Palette, description: "Brand & UI colors" },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    description: "Fonts & text scales",
  },
  {
    id: "animations",
    label: "Animations",
    icon: Zap,
    description: "Motion & timing",
  },
  {
    id: "components",
    label: "Components",
    icon: Layers,
    description: "UI component styles",
  },
  {
    id: "loading",
    label: "Loading",
    icon: Loader2,
    description: "Skeletons & loaders",
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
  fontConfig: FontConfig;
}

interface ButtonSizeSettings {
  paddingX: string;
  paddingY: string;
  gap: string;
  minHeight: string;
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textTransform: string;
  borderRadius: string;
  transitionDuration: string;
}

interface ButtonSettings {
  sizes: {
    xs: ButtonSizeSettings;
    sm: ButtonSizeSettings;
    md: ButtonSizeSettings;
    lg: ButtonSizeSettings;
    xl: ButtonSizeSettings;
  };
}

interface InputSettings {
  borderRadius: string;
  borderWidth: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
  fontWeight: string;
  transitionDuration: string;
}

interface CardSettings {
  borderRadius: string;
  borderWidth: string;
  shadow: string;
  headerPaddingX: string;
  headerPaddingY: string;
  contentPaddingX: string;
  contentPaddingY: string;
  footerPaddingX: string;
  footerPaddingY: string;
  headerBorder: boolean;
  footerBorder: boolean;
  titleFontSize: string;
  titleFontWeight: string;
  titleLineHeight: string;
  titleLetterSpacing: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  descriptionLineHeight: string;
  hoverShadow: string;
  transitionDuration: string;
}

interface LocalTokens {
  colors: SemanticColors;
  typography: TypographySettings;
  buttons: ButtonSettings;
  inputs: InputSettings;
  cards: CardSettings;
  // New comprehensive settings
  colorSettings: ColorSettingsData;
  typographySettings: TypographySettingsData;
  animationSettings: AnimationSettingsData;
  componentSettings: ComponentSettingsData;
  loadingSettings: LoadingSettingsData;
  seoSettings: SEOSettingsData;
  activeThemeId?: string;
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

const defaultFontConfig: FontConfig = {
  definitions: [
    {
      id: "primary",
      family: "Inter",
      weights: [400, 500, 600, 700],
      category: "sans-serif",
    },
    {
      id: "secondary",
      family: "Open Sans",
      weights: [400, 500, 600],
      category: "sans-serif",
    },
    {
      id: "accent",
      family: "Roboto Condensed",
      weights: [400, 700],
      category: "sans-serif",
    },
  ],
  roles: {
    heading: "primary",
    body: "secondary",
    button: "accent",
    link: "accent",
    caption: "secondary",
    navigation: "primary",
  },
};

const defaultTypography: TypographySettings = {
  fontFamily: { base: "Open_Sans", heading: "Roboto_Slab" },
  fontSize: { base: "1rem", heading: "2rem" },
  borderRadius: "0.5rem",
  fontConfig: defaultFontConfig,
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
  borderRadius: "md",
  borderWidth: "DEFAULT",
  paddingX: "3",
  paddingY: "2",
  fontSize: "sm",
  fontWeight: "normal",
  transitionDuration: "150",
};

const defaultCards: CardSettings = {
  borderRadius: "lg",
  borderWidth: "DEFAULT",
  shadow: "sm",
  headerPaddingX: "6",
  headerPaddingY: "4",
  contentPaddingX: "6",
  contentPaddingY: "4",
  footerPaddingX: "6",
  footerPaddingY: "4",
  headerBorder: true,
  footerBorder: true,
  titleFontSize: "lg",
  titleFontWeight: "semibold",
  titleLineHeight: "tight",
  titleLetterSpacing: "tight",
  descriptionFontSize: "sm",
  descriptionFontWeight: "normal",
  descriptionLineHeight: "normal",
  hoverShadow: "md",
  transitionDuration: "200",
};

const defaultTokens: LocalTokens = {
  colors: defaultColors,
  typography: defaultTypography,
  buttons: defaultButtons,
  inputs: defaultInputs,
  cards: defaultCards,
  // New comprehensive settings
  colorSettings: defaultColorSettings,
  typographySettings: defaultTypographySettings,
  animationSettings: defaultAnimationSettings,
  componentSettings: defaultComponentSettings,
  loadingSettings: defaultLoadingSettings,
  seoSettings: defaultSEOSettings,
  activeThemeId: undefined,
};

// ============================================================================
// Main Component
// ============================================================================

export function GlobalSettingsDrawer({
  open,
  onOpenChange,
}: GlobalSettingsDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("site");
  const params = useParams();
  const tenantId = params?.id as string | undefined;

  const { data: tokens, isLoading } = useTenantTokens(tenantId || "");
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
          fontConfig: tokens.fonts || defaultFontConfig,
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
        // New comprehensive settings from stored tokens (cast to any for extended properties)
        colorSettings: (tokens as Record<string, unknown>).colorSettings as ColorSettingsData || defaultColorSettings,
        typographySettings: (tokens as Record<string, unknown>).typographySettings as TypographySettingsData || defaultTypographySettings,
        animationSettings: (tokens as Record<string, unknown>).animationSettings as AnimationSettingsData || defaultAnimationSettings,
        componentSettings: (tokens as Record<string, unknown>).componentSettings as ComponentSettingsData || defaultComponentSettings,
        loadingSettings: (tokens as Record<string, unknown>).loadingSettings as LoadingSettingsData || defaultLoadingSettings,
        seoSettings: (tokens as Record<string, unknown>).seoSettings as SEOSettingsData || defaultSEOSettings,
        activeThemeId: (tokens as Record<string, unknown>).activeThemeId as string | undefined,
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

  // New comprehensive settings handlers
  const updateColorSettings = (settings: ColorSettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      colorSettings: settings,
    }));
  };

  const updateTypographySettings = (settings: TypographySettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      typographySettings: settings,
    }));
  };

  const updateAnimationSettings = (settings: AnimationSettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      animationSettings: settings,
    }));
  };

  const updateComponentSettings = (settings: ComponentSettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      componentSettings: settings,
    }));
  };

  const updateLoadingSettings = (settings: LoadingSettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      loadingSettings: settings,
    }));
  };

  const updateSeoSettings = (settings: SEOSettingsData) => {
    setLocalTokens((prev) => ({
      ...prev,
      seoSettings: settings,
    }));
  };

  const handleApplyThemePreset = (preset: ThemePreset) => {
    setLocalTokens((prev) => ({
      ...prev,
      colorSettings: preset.colors,
      typographySettings: preset.typography,
      animationSettings: preset.animations,
      componentSettings: preset.components,
      activeThemeId: preset.id,
    }));
    toast.success(`Applied "${preset.name}" theme`);
  };

  const handleSave = () => {
    if (!tenantId) return;

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
      fonts: localTokens.typography.fontConfig,
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
      // New comprehensive settings
      colorSettings: localTokens.colorSettings,
      typographySettings: localTokens.typographySettings,
      animationSettings: localTokens.animationSettings,
      componentSettings: localTokens.componentSettings,
      loadingSettings: localTokens.loadingSettings,
      seoSettings: localTokens.seoSettings,
      activeThemeId: localTokens.activeThemeId,
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

        {/* Site Settings - Pages management */}
        {activeTab === "site" && tenantId && (
          <SiteSettingsPanel tenantId={tenantId} />
        )}

        {/* SEO & Analytics Settings */}
        {activeTab === "seo" && (
          <SEOSettingsPanel
            settings={localTokens.seoSettings}
            onChange={updateSeoSettings}
          />
        )}

        {/* Colors - Comprehensive color settings with scales */}
        {activeTab === "colors" && (
          <ColorSettingsPanel
            colors={localTokens.colorSettings}
            onChange={updateColorSettings}
          />
        )}

        {/* Typography - Font families, scales, and roles */}
        {activeTab === "typography" && (
          <NewTypographySettingsPanel
            typography={localTokens.typographySettings}
            onChange={updateTypographySettings}
          />
        )}

        {/* Animations - Motion and timing settings */}
        {activeTab === "animations" && (
          <AnimationSettingsPanel
            animation={localTokens.animationSettings}
            onChange={updateAnimationSettings}
          />
        )}

        {/* Components - Dropdowns, modals, drawers, etc. */}
        {activeTab === "components" && (
          <ComponentSettingsPanel
            settings={localTokens.componentSettings}
            onChange={updateComponentSettings}
          />
        )}

        {/* Loading - Skeletons, placeholders, loaders */}
        {activeTab === "loading" && (
          <LoadingSettingsPanel
            settings={localTokens.loadingSettings}
            onChange={updateLoadingSettings}
          />
        )}

        {/* Buttons - Button size and style settings */}
        {activeTab === "buttons" && (
          <ButtonSettingsPanel
            settings={localTokens.buttons}
            onChange={updateButtons}
            colors={localTokens.colors}
          />
        )}

        {/* Inputs - Form input styling */}
        {activeTab === "inputs" && (
          <InputSettingsPanel
            settings={localTokens.inputs}
            onChange={updateInputs}
            colors={localTokens.colors}
          />
        )}

        {/* Cards - Card component styling */}
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

const fontSlotLabels: Record<
  FontDefinition["id"],
  { name: string; description: string }
> = {
  primary: { name: "Primary Font", description: "Main heading font" },
  secondary: { name: "Secondary Font", description: "Body text font" },
  accent: { name: "Accent Font", description: "Buttons & highlights" },
};

const fontRoleLabels: Record<
  keyof FontRoles,
  { name: string; description: string }
> = {
  heading: { name: "Headings", description: "H1-H6 elements" },
  body: { name: "Body Text", description: "Paragraphs & content" },
  button: { name: "Buttons", description: "Button labels" },
  link: { name: "Links", description: "Anchor text" },
  caption: { name: "Captions", description: "Small text, labels" },
  navigation: { name: "Navigation", description: "Menu items" },
};

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
  const { fontConfig } = settings;

  const updateFontDefinition = (
    id: FontDefinition["id"],
    updates: Partial<FontDefinition>,
  ) => {
    const newDefinitions = fontConfig.definitions.map((def) =>
      def.id === id ? { ...def, ...updates } : def,
    );
    onChange("fontConfig", { ...fontConfig, definitions: newDefinitions });
  };

  const updateFontRole = (role: keyof FontRoles, value: FontRole) => {
    onChange("fontConfig", {
      ...fontConfig,
      roles: { ...fontConfig.roles, [role]: value },
    });
  };

  const toggleWeight = (id: FontDefinition["id"], weight: number) => {
    const def = fontConfig.definitions.find((d) => d.id === id);
    if (!def) return;

    const hasWeight = def.weights.includes(weight);
    const newWeights = hasWeight
      ? def.weights.filter((w) => w !== weight)
      : [...def.weights, weight].sort((a, b) => a - b);

    if (newWeights.length === 0) return;

    updateFontDefinition(id, { weights: newWeights });
  };

  const getFontDefinition = (id: FontDefinition["id"]) =>
    fontConfig.definitions.find((d) => d.id === id);

  const renderFontSlot = (id: FontDefinition["id"]) => {
    const def = getFontDefinition(id);
    if (!def) return null;

    const label = fontSlotLabels[id];
    const selectedFont = findFont(def.family);
    const availableWeights = selectedFont?.weights || [400, 700];

    return (
      <div key={id} className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">{label.name}</h4>
            <p className="text-xs text-muted-foreground">{label.description}</p>
          </div>
        </div>

        <SettingsField>
          <Label className="text-xs">Font Family</Label>
          <Select
            value={def.family}
            onValueChange={(family) => {
              const font = findFont(family);
              updateFontDefinition(id, {
                family,
                category: font?.category || "sans-serif",
                weights: font?.weights.filter((w) =>
                  [400, 700].includes(w),
                ) || [400],
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Popular
              </div>
              {googleFonts
                .filter((f) => f.popular)
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    <span style={{ fontFamily: font.family }}>
                      {font.family}
                    </span>
                  </SelectItem>
                ))}

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                Sans-serif
              </div>
              {googleFonts
                .filter((f) => f.category === "sans-serif" && !f.popular)
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    {font.family}
                  </SelectItem>
                ))}

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                Serif
              </div>
              {googleFonts
                .filter((f) => f.category === "serif")
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    {font.family}
                  </SelectItem>
                ))}

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                Display
              </div>
              {googleFonts
                .filter((f) => f.category === "display")
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    {font.family}
                  </SelectItem>
                ))}

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                Monospace
              </div>
              {googleFonts
                .filter((f) => f.category === "monospace")
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    {font.family}
                  </SelectItem>
                ))}

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                Handwriting
              </div>
              {googleFonts
                .filter((f) => f.category === "handwriting")
                .map((font) => (
                  <SelectItem key={font.family} value={font.family}>
                    {font.family}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <div className="space-y-2">
          <Label className="text-xs">Font Weights</Label>
          <div className="flex flex-wrap gap-2">
            {availableWeights.map((weight) => (
              <label
                key={weight}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer transition-colors",
                  def.weights.includes(weight)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted",
                )}
              >
                <Checkbox
                  checked={def.weights.includes(weight)}
                  onCheckedChange={() => toggleWeight(id, weight)}
                  className="sr-only"
                />
                {weight}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p
            className="text-sm text-muted-foreground"
            style={{
              fontFamily: `'${def.family}', ${def.category || "sans-serif"}`,
              fontWeight:
                def.weights[Math.floor(def.weights.length / 2)] || 400,
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    );
  };

  return (
    <SettingsSection
      title="Typography & Fonts"
      description="Configure your site's font system with up to 3 fonts and assign them to different UI elements."
    >
      <SettingsGridBlock title="Font Definitions">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Define up to 3 fonts that can be used across your site. Each font
            can be assigned to different UI elements.
          </p>
          {(["primary", "secondary", "accent"] as const).map((id) =>
            renderFontSlot(id),
          )}
        </div>
      </SettingsGridBlock>

      <SettingsGridBlock title="Font Assignments">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Assign fonts to different UI elements. Components will use these
            defaults unless overridden.
          </p>
          <div className="grid gap-3">
            {(Object.keys(fontRoleLabels) as (keyof FontRoles)[]).map(
              (role) => {
                const label = fontRoleLabels[role];
                return (
                  <div
                    key={role}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <span className="font-medium text-sm">{label.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {label.description}
                      </span>
                    </div>
                    <Select
                      value={fontConfig.roles[role]}
                      onValueChange={(v) => updateFontRole(role, v as FontRole)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">
                          Primary (
                          {getFontDefinition("primary")?.family || "Inter"})
                        </SelectItem>
                        <SelectItem value="secondary">
                          Secondary (
                          {getFontDefinition("secondary")?.family ||
                            "Open Sans"}
                          )
                        </SelectItem>
                        <SelectItem value="accent">
                          Accent (
                          {getFontDefinition("accent")?.family ||
                            "Roboto Condensed"}
                          )
                        </SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              },
            )}
          </div>
        </div>
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

  const sizes = settings.sizes ?? defaultButtons.sizes;

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

  const currentSize = sizes[activeSize];

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

  const renderSelect = <K extends keyof CardSettings>(
    label: string,
    key: K,
    options: Array<{ value: string; label: string; description: string }>,
  ) => (
    <div className="settings-field-compact">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={settings[key] as string}
        onValueChange={(v) => onChange(key, v as CardSettings[K])}
      >
        <SelectTrigger className="h-9">
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
    </div>
  );

  const renderInlineSwitch = (
    label: string,
    key: "headerBorder" | "footerBorder",
  ) => (
    <div className="settings-field-inline">
      <Label>{label}</Label>
      <Switch
        checked={settings[key]}
        onCheckedChange={(v) => onChange(key, v)}
      />
    </div>
  );

  return (
    <SettingsSection
      title="Card Styling"
      description="Customize card components using Tailwind tokens."
    >
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
        <div className="settings-grid-compact">
          {renderSelect("Padding X", "headerPaddingX", spacingSelectOptions)}
          {renderSelect("Padding Y", "headerPaddingY", spacingSelectOptions)}
        </div>
        <div className="mt-3">
          {renderInlineSwitch("Show Border", "headerBorder")}
        </div>
      </SettingsGridBlock>

      <SettingsGridBlock title="Content Spacing">
        <div className="settings-grid-compact">
          {renderSelect("Padding X", "contentPaddingX", spacingSelectOptions)}
          {renderSelect("Padding Y", "contentPaddingY", spacingSelectOptions)}
        </div>
      </SettingsGridBlock>

      <SettingsGridBlock title="Footer Spacing">
        <div className="settings-grid-compact">
          {renderSelect("Padding X", "footerPaddingX", spacingSelectOptions)}
          {renderSelect("Padding Y", "footerPaddingY", spacingSelectOptions)}
        </div>
        <div className="mt-3">
          {renderInlineSwitch("Show Border", "footerBorder")}
        </div>
      </SettingsGridBlock>

      <SettingsGridBlock title="Title Typography">
        <div className="settings-grid-compact">
          {renderSelect("Font Size", "titleFontSize", fontSizeSelectOptions)}
          {renderSelect("Font Weight", "titleFontWeight", fontWeightSelectOptions)}
          {renderSelect("Line Height", "titleLineHeight", lineHeightSelectOptions)}
          {renderSelect("Letter Spacing", "titleLetterSpacing", letterSpacingSelectOptions)}
        </div>
      </SettingsGridBlock>

      <SettingsGridBlock title="Description Typography">
        <div className="settings-grid-compact">
          {renderSelect("Font Size", "descriptionFontSize", fontSizeSelectOptions.slice(0, 5))}
          {renderSelect("Font Weight", "descriptionFontWeight", fontWeightSelectOptions)}
          {renderSelect("Line Height", "descriptionLineHeight", lineHeightSelectOptions)}
        </div>
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

// ============================================================================
// SiteSettings panel
// ============================================================================

interface SiteSettingsPanelProps {
  tenantId: string;
}

function SiteSettingsPanel({ tenantId }: SiteSettingsPanelProps) {
  const router = useRouter();
  const { data: pages, isLoading: pagesLoading } = usePages(tenantId);
  const updatePage = useUpdatePage(tenantId);
  const publishPage = usePublishPage(tenantId);
  const unpublishPage = useUnpublishPage(tenantId);
  const duplicatePage = useDuplicatePage(tenantId);
  const deletePage = useDeletePage(tenantId);

  // Track which pages are being updated
  const [updatingIds, setUpdatingIds] = React.useState<string[]>([]);

  // Convert pages to PageCardData format
  const pageCardData: PageCardData[] = React.useMemo(() => {
    if (!pages) return [];
    return pages.map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: (page.status as "draft" | "published") || "draft",
      isHomePage: page.isHomePage,
      updatedAt: page.updatedAt,
      createdAt: page.createdAt,
    }));
  }, [pages]);

  // Action handlers
  const pageActions: PageCardActions = {
    onEdit: (page) => {
      router.push(`/${tenantId}/pages/${page.id}/edit`);
    },
    onDuplicate: async (page) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await duplicatePage.mutateAsync(page.id);
        toast.success(`"${page.title}" duplicated`);
      } catch {
        toast.error("Failed to duplicate page");
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== page.id));
      }
    },
    onDelete: async (page) => {
      if (page.isHomePage) {
        toast.error("Cannot delete the homepage. Set another page as homepage first.");
        return;
      }
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await deletePage.mutateAsync(page.id);
        toast.success(`"${page.title}" deleted`);
      } catch {
        toast.error("Failed to delete page");
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== page.id));
      }
    },
    onStatusChange: async (page, newStatus) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        if (newStatus === "published") {
          await publishPage.mutateAsync(page.id);
          toast.success(`"${page.title}" published`);
        } else {
          await unpublishPage.mutateAsync(page.id);
          toast.success(`"${page.title}" unpublished`);
        }
      } catch {
        toast.error(`Failed to ${newStatus === "published" ? "publish" : "unpublish"} page`);
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== page.id));
      }
    },
    onSetHomePage: async (page) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await updatePage.mutateAsync({
          id: page.id,
          data: { isHomePage: true },
        });
        toast.success(`"${page.title}" is now the homepage`);
      } catch {
        toast.error("Failed to set homepage");
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== page.id));
      }
    },
    onPreview: (page) => {
      window.open(`/${tenantId}/preview/${page.slug}`, "_blank");
    },
  };

  if (pagesLoading) {
    return (
      <SettingsSection
        title="Site Pages"
        description="Manage all pages on your site. Set homepage, publish/unpublish, and organize your content."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading pages...</div>
        </div>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Site Pages"
      description="Manage all pages on your site. Set homepage, publish/unpublish, and organize your content."
    >
      <PageList
        pages={pageCardData}
        actions={pageActions}
        updatingIds={updatingIds}
        showSearch={true}
        showFilters={true}
        showViewToggle={true}
        showDate={true}
        showHomepageToggle={true}
        defaultView="list"
        emptyMessage="No pages found. Create your first page to get started."
      />
    </SettingsSection>
  );
}

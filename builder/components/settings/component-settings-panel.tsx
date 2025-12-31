"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  ChevronDown,
  LayoutGrid,
  Menu,
  Layers,
  PanelLeft,
  MessageSquare,
  Badge,
  User,
  Navigation,
  RotateCcw,
  Smartphone,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface DropdownSettings {
  borderRadius: string;
  shadow: string;
  minWidth: string;
  maxHeight: string;
  padding: string;
  itemPaddingX: string;
  itemPaddingY: string;
  itemBorderRadius: string;
  animationDuration: string;
}

export interface ModalSettings {
  borderRadius: string;
  shadow: string;
  overlayOpacity: string;
  backdropBlur: string;
  sizes: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  paddingX: string;
  paddingY: string;
  animationDuration: string;
}

export interface DrawerSettings {
  borderRadius: string;
  shadow: string;
  overlayOpacity: string;
  backdropBlur: string;
  sizes: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  paddingX: string;
  paddingY: string;
  animationDuration: string;
  mobile: {
    fullScreen: boolean;
    swipeToClose: boolean;
    showHandle: boolean;
    position: "left" | "right" | "bottom";
  };
}

export interface TabsSettings {
  listBorderRadius: string;
  listPadding: string;
  triggerPaddingX: string;
  triggerPaddingY: string;
  triggerBorderRadius: string;
  indicatorHeight: string;
  animationDuration: string;
  variant: "default" | "pills" | "underline";
}

export interface TooltipSettings {
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  maxWidth: string;
  shadow: string;
  showArrow: boolean;
  animationDelay: string;
}

export interface BadgeSettings {
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  fontSize: string;
  fontWeight: string;
  textTransform: string;
}

export interface AvatarSettings {
  borderRadius: string;
  borderWidth: string;
  sizes: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface NavSettings {
  height: string;
  paddingX: string;
  shadow: string;
  sticky: boolean;
  backdropBlur: string;
  mobileMenuPosition: "left" | "right" | "full";
  mobileAnimation: "slide" | "fade" | "none";
}

export interface ComponentSettingsData {
  dropdown: DropdownSettings;
  modal: ModalSettings;
  drawer: DrawerSettings;
  tabs: TabsSettings;
  tooltip: TooltipSettings;
  badge: BadgeSettings;
  avatar: AvatarSettings;
  nav: NavSettings;
}

interface ComponentSettingsPanelProps {
  settings: ComponentSettingsData;
  onChange: (settings: ComponentSettingsData) => void;
  className?: string;
}

// ============================================================================
// Defaults
// ============================================================================

export const defaultComponentSettings: ComponentSettingsData = {
  dropdown: {
    borderRadius: "md",
    shadow: "md",
    minWidth: "180",
    maxHeight: "300",
    padding: "1",
    itemPaddingX: "2",
    itemPaddingY: "1.5",
    itemBorderRadius: "sm",
    animationDuration: "150",
  },
  modal: {
    borderRadius: "lg",
    shadow: "xl",
    overlayOpacity: "80",
    backdropBlur: "sm",
    sizes: {
      sm: "400",
      md: "500",
      lg: "700",
      xl: "900",
      full: "100%",
    },
    paddingX: "6",
    paddingY: "6",
    animationDuration: "200",
  },
  drawer: {
    borderRadius: "lg",
    shadow: "xl",
    overlayOpacity: "80",
    backdropBlur: "sm",
    sizes: {
      sm: "320",
      md: "400",
      lg: "540",
      xl: "720",
    },
    paddingX: "6",
    paddingY: "6",
    animationDuration: "300",
    mobile: {
      fullScreen: false,
      swipeToClose: true,
      showHandle: true,
      position: "right",
    },
  },
  tabs: {
    listBorderRadius: "lg",
    listPadding: "1",
    triggerPaddingX: "3",
    triggerPaddingY: "1.5",
    triggerBorderRadius: "md",
    indicatorHeight: "2",
    animationDuration: "200",
    variant: "default",
  },
  tooltip: {
    borderRadius: "md",
    paddingX: "3",
    paddingY: "1.5",
    maxWidth: "200",
    shadow: "md",
    showArrow: true,
    animationDelay: "200",
  },
  badge: {
    borderRadius: "full",
    paddingX: "2.5",
    paddingY: "0.5",
    fontSize: "xs",
    fontWeight: "medium",
    textTransform: "none",
  },
  avatar: {
    borderRadius: "full",
    borderWidth: "2",
    sizes: {
      sm: "8",
      md: "10",
      lg: "12",
      xl: "16",
    },
  },
  nav: {
    height: "16",
    paddingX: "6",
    shadow: "sm",
    sticky: true,
    backdropBlur: "md",
    mobileMenuPosition: "right",
    mobileAnimation: "slide",
  },
};

// ============================================================================
// Options
// ============================================================================

const borderRadiusOptions = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "DEFAULT", label: "Default" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "full", label: "Full" },
];

const shadowOptions = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "DEFAULT", label: "Default" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
];

const spacingOptions = [
  { value: "0", label: "0" },
  { value: "0.5", label: "0.5" },
  { value: "1", label: "1" },
  { value: "1.5", label: "1.5" },
  { value: "2", label: "2" },
  { value: "2.5", label: "2.5" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
];

const durationOptions = [
  { value: "100", label: "100ms" },
  { value: "150", label: "150ms" },
  { value: "200", label: "200ms" },
  { value: "300", label: "300ms" },
  { value: "500", label: "500ms" },
];

const blurOptions = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "DEFAULT", label: "Default" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "XL" },
];

const opacityOptions = [
  { value: "50", label: "50%" },
  { value: "60", label: "60%" },
  { value: "70", label: "70%" },
  { value: "80", label: "80%" },
  { value: "90", label: "90%" },
];

const fontSizeOptions = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "base", label: "Base" },
];

const fontWeightOptions = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

const textTransformOptions = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "capitalize", label: "Capitalize" },
];

// ============================================================================
// Setting Row Component
// ============================================================================

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <Label className="text-sm">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
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
// Main Component
// ============================================================================

export function ComponentSettingsPanel({
  settings,
  onChange,
  className,
}: ComponentSettingsPanelProps) {
  // Update handlers
  const updateDropdown = (updates: Partial<DropdownSettings>) => {
    onChange({
      ...settings,
      dropdown: { ...settings.dropdown, ...updates },
    });
  };

  const updateModal = (updates: Partial<ModalSettings>) => {
    onChange({
      ...settings,
      modal: { ...settings.modal, ...updates },
    });
  };

  const updateDrawer = (updates: Partial<DrawerSettings>) => {
    onChange({
      ...settings,
      drawer: { ...settings.drawer, ...updates },
    });
  };

  const updateDrawerMobile = (updates: Partial<DrawerSettings["mobile"]>) => {
    onChange({
      ...settings,
      drawer: {
        ...settings.drawer,
        mobile: { ...settings.drawer.mobile, ...updates },
      },
    });
  };

  const updateTabs = (updates: Partial<TabsSettings>) => {
    onChange({
      ...settings,
      tabs: { ...settings.tabs, ...updates },
    });
  };

  const updateTooltip = (updates: Partial<TooltipSettings>) => {
    onChange({
      ...settings,
      tooltip: { ...settings.tooltip, ...updates },
    });
  };

  const updateBadge = (updates: Partial<BadgeSettings>) => {
    onChange({
      ...settings,
      badge: { ...settings.badge, ...updates },
    });
  };

  const updateAvatar = (updates: Partial<AvatarSettings>) => {
    onChange({
      ...settings,
      avatar: { ...settings.avatar, ...updates },
    });
  };

  const updateNav = (updates: Partial<NavSettings>) => {
    onChange({
      ...settings,
      nav: { ...settings.nav, ...updates },
    });
  };

  const resetToDefaults = () => {
    onChange(defaultComponentSettings);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="overlays" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overlays" className="gap-1.5 text-xs">
            <Layers className="h-4 w-4" />
            Overlays
          </TabsTrigger>
          <TabsTrigger value="elements" className="gap-1.5 text-xs">
            <LayoutGrid className="h-4 w-4" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="nav" className="gap-1.5 text-xs">
            <Navigation className="h-4 w-4" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="mobile" className="gap-1.5 text-xs">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>

        {/* Overlays Tab (Dropdown, Modal, Drawer) */}
        <TabsContent value="overlays" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset all
            </Button>
          </div>

          {/* Dropdown Settings */}
          <CollapsibleSection
            title="Dropdown Menu"
            icon={<Menu className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.dropdown.borderRadius}
                  onValueChange={(v) => updateDropdown({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Shadow">
                <Select
                  value={settings.dropdown.shadow}
                  onValueChange={(v) => updateDropdown({ shadow: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Item Padding X">
                <Select
                  value={settings.dropdown.itemPaddingX}
                  onValueChange={(v) => updateDropdown({ itemPaddingX: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spacingOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Animation">
                <Select
                  value={settings.dropdown.animationDuration}
                  onValueChange={(v) =>
                    updateDropdown({ animationDuration: v })
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>

          {/* Modal Settings */}
          <CollapsibleSection
            title="Modal / Dialog"
            icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.modal.borderRadius}
                  onValueChange={(v) => updateModal({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Shadow">
                <Select
                  value={settings.modal.shadow}
                  onValueChange={(v) => updateModal({ shadow: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Overlay Opacity">
                <Select
                  value={settings.modal.overlayOpacity}
                  onValueChange={(v) => updateModal({ overlayOpacity: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opacityOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Backdrop Blur">
                <Select
                  value={settings.modal.backdropBlur}
                  onValueChange={(v) => updateModal({ backdropBlur: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blurOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Animation">
                <Select
                  value={settings.modal.animationDuration}
                  onValueChange={(v) => updateModal({ animationDuration: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>

          {/* Drawer Settings */}
          <CollapsibleSection
            title="Drawer / Side Panel"
            icon={<PanelLeft className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.drawer.borderRadius}
                  onValueChange={(v) => updateDrawer({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Shadow">
                <Select
                  value={settings.drawer.shadow}
                  onValueChange={(v) => updateDrawer({ shadow: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Overlay Opacity">
                <Select
                  value={settings.drawer.overlayOpacity}
                  onValueChange={(v) => updateDrawer({ overlayOpacity: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {opacityOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Animation">
                <Select
                  value={settings.drawer.animationDuration}
                  onValueChange={(v) => updateDrawer({ animationDuration: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Elements Tab (Tabs, Tooltip, Badge, Avatar) */}
        <TabsContent value="elements" className="space-y-6 mt-6">
          {/* Tabs Settings */}
          <CollapsibleSection
            title="Tabs"
            icon={<LayoutGrid className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Variant">
                <Select
                  value={settings.tabs.variant}
                  onValueChange={(v) =>
                    updateTabs({ variant: v as TabsSettings["variant"] })
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="pills">Pills</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="List Radius">
                <Select
                  value={settings.tabs.listBorderRadius}
                  onValueChange={(v) => updateTabs({ listBorderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Trigger Radius">
                <Select
                  value={settings.tabs.triggerBorderRadius}
                  onValueChange={(v) => updateTabs({ triggerBorderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>

          {/* Tooltip Settings */}
          <CollapsibleSection
            title="Tooltip"
            icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.tooltip.borderRadius}
                  onValueChange={(v) => updateTooltip({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Show Arrow">
                <Switch
                  checked={settings.tooltip.showArrow}
                  onCheckedChange={(v) => updateTooltip({ showArrow: v })}
                />
              </SettingRow>
              <SettingRow label="Delay">
                <Select
                  value={settings.tooltip.animationDelay}
                  onValueChange={(v) => updateTooltip({ animationDelay: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="100">100ms</SelectItem>
                    <SelectItem value="200">200ms</SelectItem>
                    <SelectItem value="300">300ms</SelectItem>
                    <SelectItem value="500">500ms</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>

          {/* Badge Settings */}
          <CollapsibleSection
            title="Badge"
            icon={<Badge className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.badge.borderRadius}
                  onValueChange={(v) => updateBadge({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Font Size">
                <Select
                  value={settings.badge.fontSize}
                  onValueChange={(v) => updateBadge({ fontSize: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Font Weight">
                <Select
                  value={settings.badge.fontWeight}
                  onValueChange={(v) => updateBadge({ fontWeight: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeightOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Text Transform">
                <Select
                  value={settings.badge.textTransform}
                  onValueChange={(v) => updateBadge({ textTransform: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {textTransformOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>

          {/* Avatar Settings */}
          <CollapsibleSection
            title="Avatar"
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Border Radius">
                <Select
                  value={settings.avatar.borderRadius}
                  onValueChange={(v) => updateAvatar({ borderRadius: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {borderRadiusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Border Width">
                <Select
                  value={settings.avatar.borderWidth}
                  onValueChange={(v) => updateAvatar({ borderWidth: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">1px</SelectItem>
                    <SelectItem value="2">2px</SelectItem>
                    <SelectItem value="4">4px</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="nav" className="space-y-6 mt-6">
          <CollapsibleSection
            title="Header Navigation"
            icon={<Navigation className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Height">
                <Select
                  value={settings.nav.height}
                  onValueChange={(v) => updateNav({ height: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">48px</SelectItem>
                    <SelectItem value="14">56px</SelectItem>
                    <SelectItem value="16">64px</SelectItem>
                    <SelectItem value="18">72px</SelectItem>
                    <SelectItem value="20">80px</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Shadow">
                <Select
                  value={settings.nav.shadow}
                  onValueChange={(v) => updateNav({ shadow: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Sticky">
                <Switch
                  checked={settings.nav.sticky}
                  onCheckedChange={(v) => updateNav({ sticky: v })}
                />
              </SettingRow>
              <SettingRow label="Backdrop Blur">
                <Select
                  value={settings.nav.backdropBlur}
                  onValueChange={(v) => updateNav({ backdropBlur: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blurOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Mobile Tab */}
        <TabsContent value="mobile" className="space-y-6 mt-6">
          <CollapsibleSection
            title="Mobile Drawer"
            icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Position">
                <Select
                  value={settings.drawer.mobile.position}
                  onValueChange={(v) =>
                    updateDrawerMobile({
                      position: v as DrawerSettings["mobile"]["position"],
                    })
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Full Screen">
                <Switch
                  checked={settings.drawer.mobile.fullScreen}
                  onCheckedChange={(v) => updateDrawerMobile({ fullScreen: v })}
                />
              </SettingRow>
              <SettingRow label="Swipe to Close">
                <Switch
                  checked={settings.drawer.mobile.swipeToClose}
                  onCheckedChange={(v) =>
                    updateDrawerMobile({ swipeToClose: v })
                  }
                />
              </SettingRow>
              <SettingRow label="Show Handle">
                <Switch
                  checked={settings.drawer.mobile.showHandle}
                  onCheckedChange={(v) => updateDrawerMobile({ showHandle: v })}
                />
              </SettingRow>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Mobile Navigation"
            icon={<Menu className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <SettingRow label="Menu Position">
                <Select
                  value={settings.nav.mobileMenuPosition}
                  onValueChange={(v) =>
                    updateNav({
                      mobileMenuPosition:
                        v as NavSettings["mobileMenuPosition"],
                    })
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="full">Full Screen</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Animation">
                <Select
                  value={settings.nav.mobileAnimation}
                  onValueChange={(v) =>
                    updateNav({
                      mobileAnimation: v as NavSettings["mobileAnimation"],
                    })
                  }
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </CollapsibleSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}

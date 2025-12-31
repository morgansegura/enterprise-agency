"use client";

import * as React from "react";
import {
  SettingsSection,
  SettingsGridBlock,
  SettingsField,
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
import { Input } from "@/components/ui/input";
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  ImagePlaceholder,
  Loader,
  PageLoader,
  type SkeletonAnimation,
  type LoaderVariant,
} from "@/components/ui/skeleton";

// ============================================================================
// Types
// ============================================================================

export interface LoadingSettingsData {
  // Skeleton settings
  skeleton: {
    defaultAnimation: SkeletonAnimation;
    textLines: number;
    lastLineWidth: string;
  };
  // Image placeholder settings
  imagePlaceholder: {
    animation: SkeletonAnimation;
    showIcon: boolean;
    defaultAspectRatio: "square" | "video" | "portrait" | "auto";
    iconSize: number;
  };
  // Page loader settings
  pageLoader: {
    variant: LoaderVariant;
    showLabel: boolean;
    labelText: string;
    fullscreen: boolean;
    useLogo: boolean;
  };
  // Inline loader settings
  inlineLoader: {
    variant: LoaderVariant;
    size: "sm" | "md" | "lg";
  };
}

export const defaultLoadingSettings: LoadingSettingsData = {
  skeleton: {
    defaultAnimation: "shimmer",
    textLines: 3,
    lastLineWidth: "60%",
  },
  imagePlaceholder: {
    animation: "shimmer",
    showIcon: true,
    defaultAspectRatio: "video",
    iconSize: 48,
  },
  pageLoader: {
    variant: "spinner",
    showLabel: true,
    labelText: "Loading...",
    fullscreen: false,
    useLogo: false,
  },
  inlineLoader: {
    variant: "spinner",
    size: "md",
  },
};

// ============================================================================
// Options
// ============================================================================

const skeletonAnimationOptions: Array<{
  value: SkeletonAnimation;
  label: string;
  description: string;
}> = [
  {
    value: "shimmer",
    label: "Shimmer",
    description: "Gliding highlight effect",
  },
  { value: "pulse", label: "Pulse", description: "Fading in/out" },
  { value: "wave", label: "Wave", description: "Smooth wave motion" },
  { value: "none", label: "None", description: "Static placeholder" },
];

const loaderVariantOptions: Array<{
  value: LoaderVariant;
  label: string;
  description: string;
}> = [
  { value: "spinner", label: "Spinner", description: "Rotating circle" },
  { value: "dots", label: "Dots", description: "Bouncing dots" },
  { value: "bars", label: "Bars", description: "Equalizer bars" },
  { value: "progress", label: "Progress", description: "Moving bar" },
];

const aspectRatioOptions: Array<{
  value: "square" | "video" | "portrait" | "auto";
  label: string;
  description: string;
}> = [
  { value: "video", label: "Video (16:9)", description: "Landscape format" },
  { value: "square", label: "Square (1:1)", description: "Equal sides" },
  { value: "portrait", label: "Portrait (3:4)", description: "Tall format" },
  { value: "auto", label: "Auto", description: "Match container" },
];

const loaderSizeOptions: Array<{
  value: "sm" | "md" | "lg";
  label: string;
  description: string;
}> = [
  { value: "sm", label: "Small", description: "20px" },
  { value: "md", label: "Medium", description: "40px" },
  { value: "lg", label: "Large", description: "64px" },
];

// ============================================================================
// Component
// ============================================================================

interface LoadingSettingsPanelProps {
  settings: LoadingSettingsData;
  onChange: (settings: LoadingSettingsData) => void;
}

export function LoadingSettingsPanel({
  settings,
  onChange,
}: LoadingSettingsPanelProps) {
  const updateSkeleton = <K extends keyof LoadingSettingsData["skeleton"]>(
    key: K,
    value: LoadingSettingsData["skeleton"][K],
  ) => {
    onChange({
      ...settings,
      skeleton: { ...settings.skeleton, [key]: value },
    });
  };

  const updateImagePlaceholder = <
    K extends keyof LoadingSettingsData["imagePlaceholder"],
  >(
    key: K,
    value: LoadingSettingsData["imagePlaceholder"][K],
  ) => {
    onChange({
      ...settings,
      imagePlaceholder: { ...settings.imagePlaceholder, [key]: value },
    });
  };

  const updatePageLoader = <K extends keyof LoadingSettingsData["pageLoader"]>(
    key: K,
    value: LoadingSettingsData["pageLoader"][K],
  ) => {
    onChange({
      ...settings,
      pageLoader: { ...settings.pageLoader, [key]: value },
    });
  };

  const updateInlineLoader = <
    K extends keyof LoadingSettingsData["inlineLoader"],
  >(
    key: K,
    value: LoadingSettingsData["inlineLoader"][K],
  ) => {
    onChange({
      ...settings,
      inlineLoader: { ...settings.inlineLoader, [key]: value },
    });
  };

  return (
    <SettingsSection
      title="Loading & Placeholders"
      description="Configure skeleton loaders, image placeholders, and loading animations for a consistent loading experience."
    >
      {/* Skeleton Animation Settings */}
      <SettingsGridBlock title="Skeleton Animation">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure how skeleton placeholders animate while content loads.
          </p>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-card">
            <Label className="text-xs text-muted-foreground mb-3 block">
              Preview
            </Label>
            <div className="space-y-4">
              <SkeletonText
                animation={settings.skeleton.defaultAnimation}
                lines={settings.skeleton.textLines}
                lastLineWidth={settings.skeleton.lastLineWidth}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label>Animation Style</Label>
              <Select
                value={settings.skeleton.defaultAnimation}
                onValueChange={(v) =>
                  updateSkeleton("defaultAnimation", v as SkeletonAnimation)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skeletonAnimationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex justify-between w-full">
                        <span>{opt.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {opt.description}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label>Default Text Lines</Label>
              <Select
                value={String(settings.skeleton.textLines)}
                onValueChange={(v) => updateSkeleton("textLines", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "line" : "lines"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </div>
      </SettingsGridBlock>

      {/* Image Placeholder Settings */}
      <SettingsGridBlock title="Image Placeholder">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure the default appearance for image placeholders.
          </p>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-card">
            <Label className="text-xs text-muted-foreground mb-3 block">
              Preview
            </Label>
            <ImagePlaceholder
              animation={settings.imagePlaceholder.animation}
              icon={settings.imagePlaceholder.showIcon ? "image" : "none"}
              aspectRatio={settings.imagePlaceholder.defaultAspectRatio}
              iconSize={settings.imagePlaceholder.iconSize}
              className="max-w-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label>Animation Style</Label>
              <Select
                value={settings.imagePlaceholder.animation}
                onValueChange={(v) =>
                  updateImagePlaceholder("animation", v as SkeletonAnimation)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skeletonAnimationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label>Default Aspect Ratio</Label>
              <Select
                value={settings.imagePlaceholder.defaultAspectRatio}
                onValueChange={(v) =>
                  updateImagePlaceholder(
                    "defaultAspectRatio",
                    v as "square" | "video" | "portrait" | "auto",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatioOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex justify-between w-full">
                        <span>{opt.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {opt.description}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="settings-field-inline">
              <Label>Show Placeholder Icon</Label>
              <Switch
                checked={settings.imagePlaceholder.showIcon}
                onCheckedChange={(v) => updateImagePlaceholder("showIcon", v)}
              />
            </div>

            <SettingsField>
              <Label>Icon Size</Label>
              <Select
                value={String(settings.imagePlaceholder.iconSize)}
                onValueChange={(v) =>
                  updateImagePlaceholder("iconSize", Number(v))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">Small (24px)</SelectItem>
                  <SelectItem value="32">Medium (32px)</SelectItem>
                  <SelectItem value="48">Large (48px)</SelectItem>
                  <SelectItem value="64">X-Large (64px)</SelectItem>
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </div>
      </SettingsGridBlock>

      {/* Page Loader Settings */}
      <SettingsGridBlock title="Page Loading">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure the loading animation shown during page transitions.
          </p>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-card relative h-32 overflow-hidden">
            <Label className="text-xs text-muted-foreground mb-3 block">
              Preview
            </Label>
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center gap-3">
                <Loader variant={settings.pageLoader.variant} size="md" />
                {settings.pageLoader.showLabel && (
                  <span className="text-sm text-muted-foreground animate-pulse">
                    {settings.pageLoader.labelText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label>Loader Style</Label>
              <Select
                value={settings.pageLoader.variant}
                onValueChange={(v) =>
                  updatePageLoader("variant", v as LoaderVariant)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loaderVariantOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex justify-between w-full">
                        <span>{opt.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {opt.description}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label>Loading Text</Label>
              <Input
                value={settings.pageLoader.labelText}
                onChange={(e) => updatePageLoader("labelText", e.target.value)}
                placeholder="Loading..."
              />
            </SettingsField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="settings-field-inline">
              <Label>Show Loading Text</Label>
              <Switch
                checked={settings.pageLoader.showLabel}
                onCheckedChange={(v) => updatePageLoader("showLabel", v)}
              />
            </div>

            <div className="settings-field-inline">
              <Label>Fullscreen Overlay</Label>
              <Switch
                checked={settings.pageLoader.fullscreen}
                onCheckedChange={(v) => updatePageLoader("fullscreen", v)}
              />
            </div>
          </div>
        </div>
      </SettingsGridBlock>

      {/* Inline Loader Settings */}
      <SettingsGridBlock title="Inline Loaders">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure small loaders used in buttons and inline elements.
          </p>

          {/* Preview */}
          <div className="p-4 rounded-lg border bg-card">
            <Label className="text-xs text-muted-foreground mb-3 block">
              Preview
            </Label>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Loader variant={settings.inlineLoader.variant} size="sm" />
                <span className="text-xs text-muted-foreground">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Loader variant={settings.inlineLoader.variant} size="md" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Loader variant={settings.inlineLoader.variant} size="lg" />
                <span className="text-xs text-muted-foreground">Large</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SettingsField>
              <Label>Loader Style</Label>
              <Select
                value={settings.inlineLoader.variant}
                onValueChange={(v) =>
                  updateInlineLoader("variant", v as LoaderVariant)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loaderVariantOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>

            <SettingsField>
              <Label>Default Size</Label>
              <Select
                value={settings.inlineLoader.size}
                onValueChange={(v) =>
                  updateInlineLoader("size", v as "sm" | "md" | "lg")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loaderSizeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex justify-between w-full">
                        <span>{opt.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {opt.description}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </div>
      </SettingsGridBlock>

      {/* Card Skeleton Preview */}
      <SettingsGridBlock title="Card Skeleton Preview">
        <div className="col-span-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Preview of how card skeletons will appear with current settings.
          </p>

          <div className="p-4 rounded-lg border bg-card">
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <SkeletonCard animation={settings.skeleton.defaultAnimation} />
              <SkeletonCard animation={settings.skeleton.defaultAnimation} />
            </div>
          </div>
        </div>
      </SettingsGridBlock>
    </SettingsSection>
  );
}

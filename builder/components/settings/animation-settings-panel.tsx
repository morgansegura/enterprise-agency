"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  Play,
  Zap,
  Timer,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  Heart,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface TimingFunctions {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  elastic: string;
}

export interface AnimationPreset {
  duration: string;
  timing: string;
  delay?: string;
}

export interface SlidePreset extends AnimationPreset {
  distance: string;
}

export interface ScalePreset extends AnimationPreset {
  from?: string;
  to?: string;
}

export interface AnimationPresets {
  fadeIn: AnimationPreset;
  fadeOut: AnimationPreset;
  slideUp: SlidePreset;
  slideDown: SlidePreset;
  slideLeft: SlidePreset;
  slideRight: SlidePreset;
  scaleIn: ScalePreset;
  scaleOut: ScalePreset;
  bounce: AnimationPreset;
  pulse: AnimationPreset;
  spin: AnimationPreset;
}

export interface AnimationSettingsData {
  timing: TimingFunctions;
  presets: AnimationPresets;
  reducedMotion: boolean;
  defaultDuration: string;
  defaultTiming: string;
}

interface AnimationSettingsPanelProps {
  animation: AnimationSettingsData;
  onChange: (animation: AnimationSettingsData) => void;
  className?: string;
}

// ============================================================================
// Defaults
// ============================================================================

export const defaultAnimationSettings: AnimationSettingsData = {
  timing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
  },
  presets: {
    fadeIn: { duration: "200", timing: "easeOut" },
    fadeOut: { duration: "150", timing: "easeIn" },
    slideUp: { duration: "300", timing: "easeOut", distance: "16" },
    slideDown: { duration: "300", timing: "easeOut", distance: "16" },
    slideLeft: { duration: "300", timing: "easeOut", distance: "16" },
    slideRight: { duration: "300", timing: "easeOut", distance: "16" },
    scaleIn: { duration: "200", timing: "easeOut", from: "0.95" },
    scaleOut: { duration: "150", timing: "easeIn", to: "0.95" },
    bounce: { duration: "500", timing: "bounce" },
    pulse: { duration: "1000", timing: "easeInOut" },
    spin: { duration: "1000", timing: "linear" },
  },
  reducedMotion: false,
  defaultDuration: "200",
  defaultTiming: "easeOut",
};

// ============================================================================
// Options
// ============================================================================

const durationOptions = [
  { value: "0", label: "0ms", description: "Instant" },
  { value: "75", label: "75ms", description: "Very fast" },
  { value: "100", label: "100ms", description: "Fast" },
  { value: "150", label: "150ms", description: "Quick" },
  { value: "200", label: "200ms", description: "Normal" },
  { value: "300", label: "300ms", description: "Moderate" },
  { value: "500", label: "500ms", description: "Slow" },
  { value: "700", label: "700ms", description: "Slower" },
  { value: "1000", label: "1000ms", description: "1 second" },
];

const timingOptions = [
  { value: "linear", label: "Linear", description: "Constant speed" },
  { value: "easeIn", label: "Ease In", description: "Start slow" },
  { value: "easeOut", label: "Ease Out", description: "End slow" },
  { value: "easeInOut", label: "Ease In-Out", description: "Smooth" },
  { value: "bounce", label: "Bounce", description: "Bouncy" },
  { value: "elastic", label: "Elastic", description: "Springy" },
];

const distanceOptions = [
  { value: "4", label: "4px", description: "Subtle" },
  { value: "8", label: "8px", description: "Small" },
  { value: "12", label: "12px", description: "Medium" },
  { value: "16", label: "16px", description: "Normal" },
  { value: "24", label: "24px", description: "Large" },
  { value: "32", label: "32px", description: "Extra large" },
];

const scaleOptions = [
  { value: "0.9", label: "90%", description: "Significant" },
  { value: "0.95", label: "95%", description: "Subtle" },
  { value: "0.98", label: "98%", description: "Very subtle" },
  { value: "1.02", label: "102%", description: "Slight grow" },
  { value: "1.05", label: "105%", description: "Grow" },
  { value: "1.1", label: "110%", description: "Large grow" },
];

// ============================================================================
// Animation Preview Component
// ============================================================================

interface AnimationPreviewProps {
  presetKey: keyof AnimationPresets;
  animation: AnimationSettingsData;
}

function AnimationPreview({ presetKey, animation }: AnimationPreviewProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const preset = animation.presets[presetKey];
  const timingValue =
    animation.timing[preset.timing as keyof TimingFunctions] || preset.timing;
  const duration = parseInt(preset.duration);

  const playAnimation = () => {
    setIsPlaying(true);
    setKey((k) => k + 1);
    setTimeout(() => setIsPlaying(false), duration + 100);
  };

  const getAnimationStyle = (): React.CSSProperties => {
    if (!isPlaying) return {};

    const baseStyle: React.CSSProperties = {
      animationDuration: `${duration}ms`,
      animationTimingFunction: timingValue,
      animationFillMode: "forwards",
    };

    switch (presetKey) {
      case "fadeIn":
        return { ...baseStyle, animationName: "fadeIn" };
      case "fadeOut":
        return { ...baseStyle, animationName: "fadeOut" };
      case "slideUp":
        return { ...baseStyle, animationName: "slideUp" };
      case "slideDown":
        return { ...baseStyle, animationName: "slideDown" };
      case "slideLeft":
        return { ...baseStyle, animationName: "slideLeft" };
      case "slideRight":
        return { ...baseStyle, animationName: "slideRight" };
      case "scaleIn":
        return { ...baseStyle, animationName: "scaleIn" };
      case "scaleOut":
        return { ...baseStyle, animationName: "scaleOut" };
      case "bounce":
        return { ...baseStyle, animationName: "bounce" };
      case "pulse":
        return {
          ...baseStyle,
          animationName: "pulse",
          animationIterationCount: "2",
        };
      case "spin":
        return { ...baseStyle, animationName: "spin" };
      default:
        return baseStyle;
    }
  };

  const getPreviewIcon = () => {
    switch (presetKey) {
      case "fadeIn":
      case "fadeOut":
        return <Sparkles className="h-5 w-5" />;
      case "slideUp":
        return <ArrowUp className="h-5 w-5" />;
      case "slideDown":
        return <ArrowDown className="h-5 w-5" />;
      case "slideLeft":
        return <ArrowLeft className="h-5 w-5" />;
      case "slideRight":
        return <ArrowRight className="h-5 w-5" />;
      case "scaleIn":
        return <ZoomIn className="h-5 w-5" />;
      case "scaleOut":
        return <ZoomOut className="h-5 w-5" />;
      case "bounce":
        return <Zap className="h-5 w-5" />;
      case "pulse":
        return <Heart className="h-5 w-5" />;
      case "spin":
        return <Loader2 className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={playAnimation}
        disabled={isPlaying}
        className="p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
      >
        <div key={key} style={getAnimationStyle()}>
          {getPreviewIcon()}
        </div>
      </button>
      <div className="flex-1">
        <span className="text-sm font-medium capitalize">
          {presetKey.replace(/([A-Z])/g, " $1").trim()}
        </span>
        <p className="text-xs text-muted-foreground">
          {preset.duration}ms • {preset.timing}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={playAnimation}
        disabled={isPlaying}
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ============================================================================
// Preset Editor Component
// ============================================================================

interface PresetEditorProps {
  label: string;
  preset: AnimationPreset | SlidePreset | ScalePreset;
  onChange: (preset: AnimationPreset | SlidePreset | ScalePreset) => void;
  showDistance?: boolean;
  showScale?: boolean;
  scaleType?: "from" | "to";
}

function PresetEditor({
  label,
  preset,
  onChange,
  showDistance,
  showScale,
  scaleType,
}: PresetEditorProps) {
  return (
    <div className="space-y-3 p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Duration</Label>
          <Select
            value={preset.duration}
            onValueChange={(v) => onChange({ ...preset, duration: v })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Timing</Label>
          <Select
            value={preset.timing}
            onValueChange={(v) => onChange({ ...preset, timing: v })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showDistance && "distance" in preset && (
          <div className="space-y-1 col-span-2">
            <Label className="text-xs text-muted-foreground">Distance</Label>
            <Select
              value={(preset as SlidePreset).distance}
              onValueChange={(v) =>
                onChange({ ...preset, distance: v } as SlidePreset)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {distanceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label} - {opt.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showScale && scaleType && (
          <div className="space-y-1 col-span-2">
            <Label className="text-xs text-muted-foreground">
              Scale {scaleType === "from" ? "From" : "To"}
            </Label>
            <Select
              value={
                scaleType === "from"
                  ? (preset as ScalePreset).from || "0.95"
                  : (preset as ScalePreset).to || "0.95"
              }
              onValueChange={(v) =>
                onChange({
                  ...preset,
                  [scaleType]: v,
                } as ScalePreset)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label} - {opt.description}
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
// Main Component
// ============================================================================

export function AnimationSettingsPanel({
  animation,
  onChange,
  className,
}: AnimationSettingsPanelProps) {
  // Update handlers
  const updatePreset = (
    key: keyof AnimationPresets,
    preset: AnimationPreset | SlidePreset | ScalePreset,
  ) => {
    onChange({
      ...animation,
      presets: { ...animation.presets, [key]: preset },
    });
  };

  const resetToDefaults = () => {
    onChange(defaultAnimationSettings);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* CSS Keyframes for previews */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(16px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-16px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets" className="gap-1.5">
            <Sparkles className="h-4 w-4" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Timer className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Presets Tab */}
        <TabsContent value="presets" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </Button>
          </div>

          {/* Fade Animations */}
          <CollapsibleSection
            title="Fade Animations"
            icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-3">
              <PresetEditor
                label="Fade In"
                preset={animation.presets.fadeIn}
                onChange={(p) => updatePreset("fadeIn", p)}
              />
              <PresetEditor
                label="Fade Out"
                preset={animation.presets.fadeOut}
                onChange={(p) => updatePreset("fadeOut", p)}
              />
            </div>
          </CollapsibleSection>

          {/* Slide Animations */}
          <CollapsibleSection
            title="Slide Animations"
            icon={<ArrowUp className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-3">
              <PresetEditor
                label="Slide Up"
                preset={animation.presets.slideUp}
                onChange={(p) => updatePreset("slideUp", p)}
                showDistance
              />
              <PresetEditor
                label="Slide Down"
                preset={animation.presets.slideDown}
                onChange={(p) => updatePreset("slideDown", p)}
                showDistance
              />
              <PresetEditor
                label="Slide Left"
                preset={animation.presets.slideLeft}
                onChange={(p) => updatePreset("slideLeft", p)}
                showDistance
              />
              <PresetEditor
                label="Slide Right"
                preset={animation.presets.slideRight}
                onChange={(p) => updatePreset("slideRight", p)}
                showDistance
              />
            </div>
          </CollapsibleSection>

          {/* Scale Animations */}
          <CollapsibleSection
            title="Scale Animations"
            icon={<ZoomIn className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-3">
              <PresetEditor
                label="Scale In"
                preset={animation.presets.scaleIn}
                onChange={(p) => updatePreset("scaleIn", p)}
                showScale
                scaleType="from"
              />
              <PresetEditor
                label="Scale Out"
                preset={animation.presets.scaleOut}
                onChange={(p) => updatePreset("scaleOut", p)}
                showScale
                scaleType="to"
              />
            </div>
          </CollapsibleSection>

          {/* Other Animations */}
          <CollapsibleSection
            title="Other Animations"
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              <PresetEditor
                label="Bounce"
                preset={animation.presets.bounce}
                onChange={(p) => updatePreset("bounce", p)}
              />
              <PresetEditor
                label="Pulse"
                preset={animation.presets.pulse}
                onChange={(p) => updatePreset("pulse", p)}
              />
              <PresetEditor
                label="Spin"
                preset={animation.presets.spin}
                onChange={(p) => updatePreset("spin", p)}
              />
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Global Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label>Reduced Motion</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Respect user preference for reduced motion
                </p>
              </div>
              <Switch
                checked={animation.reducedMotion}
                onCheckedChange={(v) =>
                  onChange({ ...animation, reducedMotion: v })
                }
              />
            </div>

            <div className="space-y-3 p-4 rounded-lg border">
              <Label>Default Duration</Label>
              <Select
                value={animation.defaultDuration}
                onValueChange={(v) =>
                  onChange({ ...animation, defaultDuration: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 p-4 rounded-lg border">
              <Label>Default Timing Function</Label>
              <Select
                value={animation.defaultTiming}
                onValueChange={(v) =>
                  onChange({ ...animation, defaultTiming: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timingOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timing Function Curves */}
          <CollapsibleSection
            title="Custom Timing Functions"
            icon={<Timer className="h-4 w-4 text-muted-foreground" />}
            defaultOpen={false}
          >
            <div className="space-y-3">
              {(
                Object.keys(animation.timing) as Array<keyof TimingFunctions>
              ).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <Label className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {animation.timing[key]}
                  </code>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4 mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Click on any animation to preview it. All animations use your
            configured settings.
          </p>
          <div className="space-y-3">
            {(
              Object.keys(animation.presets) as Array<keyof AnimationPresets>
            ).map((key) => (
              <AnimationPreview
                key={key}
                presetKey={key}
                animation={animation}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

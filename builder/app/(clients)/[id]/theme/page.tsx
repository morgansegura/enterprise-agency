"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TierGate } from "@/components/tier";
import { useTenant } from "@/lib/hooks/use-tenants";
import {
  useTenantTokens,
  useUpdateTenantTokens,
} from "@/lib/hooks/use-tenant-tokens";
import { platformDefaults, generateTenantCSS } from "@/lib/tokens";
import type { ColorScale, DesignTokens } from "@/lib/tokens";
import { toast } from "sonner";
import { Palette, Type, Ruler, Sparkles, Eye } from "lucide-react";
import { FormItem } from "@/components/ui/form";

export default function ThemePage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant } = useTenant(tenantId);
  const { data: existingTokens, isLoading } = useTenantTokens(tenantId);
  const updateTokens = useUpdateTenantTokens();

  // Initialize tokens from API or use platform defaults
  const [customTokens, setCustomTokens] = React.useState<Partial<DesignTokens>>(
    {},
  );
  const [useCustom, setUseCustom] = React.useState(false);

  React.useEffect(() => {
    if (existingTokens && Object.keys(existingTokens).length > 0) {
      setCustomTokens(existingTokens);
      setUseCustom(true);
    }
  }, [existingTokens]);

  // Get active tokens (custom or platform defaults)
  const activeTokens = useCustom ? customTokens : platformDefaults;

  const handleColorChange = (
    colorName: keyof DesignTokens["colors"],
    shade: keyof ColorScale,
    value: string,
  ) => {
    setCustomTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: {
          ...(prev.colors?.[colorName] || platformDefaults.colors[colorName]),
          [shade]: value,
        },
      },
    }));
  };

  const handleFontFamilyChange = (
    type: "sans" | "serif" | "mono",
    value: string,
  ) => {
    setCustomTokens((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontFamily: {
          ...(prev.typography?.fontFamily ||
            platformDefaults.typography.fontFamily),
          [type]: value.split(",").map((f) => f.trim()),
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateTokens.mutateAsync({
        tenantId,
        tokens: customTokens,
      });
      setUseCustom(true);
      toast.success("Theme saved successfully!");
    } catch (error) {
      toast.error("Failed to save theme", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleReset = async () => {
    try {
      await updateTokens.mutateAsync({
        tenantId,
        tokens: {},
      });
      setCustomTokens({});
      setUseCustom(false);
      toast.info("Theme reset to platform defaults");
    } catch (error) {
      toast.error("Failed to reset theme", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const generatedCSS = React.useMemo(() => {
    return generateTenantCSS(useCustom ? customTokens : undefined);
  }, [customTokens, useCustom]);

  return (
    <TierGate tenantId={tenantId} requiredTier="BUILDER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Theme Manager</h1>
            <p className="text-muted-foreground mt-1">
              Customize your site's design tokens
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updateTokens.isPending || isLoading}
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateTokens.isPending || isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {updateTokens.isPending ? "Saving..." : "Save Theme"}
            </Button>
          </div>
        </div>

        <FormItem className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
          <Input
            type="checkbox"
            id="use-custom"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <Label htmlFor="use-custom" className="cursor-pointer">
            Use custom theme (uncheck to preview platform defaults)
          </Label>
        </FormItem>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="colors">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="h-4 w-4 mr-2" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="spacing">
                  <Ruler className="h-4 w-4 mr-2" />
                  Spacing
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  CSS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <ColorScaleEditor
                  title="Primary Color"
                  scale={
                    (activeTokens.colors?.primary ||
                      platformDefaults.colors.primary) as ColorScale
                  }
                  onChange={(shade, value) =>
                    handleColorChange("primary", shade, value)
                  }
                  disabled={!useCustom}
                />
                <ColorScaleEditor
                  title="Secondary Color"
                  scale={
                    (activeTokens.colors?.secondary ||
                      platformDefaults.colors.secondary) as ColorScale
                  }
                  onChange={(shade, value) =>
                    handleColorChange("secondary", shade, value)
                  }
                  disabled={!useCustom}
                />
                <ColorScaleEditor
                  title="Accent Color"
                  scale={
                    (activeTokens.colors?.accent ||
                      platformDefaults.colors.accent) as ColorScale
                  }
                  onChange={(shade, value) =>
                    handleColorChange("accent", shade, value)
                  }
                  disabled={!useCustom}
                />
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Font Families</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormItem>
                      <Label htmlFor="font-sans">Sans Serif</Label>
                      <Input
                        id="font-sans"
                        value={
                          activeTokens.typography?.fontFamily?.sans?.join(
                            ", ",
                          ) ||
                          platformDefaults.typography.fontFamily.sans.join(", ")
                        }
                        onChange={(e) =>
                          handleFontFamilyChange("sans", e.target.value)
                        }
                        disabled={!useCustom}
                        placeholder="Inter, system-ui, sans-serif"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="font-serif">Serif</Label>
                      <Input
                        id="font-serif"
                        value={
                          activeTokens.typography?.fontFamily?.serif?.join(
                            ", ",
                          ) ||
                          platformDefaults.typography.fontFamily.serif.join(
                            ", ",
                          )
                        }
                        onChange={(e) =>
                          handleFontFamilyChange("serif", e.target.value)
                        }
                        disabled={!useCustom}
                        placeholder="Georgia, Times, serif"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="font-mono">Monospace</Label>
                      <Input
                        id="font-mono"
                        value={
                          activeTokens.typography?.fontFamily?.mono?.join(
                            ", ",
                          ) ||
                          platformDefaults.typography.fontFamily.mono.join(", ")
                        }
                        onChange={(e) =>
                          handleFontFamilyChange("mono", e.target.value)
                        }
                        disabled={!useCustom}
                        placeholder="Menlo, Consolas, monospace"
                      />
                    </FormItem>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spacing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spacing Scale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Spacing tokens use the platform default scale. Custom
                      spacing will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated CSS Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                      {generatedCSS}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Primary Colors
                  </p>
                  <div className="flex gap-1">
                    {Object.entries(
                      (activeTokens.colors?.primary ||
                        platformDefaults.colors.primary) as ColorScale,
                    ).map(([shade, color]) => (
                      <div
                        key={shade}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: color }}
                        title={`${shade}: ${color}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Typography
                  </p>
                  <div
                    className="space-y-2"
                    style={{
                      fontFamily:
                        activeTokens.typography?.fontFamily?.sans?.join(", ") ||
                        platformDefaults.typography.fontFamily.sans.join(", "),
                    }}
                  >
                    <p className="text-xs">Extra Small Text</p>
                    <p className="text-sm">Small Text</p>
                    <p className="text-base">Base Text</p>
                    <p className="text-lg">Large Text</p>
                    <p className="text-xl">Extra Large Text</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TierGate>
  );
}

interface ColorScaleEditorProps {
  title: string;
  scale: ColorScale;
  onChange: (shade: keyof ColorScale, value: string) => void;
  disabled?: boolean;
}

function ColorScaleEditor({
  title,
  scale,
  onChange,
  disabled,
}: ColorScaleEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-11 gap-2">
          {Object.entries(scale).map(([shade, color]) => (
            <div key={shade} className="space-y-1">
              <Label htmlFor={`${title}-${shade}`} className="text-xs">
                {shade}
              </Label>
              <input
                id={`${title}-${shade}`}
                type="color"
                value={color}
                onChange={(e) =>
                  onChange(shade as unknown as keyof ColorScale, e.target.value)
                }
                disabled={disabled}
                className="w-full h-10 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

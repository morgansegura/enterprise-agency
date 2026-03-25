"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useFooter,
  useUpdateFooter,
  type FooterLayout,
  type FooterStyle,
  type FooterZones,
} from "@/lib/hooks/use-footers";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

import "./edit-footer.css";

// ============================================================================
// Layout configuration
// ============================================================================

const layoutOptions: { value: FooterLayout; label: string }[] = [
  { value: "SIMPLE", label: "Simple" },
  { value: "COLUMNS", label: "Columns" },
  { value: "STACKED", label: "Stacked" },
  { value: "MINIMAL", label: "Minimal" },
  { value: "CENTERED", label: "Centered" },
];

const paddingOptions = [
  { value: "0", label: "None" },
  { value: "1rem", label: "Small" },
  { value: "2rem", label: "Medium" },
  { value: "3rem", label: "Large" },
  { value: "4rem", label: "Extra Large" },
];

function getZoneLabels(layout: FooterLayout): string[] {
  switch (layout) {
    case "COLUMNS":
      return ["column1", "column2", "column3", "column4"];
    case "STACKED":
      return ["left", "center", "right", "bottom"];
    case "SIMPLE":
    case "MINIMAL":
    case "CENTERED":
    default:
      return ["center", "bottom"];
  }
}

// ============================================================================
// Component
// ============================================================================

export default function EditFooterPage({
  params,
}: {
  params: Promise<{ id: string; footerId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, footerId } = resolvedParams;
  const router = useRouter();
  const { toast } = useToast();

  const { data: footer, isLoading, error } = useFooter(id, footerId);
  const updateFooter = useUpdateFooter(id);

  // Local form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [layout, setLayout] = React.useState<FooterLayout>("SIMPLE");
  const [isDefault, setIsDefault] = React.useState(false);
  const [style, setStyle] = React.useState<FooterStyle>({});
  const [zones, setZones] = React.useState<FooterZones>({});
  const [initialized, setInitialized] = React.useState(false);

  // Sync from server data on first load
  React.useEffect(() => {
    if (footer && !initialized) {
      setName(footer.name);
      setSlug(footer.slug);
      setLayout(footer.layout);
      setIsDefault(footer.isDefault);
      setStyle(footer.style || {});
      setZones(footer.zones || {});
      setInitialized(true);
    }
  }, [footer, initialized]);

  const handleSave = () => {
    updateFooter.mutate(
      {
        id: footerId,
        data: { name, slug, layout, isDefault, style, zones },
      },
      {
        onSuccess: () => {
          toast.success(
            "Footer saved",
            `"${name}" has been updated successfully.`,
          );
        },
        onError: (err) => {
          const message =
            err instanceof Error ? err.message : "Failed to save footer";
          toast.error("Failed to save footer", message);
        },
      },
    );
  };

  const updateStyle = (key: keyof FooterStyle, value: string) => {
    setStyle((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const newSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(newSlug);
  };

  // Loading / error states
  if (isLoading) {
    return (
      <PageLayout
        title="Loading..."
        onBack={() => router.push(`/${id}/footers`)}
      >
        <div className="edit-footer-loading">
          <Loader2 className="edit-footer-spinner" />
          <p>Loading footer...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !footer) {
    return (
      <PageLayout title="Error" onBack={() => router.push(`/${id}/footers`)}>
        <div className="edit-footer-error">
          <p>Failed to load footer. It may have been deleted.</p>
          <Button
            variant="outline"
            onClick={() => router.push(`/${id}/footers`)}
          >
            Back to Footers
          </Button>
        </div>
      </PageLayout>
    );
  }

  const zoneLabels = getZoneLabels(layout);

  return (
    <PageLayout
      title={`Edit: ${name || "Footer"}`}
      description="Configure your footer layout and styling"
      onBack={() => router.push(`/${id}/footers`)}
      noPadding
      actions={
        <Button onClick={handleSave} disabled={updateFooter.isPending}>
          {updateFooter.isPending ? (
            <Loader2 className="edit-footer-spinner" />
          ) : (
            <Save className="edit-footer-save-icon" />
          )}
          {updateFooter.isPending ? "Saving..." : "Save"}
        </Button>
      }
    >
      <div className="edit-footer-layout">
        {/* Main canvas */}
        <div className="edit-footer-canvas">
          <div className="edit-footer-canvas-inner">
            <div
              className="edit-footer-preview"
              style={{
                backgroundColor: style.backgroundColor || "#1f2937",
                color: style.textColor || "#f9fafb",
                paddingTop: style.paddingY || "2rem",
                paddingBottom: style.paddingY || "2rem",
                paddingLeft: style.paddingX || "2rem",
                paddingRight: style.paddingX || "2rem",
                borderTop: style.borderTop || "none",
              }}
            >
              <div className="edit-footer-preview-label">
                {layout} Layout Preview
              </div>
              <div
                className={`edit-footer-zones edit-footer-zones-${layout.toLowerCase()}`}
              >
                {zoneLabels.map((zoneKey) => (
                  <FooterZoneEditor
                    key={zoneKey}
                    zoneKey={zoneKey}
                    zones={zones}
                    onUpdate={setZones}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <div className="edit-footer-settings scrollbar-y">
          {/* General */}
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="edit-footer-settings-fields">
              <div className="edit-footer-field">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Footer name"
                />
              </div>
              <div className="edit-footer-field">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="footer-slug"
                />
              </div>
              <div className="edit-footer-field">
                <Label>Layout</Label>
                <Select
                  value={layout}
                  onValueChange={(v) => setLayout(v as FooterLayout)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="edit-footer-toggle-row">
                <Label>Default Footer</Label>
                <Switch checked={isDefault} onCheckedChange={setIsDefault} />
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="edit-footer-settings-fields">
              <ColorPicker
                label="Background"
                value={style.backgroundColor || "#1f2937"}
                onChange={(v) => updateStyle("backgroundColor", v)}
              />
              <ColorPicker
                label="Text Color"
                value={style.textColor || "#f9fafb"}
                onChange={(v) => updateStyle("textColor", v)}
              />
            </CardContent>
          </Card>

          {/* Spacing */}
          <Card>
            <CardHeader>
              <CardTitle>Spacing</CardTitle>
            </CardHeader>
            <CardContent className="edit-footer-settings-fields">
              <div className="edit-footer-field">
                <Label>Vertical Padding</Label>
                <Select
                  value={style.paddingY || "2rem"}
                  onValueChange={(v) => updateStyle("paddingY", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paddingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="edit-footer-field">
                <Label>Horizontal Padding</Label>
                <Select
                  value={style.paddingX || "2rem"}
                  onValueChange={(v) => updateStyle("paddingX", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paddingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Border */}
          <Card>
            <CardHeader>
              <CardTitle>Border</CardTitle>
            </CardHeader>
            <CardContent className="edit-footer-settings-fields">
              <div className="edit-footer-toggle-row">
                <Label>Top Border</Label>
                <Switch
                  checked={!!style.borderTop && style.borderTop !== "none"}
                  onCheckedChange={(checked) =>
                    updateStyle(
                      "borderTop",
                      checked ? "1px solid rgba(255,255,255,0.1)" : "none",
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

// ============================================================================
// Zone Editor
// ============================================================================

function FooterZoneEditor({
  zoneKey,
  zones,
  onUpdate,
}: {
  zoneKey: string;
  zones: FooterZones;
  onUpdate: React.Dispatch<React.SetStateAction<FooterZones>>;
}) {
  const zoneData = (zones as Record<string, { blocks?: { html?: string }[] }>)[
    zoneKey
  ];
  const content = zoneData?.blocks?.[0]?.html || "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate((prev) => ({
      ...prev,
      [zoneKey]: {
        ...(((prev as Record<string, unknown>)[zoneKey] as Record<
          string,
          unknown
        >) || {}),
        blocks: [{ html: e.target.value }],
      },
    }));
  };

  const label = zoneKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="edit-footer-zone">
      <span className="edit-footer-zone-label">{label}</span>
      <textarea
        className="edit-footer-zone-input"
        value={content}
        onChange={handleChange}
        placeholder={`${label} content...`}
        rows={3}
      />
    </div>
  );
}

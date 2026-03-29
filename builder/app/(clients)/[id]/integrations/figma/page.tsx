"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Download,
  Palette,
  Type,
  Check,
  ChevronRight,
  FileText,
  Frame,
} from "lucide-react";
import { useCreatePage } from "@/lib/hooks/use-pages";
import { useUpdateTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import {
  extractFileKey,
  fetchFigmaFile,
  extractColors,
  extractTextStyles,
  mapFigmaPageToSections,
  type FigmaFile,
  type FigmaNode,
  type FigmaColor,
  type FigmaTextStyle,
} from "@/lib/figma/figma-client";

import "./figma.css";

type ImportStep = "connect" | "preview" | "importing" | "done";

/** Flat list of importable frames with their parent page context */
interface ImportableFrame {
  id: string;
  name: string;
  pageName: string;
  pageId: string;
  node: FigmaNode;
  childCount: number;
}

/**
 * Build TenantTokens from extracted Figma design data.
 */
function buildThemeTokens(
  colors: FigmaColor[],
  textStyles: FigmaTextStyle[],
) {
  const tokens: Record<string, unknown> = {};

  if (colors.length > 0) {
    const isNeutral = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      return luminance > 0.92 || luminance < 0.08;
    };

    const chromatic = colors.filter((c) => !isNeutral(c.hex));
    const light = colors.filter((c) => {
      const r = parseInt(c.hex.slice(1, 3), 16);
      const g = parseInt(c.hex.slice(3, 5), 16);
      const b = parseInt(c.hex.slice(5, 7), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) / 255 > 0.85;
    });
    const dark = colors.filter((c) => {
      const r = parseInt(c.hex.slice(1, 3), 16);
      const g = parseInt(c.hex.slice(3, 5), 16);
      const b = parseInt(c.hex.slice(5, 7), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) / 255 < 0.2;
    });

    tokens.colors = {
      primaryHex: chromatic[0]?.hex || "#0052cc",
      accentHex: chromatic[1]?.hex || chromatic[0]?.hex || "#0065ff",
      background: light[0]?.hex || "#ffffff",
      foreground: dark[0]?.hex || "#172b4d",
    };
  }

  if (textStyles.length > 0) {
    const sorted = [...textStyles].sort((a, b) => b.fontSize - a.fontSize);
    const headingFont = sorted[0]?.fontFamily || "Inter";
    const bodyCandidate = textStyles.find(
      (s) => s.fontSize >= 14 && s.fontSize <= 18,
    );
    const bodyFont =
      bodyCandidate?.fontFamily ||
      sorted[sorted.length - 1]?.fontFamily ||
      "Inter";

    tokens.fonts = {
      heading: { family: `'${headingFont}', sans-serif` },
      body: { family: `'${bodyFont}', sans-serif` },
    };
  }

  return tokens;
}

/**
 * Extract importable frames from Figma file.
 * Each top-level frame in each page becomes an importable item.
 */
function getImportableFrames(file: FigmaFile): ImportableFrame[] {
  const frames: ImportableFrame[] = [];

  for (const page of file.document.children || []) {
    const topFrames =
      page.children?.filter(
        (c) => c.type === "FRAME" || c.type === "COMPONENT",
      ) || [];

    for (const frame of topFrames) {
      frames.push({
        id: frame.id,
        name: frame.name,
        pageName: page.name,
        pageId: page.id,
        node: frame,
        childCount: frame.children?.length || 0,
      });
    }
  }

  return frames;
}

export default function FigmaImportPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.id as string;
  const createPage = useCreatePage(tenantId);
  const updateTokens = useUpdateTenantTokens();

  const [step, setStep] = React.useState<ImportStep>("connect");
  const [fileUrl, setFileUrl] = React.useState("");
  const [token, setToken] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("figma_token") || "";
    }
    return "";
  });

  // Persist token to localStorage
  const handleTokenChange = (value: string) => {
    setToken(value);
    if (value) localStorage.setItem("figma_token", value);
    else localStorage.removeItem("figma_token");
  };
  const [figmaFile, setFigmaFile] = React.useState<FigmaFile | null>(null);
  const [frames, setFrames] = React.useState<ImportableFrame[]>([]);
  const [colors, setColors] = React.useState<FigmaColor[]>([]);
  const [textStyles, setTextStyles] = React.useState<FigmaTextStyle[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFrames, setSelectedFrames] = React.useState<Set<string>>(
    new Set(),
  );
  const [applyTheme, setApplyTheme] = React.useState(true);
  const [expandedPages, setExpandedPages] = React.useState<Set<string>>(
    new Set(),
  );

  const handleConnect = async () => {
    const fileKey = extractFileKey(fileUrl);
    if (!fileKey) {
      toast.error("Invalid Figma URL. Use a file or design URL.");
      return;
    }
    if (!token) {
      toast.error("Figma API token is required.");
      return;
    }

    setLoading(true);
    try {
      const file = await fetchFigmaFile(fileKey, token);
      setFigmaFile(file);

      // Extract frames
      const importableFrames = getImportableFrames(file);
      setFrames(importableFrames);

      // Auto-expand all pages, auto-select all frames
      const pageIds = new Set<string>();
      const frameIds = new Set<string>();
      file.document.children?.forEach((page) => pageIds.add(page.id));
      importableFrames.forEach((f) => frameIds.add(f.id));
      setExpandedPages(pageIds);
      setSelectedFrames(frameIds);

      // Extract design tokens
      setColors(extractColors(file.document).slice(0, 20));
      setTextStyles(extractTextStyles(file.document).slice(0, 10));

      setStep("preview");
      toast.success(
        `Connected to "${file.name}" — ${importableFrames.length} frames found`,
      );
    } catch (error) {
      toast.error(
        `Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!figmaFile) return;

    setStep("importing");
    let imported = 0;
    const skipped: string[] = [];

    try {
      // 1. Apply theme tokens
      if (applyTheme && (colors.length > 0 || textStyles.length > 0)) {
        await updateTokens.mutateAsync({
          tenantId,
          tokens: buildThemeTokens(colors, textStyles),
        });
      }

      // 2. Import each selected frame as its own page
      const selected = frames.filter((f) => selectedFrames.has(f.id));

      for (const frame of selected) {
        const sections = mapFigmaPageToSections(frame.node);
        if (sections.length === 0) {
          skipped.push(`${frame.name} (no content)`);
          continue;
        }

        const baseSlug = frame.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const uniqueSuffix = Math.random().toString(36).slice(2, 6);

        try {
          await createPage.mutateAsync({
            title: frame.name,
            slug: `${baseSlug || "page"}-${uniqueSuffix}`,
            status: "draft",
            sections:
              sections as unknown as import("@/lib/hooks/use-pages").Section[],
          });
          imported++;
        } catch (err) {
          skipped.push(
            `${frame.name} (${err instanceof Error ? err.message : "failed"})`,
          );
        }
      }

      setStep("done");
      const parts = [];
      if (imported > 0) parts.push(`${imported} pages`);
      if (applyTheme) parts.push("theme tokens");
      toast.success(`Imported ${parts.join(" + ")} from Figma`);
      if (skipped.length > 0) {
        toast.info(`Skipped: ${skipped.join(", ")}`, { duration: 5000 });
      }
    } catch (error) {
      toast.error(
        `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setStep("preview");
    }
  };

  // Group frames by page
  const framesByPage = React.useMemo(() => {
    const map = new Map<string, { pageName: string; frames: ImportableFrame[] }>();
    for (const frame of frames) {
      if (!map.has(frame.pageId)) {
        map.set(frame.pageId, { pageName: frame.pageName, frames: [] });
      }
      map.get(frame.pageId)!.frames.push(frame);
    }
    return map;
  }, [frames]);

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageId)) next.delete(pageId);
      else next.add(pageId);
      return next;
    });
  };

  const toggleAllFramesInPage = (pageId: string, checked: boolean) => {
    const pageFrames = framesByPage.get(pageId)?.frames || [];
    setSelectedFrames((prev) => {
      const next = new Set(prev);
      for (const f of pageFrames) {
        if (checked) next.add(f.id);
        else next.delete(f.id);
      }
      return next;
    });
  };

  const toggleFrame = (frameId: string) => {
    setSelectedFrames((prev) => {
      const next = new Set(prev);
      if (next.has(frameId)) next.delete(frameId);
      else next.add(frameId);
      return next;
    });
  };

  return (
    <PageLayout
      title="Import from Figma"
      description="Import page layouts and design tokens from a Figma file"
      backHref={`/${tenantId}/settings`}
      maxWidth="md"
    >
      <div className="figma-import">
        {/* Step 1: Connect */}
        {step === "connect" && (
          <div className="figma-step">
            <div className="figma-step-header">
              <h3 className="figma-step-title">Connect your Figma file</h3>
              <p className="figma-step-desc">
                Paste your Figma file URL and API token to import the design.
              </p>
            </div>
            <div className="figma-fields">
              <div className="figma-field">
                <label className="figma-label">Figma File URL</label>
                <Input
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://www.figma.com/design/..."
                />
              </div>
              <div className="figma-field">
                <label className="figma-label">Personal Access Token</label>
                <Input
                  type="password"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="figd_..."
                />
                <p className="figma-hint">
                  figma.com/settings → Security → Personal access tokens
                </p>
              </div>
            </div>
            <Button
              onClick={handleConnect}
              disabled={loading || !fileUrl || !token}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Connecting..." : "Connect to Figma"}
            </Button>
          </div>
        )}

        {/* Step 2: Preview — frame picker */}
        {step === "preview" && figmaFile && (
          <div className="figma-step">
            <div className="figma-step-header">
              <h3 className="figma-step-title">{figmaFile.name}</h3>
              <p className="figma-step-desc">
                Pick the frames you want to import. Each frame becomes a page.
              </p>
            </div>

            {/* Apply as Theme */}
            <div className="figma-section">
              <label className="figma-page-item">
                <input
                  type="checkbox"
                  checked={applyTheme}
                  onChange={(e) => setApplyTheme(e.target.checked)}
                />
                <div>
                  <span className="figma-label">Apply as site theme</span>
                  <p className="figma-hint">
                    Extracts colors and fonts → replaces current theme
                  </p>
                </div>
              </label>
            </div>

            {/* Frame tree — grouped by page */}
            <div className="figma-section">
              <h4 className="figma-section-title">
                <Download className="size-4" />
                Frames ({frames.length})
              </h4>
              <div className="figma-frame-tree">
                {Array.from(framesByPage.entries()).map(
                  ([pageId, { pageName, frames: pageFrames }]) => {
                    const isExpanded = expandedPages.has(pageId);
                    const allSelected = pageFrames.every((f) =>
                      selectedFrames.has(f.id),
                    );
                    const someSelected = pageFrames.some((f) =>
                      selectedFrames.has(f.id),
                    );

                    return (
                      <div key={pageId} className="figma-frame-page">
                        <div className="figma-frame-page-header">
                          <button
                            type="button"
                            className="figma-frame-page-toggle"
                            onClick={() => togglePage(pageId)}
                          >
                            <ChevronRight
                              className="figma-frame-chevron"
                              data-expanded={isExpanded || undefined}
                            />
                          </button>
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el)
                                el.indeterminate =
                                  someSelected && !allSelected;
                            }}
                            onChange={(e) =>
                              toggleAllFramesInPage(pageId, e.target.checked)
                            }
                          />
                          <FileText className="size-3.5 text-(--el-400)" />
                          <span className="figma-frame-page-name">
                            {pageName}
                          </span>
                          <span className="figma-page-count">
                            {pageFrames.length} frames
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="figma-frame-list">
                            {pageFrames.map((frame) => (
                              <label
                                key={frame.id}
                                className="figma-frame-item"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFrames.has(frame.id)}
                                  onChange={() => toggleFrame(frame.id)}
                                />
                                <Frame className="size-3.5 text-(--el-400)" />
                                <span className="figma-frame-name">
                                  {frame.name}
                                </span>
                                <span className="figma-page-count">
                                  {frame.childCount} layers
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && applyTheme && (
              <div className="figma-section">
                <h4 className="figma-section-title">
                  <Palette className="size-4" />
                  Colors ({colors.length})
                  <span className="figma-badge">Will apply</span>
                </h4>
                <div className="figma-colors">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className="figma-color-swatch"
                      title={color.hex}
                    >
                      <div
                        className="figma-color-dot"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="figma-color-hex">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Styles */}
            {textStyles.length > 0 && applyTheme && (
              <div className="figma-section">
                <h4 className="figma-section-title">
                  <Type className="size-4" />
                  Typography ({textStyles.length})
                  <span className="figma-badge">Will apply</span>
                </h4>
                <div className="figma-text-styles">
                  {textStyles.map((style, i) => (
                    <div key={i} className="figma-text-style">
                      <span
                        style={{
                          fontFamily: style.fontFamily,
                          fontSize: Math.min(style.fontSize, 24),
                          fontWeight: style.fontWeight,
                        }}
                      >
                        {style.fontFamily}
                      </span>
                      <span className="figma-text-meta">
                        {style.fontSize}px · {style.fontWeight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="figma-actions">
              <Button variant="outline" onClick={() => setStep("connect")}>
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedFrames.size === 0 && !applyTheme}
              >
                <Download className="size-4" />
                Import {selectedFrames.size} Frames
                {applyTheme ? " + Theme" : ""}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === "importing" && (
          <div className="figma-step figma-step-center">
            <Loader2 className="size-8 animate-spin text-(--accent-primary)" />
            <p className="figma-step-title">Importing from Figma...</p>
            <p className="figma-step-desc">
              {applyTheme
                ? "Applying theme tokens and creating pages."
                : "Creating pages and mapping blocks."}
            </p>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="figma-step figma-step-center">
            <div className="figma-done-icon">
              <Check className="size-6" />
            </div>
            <p className="figma-step-title">Import Complete</p>
            <p className="figma-step-desc">
              {applyTheme
                ? "Theme applied and pages created from your Figma design."
                : "Pages created from selected frames."}
            </p>
            <div className="figma-actions">
              {applyTheme && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${tenantId}/theme`)}
                >
                  Review Theme
                </Button>
              )}
              <Button onClick={() => router.push(`/${tenantId}/pages`)}>
                Go to Pages
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

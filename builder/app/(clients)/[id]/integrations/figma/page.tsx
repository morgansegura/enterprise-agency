"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Palette, Type } from "lucide-react";
import { useCreatePage } from "@/lib/hooks/use-pages";
import {
  extractFileKey,
  fetchFigmaFile,
  extractColors,
  extractTextStyles,
  mapFigmaPageToSections,
  type FigmaFile,
  type FigmaColor,
  type FigmaTextStyle,
} from "@/lib/figma/figma-client";

import "./figma.css";

type ImportStep = "connect" | "preview" | "importing" | "done";

export default function FigmaImportPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.id as string;
  const createPage = useCreatePage(tenantId);

  const [step, setStep] = React.useState<ImportStep>("connect");
  const [fileUrl, setFileUrl] = React.useState("");
  const [token, setToken] = React.useState("");
  const [figmaFile, setFigmaFile] = React.useState<FigmaFile | null>(null);
  const [colors, setColors] = React.useState<FigmaColor[]>([]);
  const [textStyles, setTextStyles] = React.useState<FigmaTextStyle[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedPages, setSelectedPages] = React.useState<Set<string>>(
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

      // Extract design tokens
      const extractedColors = extractColors(file.document);
      setColors(extractedColors.slice(0, 20)); // Top 20 colors

      const extractedStyles = extractTextStyles(file.document);
      setTextStyles(extractedStyles.slice(0, 10)); // Top 10 text styles

      // Auto-select all pages
      const pageIds = new Set<string>();
      file.document.children?.forEach((page) => pageIds.add(page.id));
      setSelectedPages(pageIds);

      setStep("preview");
      toast.success(`Connected to "${file.name}"`);
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

    try {
      const pages =
        figmaFile.document.children?.filter((p) =>
          selectedPages.has(p.id),
        ) || [];

      for (const page of pages) {
        const sections = mapFigmaPageToSections(page);
        if (sections.length === 0) continue;

        const slug = page.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        await createPage.mutateAsync({
          title: page.name,
          slug: slug || `page-${Date.now()}`,
          status: "draft",
          sections: sections as unknown as import("@/lib/hooks/use-pages").Section[],
        });

        imported++;
      }

      setStep("done");
      toast.success(`Imported ${imported} pages from Figma`);
    } catch (error) {
      toast.error(
        `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setStep("preview");
    }
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
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="figd_..."
                />
                <p className="figma-hint">
                  Get your token from Figma → Settings → Personal access tokens
                </p>
              </div>
            </div>
            <Button onClick={handleConnect} disabled={loading || !fileUrl || !token}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Connecting..." : "Connect to Figma"}
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && figmaFile && (
          <div className="figma-step">
            <div className="figma-step-header">
              <h3 className="figma-step-title">{figmaFile.name}</h3>
              <p className="figma-step-desc">
                Select pages to import and review extracted design tokens.
              </p>
            </div>

            {/* Pages */}
            <div className="figma-section">
              <h4 className="figma-section-title">
                <Download className="size-4" />
                Pages ({figmaFile.document.children?.length || 0})
              </h4>
              <div className="figma-pages">
                {figmaFile.document.children?.map((page) => (
                  <label key={page.id} className="figma-page-item">
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.id)}
                      onChange={(e) => {
                        const next = new Set(selectedPages);
                        if (e.target.checked) next.add(page.id);
                        else next.delete(page.id);
                        setSelectedPages(next);
                      }}
                    />
                    <span>{page.name}</span>
                    <span className="figma-page-count">
                      {page.children?.length || 0} frames
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="figma-section">
                <h4 className="figma-section-title">
                  <Palette className="size-4" />
                  Colors ({colors.length})
                </h4>
                <div className="figma-colors">
                  {colors.map((color, i) => (
                    <div key={i} className="figma-color-swatch" title={color.hex}>
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
            {textStyles.length > 0 && (
              <div className="figma-section">
                <h4 className="figma-section-title">
                  <Type className="size-4" />
                  Typography ({textStyles.length})
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
                disabled={selectedPages.size === 0}
              >
                <Download className="size-4" />
                Import {selectedPages.size} Pages
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
              Creating pages and mapping blocks. This may take a moment.
            </p>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="figma-step figma-step-center">
            <div className="figma-done-icon">✓</div>
            <p className="figma-step-title">Import Complete</p>
            <p className="figma-step-desc">
              Your pages have been created. Edit them in the page editor.
            </p>
            <Button onClick={() => router.push(`/${tenantId}/pages`)}>
              Go to Pages
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

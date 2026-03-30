"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useFooters,
  useCreateFooter,
  useDeleteFooter,
  useDuplicateFooter,
  useSaveFooterToLibrary,
  type Footer,
} from "@/lib/hooks/use-footers";
import {
  ContentList,
  type ColumnDef,
  type MenuAction,
} from "@/components/layout/content-list";
import { PanelBottom, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

import "./footers.css";

const FOOTER_TEMPLATES = [
  {
    name: "Simple",
    description: "Logo, links, copyright",
    layout: "SIMPLE" as const,
    preview: "logo — links — © 2026",
    style: { backgroundColor: "#1a1a2e", textColor: "#ffffff", padding: "lg" },
  },
  {
    name: "4 Columns",
    description: "Full column layout with categories",
    layout: "COLUMNS" as const,
    preview: "col1 | col2 | col3 | col4",
    style: { backgroundColor: "#111827", textColor: "#d1d5db", padding: "xl" },
  },
  {
    name: "Centered",
    description: "Centered logo and links",
    layout: "CENTERED" as const,
    preview: "——— centered ———",
    style: { backgroundColor: "#ffffff", textColor: "#374151", padding: "lg" },
  },
  {
    name: "Minimal",
    description: "Compact single-line footer",
    layout: "MINIMAL" as const,
    preview: "© company — privacy — terms",
    style: { backgroundColor: "#f9fafb", textColor: "#6b7280", padding: "sm" },
  },
  {
    name: "Dark Modern",
    description: "Dark gradient with columns",
    layout: "COLUMNS" as const,
    preview: "col1 | col2 | col3",
    style: { backgroundColor: "#0f172a", textColor: "#94a3b8", padding: "xl" },
  },
  {
    name: "Stacked",
    description: "Vertically stacked sections",
    layout: "STACKED" as const,
    preview: "logo → links → social → ©",
    style: { backgroundColor: "#1e293b", textColor: "#e2e8f0", padding: "lg" },
  },
];

const layoutLabels: Record<string, string> = {
  SIMPLE: "Simple",
  COLUMNS: "Columns",
  STACKED: "Stacked",
  MINIMAL: "Minimal",
  CENTERED: "Centered",
};

type FooterItem = Footer & { title: string };

export default function FootersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: footers, isLoading, error } = useFooters(id);
  const createFooter = useCreateFooter(id);
  const deleteFooter = useDeleteFooter(id);
  const duplicateFooter = useDuplicateFooter(id);
  const saveToLibrary = useSaveFooterToLibrary(id);

  const handleCreateFromTemplate = async (template: typeof FOOTER_TEMPLATES[number]) => {
    try {
      const result = await createFooter.mutateAsync({
        name: template.name,
        slug: template.name.toLowerCase().replace(/\s+/g, "-"),
        layout: template.layout,
        style: template.style,
      });
      toast.success(`"${template.name}" footer created`);
      router.push(`/${id}/footers/${result.id}/edit`);
    } catch {
      toast.error("Failed to create footer");
    }
  };

  const footerItems = React.useMemo(
    () => footers?.map((f) => ({ ...f, title: f.name })) || undefined,
    [footers],
  );

  const handleDelete = async (footer: FooterItem) => {
    if (footer.isDefault) {
      toast.error(
        "Cannot delete the default footer. Set another as default first.",
      );
      return;
    }
    if (!confirm(`Delete "${footer.name}"? This action cannot be undone.`))
      return;
    try {
      await deleteFooter.mutateAsync(footer.id);
      toast.success(`"${footer.name}" deleted`);
    } catch {
      toast.error("Failed to delete footer");
    }
  };

  const handleDuplicate = async (footer: FooterItem) => {
    try {
      await duplicateFooter.mutateAsync({ id: footer.id });
      toast.success(`"${footer.name}" duplicated`);
    } catch {
      toast.error("Failed to duplicate footer");
    }
  };

  const handleSaveToLibrary = async (footer: FooterItem) => {
    try {
      await saveToLibrary.mutateAsync({ id: footer.id });
      toast.success("Footer saved to library");
    } catch {
      toast.error("Failed to save to library");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "\u2014";
    const d = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const extraActions: MenuAction<FooterItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  const columns: ColumnDef<FooterItem>[] = [
    {
      key: "name",
      header: "Name",
      headerClassName: "content-table-header-cell-title",
      cellClassName: "content-table-cell-title",
      render: (f) => (
        <span className="content-table-cell-title-text">{f.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      headerClassName: "content-table-header-cell-slug",
      cellClassName: "content-table-cell-slug",
      render: (f) => (
        <span className="content-table-cell-slug-text">/{f.slug}</span>
      ),
    },
    {
      key: "layout",
      header: "Layout",
      headerClassName: "footers-col-layout",
      cellClassName: "footers-col-layout",
      render: (f) => (
        <span className="footers-layout-text">
          {layoutLabels[f.layout] || f.layout}
        </span>
      ),
    },
    {
      key: "default",
      header: "Default",
      headerClassName: "footers-col-default",
      cellClassName: "footers-col-default",
      render: (f) =>
        f.isDefault ? (
          <span className="footers-default-badge">Default</span>
        ) : null,
    },
    {
      key: "updated",
      header: "Updated",
      headerClassName: "content-table-header-cell-date",
      cellClassName: "content-table-cell-date",
      render: (f) => (
        <span className="content-table-cell-date-text">
          {formatDate(f.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="footers-page">
      {/* Template Picker */}
      <div className="footers-templates">
        <h3 className="footers-templates-title">Start from a template</h3>
        <div className="footers-templates-grid">
          {FOOTER_TEMPLATES.map((template) => (
            <button
              key={template.name}
              type="button"
              className="footers-template-card"
              onClick={() => handleCreateFromTemplate(template)}
            >
              <div
                className="footers-template-preview"
                style={{
                  backgroundColor: template.style.backgroundColor,
                  color: template.style.textColor,
                }}
              >
                <span className="footers-template-preview-text">
                  {template.preview}
                </span>
              </div>
              <span className="footers-template-name">{template.name}</span>
              <span className="footers-template-desc">{template.description}</span>
            </button>
          ))}
        </div>
      </div>

      <ContentList<FooterItem>
        title="Footers"
        singularName="Footer"
        pluralName="footers"
        icon={PanelBottom}
        items={footerItems}
        isLoading={isLoading}
        error={error}
        onCreate={() => router.push(`/${id}/footers/new`)}
        onEdit={(f) => router.push(`/${id}/footers/${f.id}/edit`)}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        menuActions={extraActions}
        columns={columns}
        showStatus={false}
        searchFields={["title", "slug"]}
      />
    </div>
  );
}

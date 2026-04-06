"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useHeaders,
  useCreateHeader,
  useDeleteHeader,
  useDuplicateHeader,
  useSaveHeaderToLibrary,
  type Header,
  type HeaderZones,
  type HeaderStyle,
} from "@/lib/hooks/use-headers";
import {
  ContentList,
  type ColumnDef,
  type MenuAction,
} from "@/components/layout/content-list";
import { PanelTop, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import "./headers.css";

// Header layout templates — visual presets users can create from
const HEADER_TEMPLATES = [
  {
    name: "Classic",
    description: "Logo left, nav center, CTA right",
    behavior: "STICKY" as const,
    preview: "logo ——— nav ——— cta",
    zones: {
      left: { logo: { src: "", alt: "Logo" }, alignment: "left" },
      center: { alignment: "center" },
      right: { alignment: "right" },
    },
    style: { backgroundColor: "#ffffff", textColor: "#172b4d", height: "md" as const },
  },
  {
    name: "Centered",
    description: "Logo center, nav below",
    behavior: "STATIC" as const,
    preview: "——— logo ———",
    zones: {
      center: { logo: { src: "", alt: "Logo" }, alignment: "center" },
    },
    style: { backgroundColor: "#ffffff", textColor: "#172b4d", height: "lg" as const },
  },
  {
    name: "Dark Bar",
    description: "Dark background, white text",
    behavior: "FIXED" as const,
    preview: "logo ——— nav ——— cta",
    zones: {
      left: { logo: { src: "", alt: "Logo" }, alignment: "left" },
      right: { alignment: "right" },
    },
    style: { backgroundColor: "#1a1a2e", textColor: "#ffffff", height: "md" as const },
  },
  {
    name: "Transparent",
    description: "Transparent on hero, solid on scroll",
    behavior: "TRANSPARENT" as const,
    preview: "logo ——— nav ——— cta",
    zones: {
      left: { logo: { src: "", alt: "Logo" }, alignment: "left" },
      right: { alignment: "right" },
    },
    style: { backgroundColor: "transparent", textColor: "#ffffff", height: "md" as const },
  },
  {
    name: "Minimal",
    description: "Clean, simple navigation",
    behavior: "STICKY" as const,
    preview: "logo ——————— nav",
    zones: {
      left: { logo: { src: "", alt: "Logo" }, alignment: "left" },
      right: { alignment: "right" },
    },
    style: { backgroundColor: "#ffffff", textColor: "#172b4d", height: "sm" as const },
  },
  {
    name: "Split",
    description: "Nav left, logo center, actions right",
    behavior: "STICKY" as const,
    preview: "nav ——— logo ——— actions",
    zones: {
      left: { alignment: "left" },
      center: { logo: { src: "", alt: "Logo" }, alignment: "center" },
      right: { alignment: "right" },
    },
    style: { backgroundColor: "#ffffff", textColor: "#172b4d", height: "md" as const },
  },
];

const behaviorLabels: Record<string, string> = {
  STATIC: "Static",
  FIXED: "Fixed",
  STICKY: "Sticky",
  SCROLL_HIDE: "Scroll Hide",
  TRANSPARENT: "Transparent",
};

type HeaderItem = Header & { title: string };

export default function HeadersPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;
  const router = useRouter();

  const { data: headers, isLoading, error } = useHeaders(id);
  const createHeader = useCreateHeader(id);
  const deleteHeader = useDeleteHeader(id);
  const duplicateHeader = useDuplicateHeader(id);
  const saveToLibrary = useSaveHeaderToLibrary(id);

  const handleCreateFromTemplate = async (template: typeof HEADER_TEMPLATES[number]) => {
    try {
      const result = await createHeader.mutateAsync({
        name: template.name,
        slug: template.name.toLowerCase().replace(/\s+/g, "-"),
        behavior: template.behavior,
        zones: template.zones as unknown as HeaderZones,
        style: template.style as unknown as HeaderStyle,
      });
      toast.success(`"${template.name}" header created`);
      router.push(`/headers/${result.id}/edit`);
    } catch {
      toast.error("Failed to create header");
    }
  };

  const headerItems = React.useMemo(
    () => headers?.map((h) => ({ ...h, title: h.name })) || undefined,
    [headers],
  );

  const handleDelete = async (header: HeaderItem) => {
    if (header.isDefault) {
      toast.error(
        "Cannot delete the default header. Set another as default first.",
      );
      return;
    }
    if (!confirm(`Delete "${header.name}"? This action cannot be undone.`))
      return;
    try {
      await deleteHeader.mutateAsync(header.id);
      toast.success(`"${header.name}" deleted`);
    } catch {
      toast.error("Failed to delete header");
    }
  };

  const handleDuplicate = async (header: HeaderItem) => {
    try {
      await duplicateHeader.mutateAsync({ id: header.id });
      toast.success(`"${header.name}" duplicated`);
    } catch {
      toast.error("Failed to duplicate header");
    }
  };

  const handleSaveToLibrary = async (header: HeaderItem) => {
    try {
      await saveToLibrary.mutateAsync({ id: header.id });
      toast.success("Header saved to library");
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

  const extraActions: MenuAction<HeaderItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  const columns: ColumnDef<HeaderItem>[] = [
    {
      key: "name",
      header: "Name",
      headerClassName: "content-table-header-cell-title",
      cellClassName: "content-table-cell-title",
      render: (h) => (
        <span className="content-table-cell-title-text">{h.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      headerClassName: "content-table-header-cell-slug",
      cellClassName: "content-table-cell-slug",
      render: (h) => (
        <span className="content-table-cell-slug-text">/{h.slug}</span>
      ),
    },
    {
      key: "behavior",
      header: "Behavior",
      headerClassName: "headers-col-behavior",
      cellClassName: "headers-col-behavior",
      render: (h) => (
        <span className="headers-behavior-text">
          {behaviorLabels[h.behavior] || h.behavior}
        </span>
      ),
    },
    {
      key: "default",
      header: "Default",
      headerClassName: "headers-col-default",
      cellClassName: "headers-col-default",
      render: (h) =>
        h.isDefault ? (
          <span className="headers-default-badge">Default</span>
        ) : null,
    },
    {
      key: "updated",
      header: "Updated",
      headerClassName: "content-table-header-cell-date",
      cellClassName: "content-table-cell-date",
      render: (h) => (
        <span className="content-table-cell-date-text">
          {formatDate(h.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="headers-page">
      {/* Template Picker */}
      <div className="headers-templates">
        <h3 className="headers-templates-title">Start from a template</h3>
        <div className="headers-templates-grid">
          {HEADER_TEMPLATES.map((template) => (
            <button
              key={template.name}
              type="button"
              className="headers-template-card"
              onClick={() => handleCreateFromTemplate(template)}
            >
              <div
                className="headers-template-preview"
                style={{
                  backgroundColor: template.style.backgroundColor === "transparent" ? "#1a1a2e" : template.style.backgroundColor,
                  color: template.style.textColor,
                }}
              >
                <span className="headers-template-preview-text">
                  {template.preview}
                </span>
              </div>
              <span className="headers-template-name">{template.name}</span>
              <span className="headers-template-desc">{template.description}</span>
            </button>
          ))}
        </div>
      </div>

      <ContentList<HeaderItem>
        title="Headers"
        singularName="Header"
        pluralName="headers"
        icon={PanelTop}
        items={headerItems}
        isLoading={isLoading}
        error={error}
        onCreate={() => router.push("/headers/new")}
        onEdit={(h) => router.push(`/headers/${h.id}/edit`)}
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

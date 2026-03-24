"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useFooters,
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
  const deleteFooter = useDeleteFooter(id);
  const duplicateFooter = useDuplicateFooter(id);
  const saveToLibrary = useSaveFooterToLibrary(id);

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

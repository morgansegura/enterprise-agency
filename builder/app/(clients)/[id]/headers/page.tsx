"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useHeaders,
  useDeleteHeader,
  useDuplicateHeader,
  useSaveHeaderToLibrary,
  type Header,
} from "@/lib/hooks/use-headers";
import {
  ContentList,
  type ColumnDef,
  type MenuAction,
} from "@/components/layout/content-list";
import { PanelTop, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

import "./headers.css";

const behaviorLabels: Record<string, string> = {
  STATIC: "Static",
  FIXED: "Fixed",
  STICKY: "Sticky",
  SCROLL_HIDE: "Scroll Hide",
  TRANSPARENT: "Transparent",
};

type HeaderItem = Header & { title: string };

export default function HeadersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: headers, isLoading, error } = useHeaders(id);
  const deleteHeader = useDeleteHeader(id);
  const duplicateHeader = useDuplicateHeader(id);
  const saveToLibrary = useSaveHeaderToLibrary(id);

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
      <ContentList<HeaderItem>
        title="Headers"
        singularName="Header"
        pluralName="headers"
        icon={PanelTop}
        items={headerItems}
        isLoading={isLoading}
        error={error}
        onCreate={() => router.push(`/${id}/headers/new`)}
        onEdit={(h) => router.push(`/${id}/headers/${h.id}/edit`)}
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

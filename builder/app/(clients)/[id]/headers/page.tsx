"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useHeaders,
  useDeleteHeader,
  useDuplicateHeader,
  useSaveHeaderToLibrary,
} from "@/lib/hooks/use-headers";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { PanelTop, Star, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

interface HeaderListItem {
  id: string;
  name: string;
  slug: string;
  behavior: string;
  isDefault?: boolean;
  updatedAt?: string;
}

const behaviorLabels: Record<string, string> = {
  STATIC: "Static",
  FIXED: "Fixed",
  STICKY: "Sticky",
  SCROLL_HIDE: "Scroll Hide",
  TRANSPARENT: "Transparent",
};

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

  const handleCreate = () => {
    router.push(`/${id}/headers/new`);
  };

  const handleEdit = (header: HeaderListItem) => {
    router.push(`/${id}/headers/${header.id}/edit`);
  };

  const handleDelete = (header: HeaderListItem) => {
    if (confirm(`Delete "${header.name}"?`)) {
      deleteHeader.mutate(header.id);
    }
  };

  const handleDuplicate = (header: HeaderListItem) => {
    duplicateHeader.mutate({ id: header.id });
  };

  const handleSaveToLibrary = (header: HeaderListItem) => {
    saveToLibrary.mutate(
      { id: header.id },
      {
        onSuccess: () => {
          toast.success("Header saved to library");
        },
      },
    );
  };

  // Transform headers to include title for ContentList
  const headerItems = headers?.map((header) => ({
    ...header,
    title: header.name,
    subtitle: behaviorLabels[header.behavior] || header.behavior,
  }));

  // Additional menu actions
  const menuActions: MenuAction<HeaderListItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  return (
    <ContentList<HeaderListItem & { title: string; subtitle?: string }>
      title="Headers"
      singularName="Header"
      pluralName="headers"
      icon={PanelTop}
      items={headerItems}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      menuActions={menuActions}
      badges={[
        {
          show: (header) => Boolean(header.isDefault),
          icon: Star,
          className: "content-card-badge-default",
          title: "Default Header",
        },
      ]}
    />
  );
}

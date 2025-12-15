"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useFooters,
  useDeleteFooter,
  useDuplicateFooter,
  useSaveFooterToLibrary,
} from "@/lib/hooks/use-footers";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { PanelBottom, Star, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

interface FooterListItem {
  id: string;
  name: string;
  slug: string;
  layout: string;
  isDefault?: boolean;
  updatedAt?: string;
}

const layoutLabels: Record<string, string> = {
  SIMPLE: "Simple",
  COLUMNS: "Columns",
  STACKED: "Stacked",
  MINIMAL: "Minimal",
  CENTERED: "Centered",
};

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

  const handleCreate = () => {
    router.push(`/${id}/footers/new`);
  };

  const handleEdit = (footer: FooterListItem) => {
    router.push(`/${id}/footers/${footer.id}/edit`);
  };

  const handleDelete = (footer: FooterListItem) => {
    if (confirm(`Delete "${footer.name}"?`)) {
      deleteFooter.mutate(footer.id);
    }
  };

  const handleDuplicate = (footer: FooterListItem) => {
    duplicateFooter.mutate({ id: footer.id });
  };

  const handleSaveToLibrary = (footer: FooterListItem) => {
    saveToLibrary.mutate(
      { id: footer.id },
      {
        onSuccess: () => {
          toast.success("Footer saved to library");
        },
      },
    );
  };

  // Transform footers to include title for ContentList
  const footerItems = footers?.map((footer) => ({
    ...footer,
    title: footer.name,
    subtitle: layoutLabels[footer.layout] || footer.layout,
  }));

  // Additional menu actions
  const menuActions: MenuAction<FooterListItem>[] = [
    {
      label: "Save to Library",
      icon: BookmarkPlus,
      onClick: handleSaveToLibrary,
    },
  ];

  return (
    <ContentList<FooterListItem & { title: string; subtitle?: string }>
      title="Footers"
      singularName="Footer"
      pluralName="footers"
      icon={PanelBottom}
      items={footerItems}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      menuActions={menuActions}
      badges={[
        {
          show: (footer) => Boolean(footer.isDefault),
          icon: Star,
          className: "content-card-badge-default",
          title: "Default Footer",
        },
      ]}
    />
  );
}

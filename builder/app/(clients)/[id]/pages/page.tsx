"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePages,
  useDeletePage,
  useDuplicatePage,
  useUpdatePage,
} from "@/lib/hooks/use-pages";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { FileText, ExternalLink, Home } from "lucide-react";

// Extended page type for ContentList
interface PageItem {
  id: string;
  title: string;
  slug: string;
  status?: string;
  updatedAt?: string;
  isHomePage?: boolean;
}

export default function PagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: pages, isLoading, error } = usePages(id);
  const deletePage = useDeletePage(id);
  const duplicatePage = useDuplicatePage(id);
  const updatePage = useUpdatePage(id);

  const handleCreate = () => {
    router.push(`/${id}/pages/new`);
  };

  const handleEdit = (page: PageItem) => {
    router.push(`/${id}/pages/${page.id}/edit`);
  };

  const handleDelete = (page: PageItem) => {
    if (confirm(`Delete "${page.title}"?`)) {
      deletePage.mutate(page.id);
    }
  };

  const handleDuplicate = (page: PageItem) => {
    duplicatePage.mutate(page.id);
  };

  const handleStatusChange = (page: PageItem, status: string) => {
    updatePage.mutate({ id: page.id, data: { status } });
  };

  // Additional menu actions for pages
  const menuActions: MenuAction<PageItem>[] = [
    {
      label: "View Page",
      icon: ExternalLink,
      href: (page) => `/${page.slug}`,
      external: true,
      onClick: () => {},
    },
  ];

  return (
    <ContentList<PageItem>
      title="Pages"
      singularName="Page"
      pluralName="pages"
      icon={FileText}
      items={pages as PageItem[] | undefined}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onStatusChange={handleStatusChange}
      menuActions={menuActions}
      badges={[
        {
          show: (page) => Boolean(page.isHomePage),
          icon: Home,
          className: "content-card-badge-home",
          title: "Home Page",
        },
      ]}
    />
  );
}

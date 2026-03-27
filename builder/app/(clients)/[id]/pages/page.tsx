"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePages,
  useDeletePage,
  useDuplicatePage,
  useUpdatePage,
  usePublishPage,
  useUnpublishPage,
} from "@/lib/hooks/use-pages";
import {
  PageList,
  type PageCardData,
  type PageCardActions,
} from "@/components/ui/page-card";
import { PageHeader } from "@/components/layout/page-header";
import { FileText } from "lucide-react";
import { toast } from "sonner";

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
  const publishPage = usePublishPage(id);
  const unpublishPage = useUnpublishPage(id);

  const [updatingIds, setUpdatingIds] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Convert and filter pages
  const pageCardData: PageCardData[] = React.useMemo(() => {
    if (!pages) return [];
    return pages
      .map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: (page.status as "draft" | "published") || "draft",
        isHomePage: page.isHomePage,
        updatedAt: page.updatedAt,
        createdAt: page.createdAt,
      }))
      .filter((page) => {
        const matchesSearch =
          search === "" ||
          page.title.toLowerCase().includes(search.toLowerCase()) ||
          page.slug.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || page.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [pages, search, statusFilter]);

  // Action handlers
  const pageActions: PageCardActions = {
    onEdit: (page) => {
      router.push(`/${id}/pages/${page.id}/edit`);
    },
    onDuplicate: async (page) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await duplicatePage.mutateAsync(page.id);
        toast.success(`"${page.title}" duplicated`);
      } catch {
        toast.error("Failed to duplicate page");
      } finally {
        setUpdatingIds((prev) => prev.filter((pid) => pid !== page.id));
      }
    },
    onDelete: async (page) => {
      if (page.isHomePage) {
        toast.error(
          "Cannot delete the homepage. Set another page as homepage first.",
        );
        return;
      }
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await deletePage.mutateAsync(page.id);
        toast.success(`"${page.title}" deleted`);
      } catch {
        toast.error("Failed to delete page");
      } finally {
        setUpdatingIds((prev) => prev.filter((pid) => pid !== page.id));
      }
    },
    onStatusChange: async (page, newStatus) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        if (newStatus === "published") {
          await publishPage.mutateAsync(page.id);
          toast.success(`"${page.title}" published`);
        } else {
          await unpublishPage.mutateAsync(page.id);
          toast.success(`"${page.title}" unpublished`);
        }
      } catch {
        toast.error(
          `Failed to ${newStatus === "published" ? "publish" : "unpublish"} page`,
        );
      } finally {
        setUpdatingIds((prev) => prev.filter((pid) => pid !== page.id));
      }
    },
    onSetHomePage: async (page) => {
      setUpdatingIds((prev) => [...prev, page.id]);
      try {
        await updatePage.mutateAsync({
          id: page.id,
          data: { isHomePage: true },
        });
        toast.success(`"${page.title}" is now the homepage`);
      } catch {
        toast.error("Failed to set homepage");
      } finally {
        setUpdatingIds((prev) => prev.filter((pid) => pid !== page.id));
      }
    },
    onPreview: (page) => {
      window.open(`/${id}/preview/${page.slug}`, "_blank");
    },
  };

  if (error) {
    return (
      <div className="flex-1 p-4 bg-(--card) rounded-md border border-(--border)/50 shadow-xs">
        <PageHeader
          title="Pages"
          icon={FileText}
          description="Failed to load pages"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 p-4 bg-(--card) rounded-md border border-(--border)/50 shadow-xs">
      <PageHeader
        title="Pages"
        icon={FileText}
        count={pages?.length || 0}
        singularName="page"
        pluralName="pages"
        actionLabel="New Page"
        onAction={() => router.push(`/${id}/pages/new`)}
        showSearch
        searchPlaceholder="Search pages..."
        searchValue={search}
        onSearchChange={setSearch}
        showFilter
        filterOptions={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
        ]}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-2.5 border-b border-[var(--border-subtle)]">
              <div className="h-4 flex-1 bg-[var(--el-100)] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[var(--el-100)] rounded animate-pulse" />
              <div className="h-4 w-20 bg-[var(--el-100)] rounded animate-pulse" />
              <div className="h-4 w-24 bg-[var(--el-100)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <PageList
          pages={pageCardData}
          actions={pageActions}
          updatingIds={updatingIds}
          showDate
          showHomepageToggle
          emptyTitle="No pages yet"
          emptyMessage="Create your first page to get started"
          onCreateFirst={() => router.push(`/${id}/pages/new`)}
        />
      )}
    </div>
  );
}

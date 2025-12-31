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
import { Button } from "@/components/ui/button";
import { Plus, FileText, Loader2, PlusCircle } from "lucide-react";
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

  // Track which pages are being updated
  const [updatingIds, setUpdatingIds] = React.useState<string[]>([]);

  // Convert pages to PageCardData format
  const pageCardData: PageCardData[] = React.useMemo(() => {
    if (!pages) return [];
    return pages.map((page) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: (page.status as "draft" | "published") || "draft",
      isHomePage: page.isHomePage,
      updatedAt: page.updatedAt,
      createdAt: page.createdAt,
    }));
  }, [pages]);

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
      <div className="flex-1 p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load pages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Pages</h1>
            <p className="text-sm text-muted-foreground">
              {pages?.length || 0} {pages?.length === 1 ? "page" : "pages"}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/${id}/pages/new`)}>
          <PlusCircle className="h-4 w-4 " />
          New Page
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PageList
          pages={pageCardData}
          actions={pageActions}
          updatingIds={updatingIds}
          showSearch={true}
          showFilters={true}
          showViewToggle={true}
          showDate={true}
          showHomepageToggle={true}
          defaultView="list"
          emptyMessage="No pages yet. Create your first page to get started."
        />
      )}
    </div>
  );
}

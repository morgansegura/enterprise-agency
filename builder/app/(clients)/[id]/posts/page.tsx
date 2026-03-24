"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePosts,
  useDeletePost,
  useDuplicatePost,
  type Post,
} from "@/lib/hooks/use-posts";
import {
  ContentList,
  type ColumnDef,
  type MenuAction,
  StatusPill,
} from "@/components/layout/content-list";
import { FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import "./posts.css";

export default function PostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: posts, isLoading, error } = usePosts(id);
  const deletePost = useDeletePost(id);
  const duplicatePost = useDuplicatePost(id);

  const handleDelete = async (post: Post & { title: string }) => {
    if (!confirm(`Delete "${post.title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deletePost.mutateAsync(post.id);
      toast.success(`"${post.title}" deleted`);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleDuplicate = async (post: Post & { title: string }) => {
    try {
      await duplicatePost.mutateAsync(post.id);
      toast.success(`"${post.title}" duplicated`);
    } catch {
      toast.error("Failed to duplicate post");
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

  // Transform posts to include required title field for ContentList
  const postItems = React.useMemo(
    () => posts?.map((p) => ({ ...p, title: p.title })) || undefined,
    [posts],
  );

  const extraActions: MenuAction<Post & { title: string }>[] = [
    {
      label: "View",
      icon: ExternalLink,
      href: (post) => `/blog/${post.slug}`,
      external: true,
      onClick: () => {},
    },
  ];

  const columns: ColumnDef<Post & { title: string }>[] = [
    {
      key: "title",
      header: "Title",
      headerClassName: "content-table-header-cell-title",
      cellClassName: "content-table-cell-title",
      render: (post) => (
        <span className="content-table-cell-title-text">{post.title}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      headerClassName: "content-table-header-cell-slug",
      cellClassName: "content-table-cell-slug",
      render: (post) => (
        <span className="content-table-cell-slug-text">
          {post.slug ? `/${post.slug}` : "\u2014"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "content-table-header-cell-status",
      cellClassName: "content-table-cell-status",
      render: (post) => <StatusPill status={post.status} />,
    },
    {
      key: "category",
      header: "Category",
      headerClassName: "posts-col-category",
      cellClassName: "posts-col-category",
      render: (post) => (
        <span className="posts-category-text">
          {post.categories?.[0] || "\u2014"}
        </span>
      ),
    },
    {
      key: "author",
      header: "Author",
      headerClassName: "posts-col-author",
      cellClassName: "posts-col-author",
      render: (post) => (
        <span className="posts-author-text">{post.author || "\u2014"}</span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      headerClassName: "content-table-header-cell-date",
      cellClassName: "content-table-cell-date",
      render: (post) => (
        <span className="content-table-cell-date-text">
          {formatDate(post.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="posts-page">
      <ContentList<Post & { title: string }>
        title="Posts"
        singularName="Post"
        pluralName="posts"
        icon={FileText}
        items={postItems}
        isLoading={isLoading}
        error={error}
        onCreate={() => router.push(`/${id}/posts/new`)}
        onEdit={(post) => router.push(`/${id}/posts/${post.id}/edit`)}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        menuActions={extraActions}
        columns={columns}
        showStatus={false}
        searchFields={["title", "slug"]}
        filterOptions={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
        ]}
      />
    </div>
  );
}

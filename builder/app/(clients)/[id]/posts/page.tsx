"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePosts, useDeletePost } from "@/lib/hooks/use-posts";
import { ContentList } from "@/components/layout/content-list";
import { Newspaper, ExternalLink } from "lucide-react";

// Post type for ContentList
interface PostItem {
  id: string;
  title: string;
  slug: string;
  status?: string;
  updatedAt?: string;
  author?: string;
  publishDate?: string;
}

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

  const handleCreate = () => {
    router.push(`/${id}/posts/new`);
  };

  const handleEdit = (post: PostItem) => {
    router.push(`/${id}/posts/${post.id}/edit`);
  };

  const handleDelete = (post: PostItem) => {
    if (confirm(`Delete "${post.title}"?`)) {
      deletePost.mutate(post.id);
    }
  };

  return (
    <ContentList<PostItem>
      title="Blog Posts"
      singularName="Post"
      pluralName="posts"
      icon={Newspaper}
      items={posts as PostItem[] | undefined}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      menuActions={[
        {
          label: "View Post",
          icon: ExternalLink,
          href: (post) => `/blog/${post.slug}`,
          external: true,
          onClick: () => {},
        },
      ]}
      renderListMeta={(post) => (
        <span className="text-sm text-(--muted-foreground)">
          {post.author || "No author"}
        </span>
      )}
    />
  );
}

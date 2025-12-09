"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePosts, useDeletePost } from "@/lib/hooks/use-posts";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

  const handleEdit = (postId: string) => {
    router.push(`/${id}/posts/${postId}/edit`);
  };

  const handleDelete = (post: { id: string; title: string }) => {
    if (confirm(`Delete "${post.title}"?`)) {
      deletePost.mutate(post.id);
    }
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error.message}</div>;

  return (
    <div>
      <div>
        <LayoutHeading
          title="Blog Posts"
          description={
            posts && posts.length > 0
              ? `${posts.length} total posts`
              : "No posts yet"
          }
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/${id}/posts/new`)}
            >
              New Post
            </Button>
          }
        />
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts found. Create your first blog post to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>{post.status || "draft"}</TableCell>
                <TableCell>{post.author || "—"}</TableCell>
                <TableCell>
                  {post.publishDate
                    ? new Date(post.publishDate).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post)}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

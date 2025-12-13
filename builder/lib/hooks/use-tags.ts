import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const TAGS_KEY = ["tags"];
const POSTS_KEY = ["posts"];

/**
 * Fetch all tags for a tenant
 * Tags are derived from posts - each unique tag string becomes a Tag object
 */
export function useTags(tenantId: string) {
  return useQuery<Tag[]>({
    queryKey: [...TAGS_KEY, tenantId],
    queryFn: async () => {
      // Get raw tag strings from posts
      const tagStrings = await apiClient.get<string[]>("/posts/tags");

      // Transform to Tag objects with generated IDs and slugs
      return tagStrings.map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count: 0, // Count would require additional API call
      }));
    },
    enabled: !!tenantId,
  });
}

/**
 * Fetch tags with post counts
 * This fetches both tags and posts to calculate usage counts
 */
export function useTagsWithCounts(tenantId: string) {
  return useQuery<Tag[]>({
    queryKey: [...TAGS_KEY, tenantId, "with-counts"],
    queryFn: async () => {
      // Get all posts to count tag usage
      const posts = await apiClient.get<{ tags?: string[] }[]>("/posts");

      // Count tag occurrences
      const tagCounts = new Map<string, number>();
      posts.forEach((post) => {
        post.tags?.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      // Transform to Tag objects
      return Array.from(tagCounts.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count,
      }));
    },
    enabled: !!tenantId,
  });
}

/**
 * Rename a tag across all posts
 */
export function useRenameTag(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      oldName,
      newName,
    }: {
      oldName: string;
      newName: string;
    }) => {
      // Get all posts with this tag
      const posts = await apiClient.get<{ id: string; tags?: string[] }[]>(
        `/posts?tags=${encodeURIComponent(oldName)}`,
      );

      // Update each post to replace the tag
      const updates = posts.map((post) => {
        const updatedTags =
          post.tags?.map((t) => (t === oldName ? newName : t)) || [];
        return apiClient.patch(`/posts/${post.id}`, { tags: updatedTags });
      });

      await Promise.all(updates);
      return { oldName, newName, updatedCount: posts.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TAGS_KEY, tenantId] });
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      logger.log("Tag renamed successfully");
    },
    onError: (error) => {
      logger.error("Failed to rename tag", error as Error);
    },
  });
}

/**
 * Delete a tag from all posts
 */
export function useDeleteTag(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagName: string) => {
      // Get all posts with this tag
      const posts = await apiClient.get<{ id: string; tags?: string[] }[]>(
        `/posts?tags=${encodeURIComponent(tagName)}`,
      );

      // Update each post to remove the tag
      const updates = posts.map((post) => {
        const updatedTags = post.tags?.filter((t) => t !== tagName) || [];
        return apiClient.patch(`/posts/${post.id}`, { tags: updatedTags });
      });

      await Promise.all(updates);
      return { tagName, removedFromCount: posts.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TAGS_KEY, tenantId] });
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      logger.log("Tag deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete tag", error as Error);
    },
  });
}

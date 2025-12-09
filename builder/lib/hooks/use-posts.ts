import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import type { PageSeo, Section } from "./use-pages";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishDate?: string;
  categories?: string[];
  tags?: string[];
  content?: {
    sections?: Section[];
  };
  seo?: PageSeo;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const POSTS_KEY = ["posts"];

export function usePosts(tenantId: string) {
  return useQuery<Post[]>({
    queryKey: [...POSTS_KEY, tenantId],
    queryFn: () => apiClient.get<Post[]>("/posts"),
    enabled: !!tenantId,
  });
}

export function usePost(tenantId: string, postId: string) {
  return useQuery<Post>({
    queryKey: [...POSTS_KEY, tenantId, postId],
    queryFn: () => apiClient.get<Post>(`/posts/${postId}`),
    enabled: !!tenantId && !!postId,
  });
}

export function usePostBySlug(tenantId: string, slug: string) {
  return useQuery<Post>({
    queryKey: [...POSTS_KEY, tenantId, "slug", slug],
    queryFn: () => apiClient.get<Post>(`/posts/slug/${slug}`),
    enabled: !!tenantId && !!slug,
  });
}

export function useCreatePost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Post>) => apiClient.post<Post>("/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      logger.log("Post created successfully");
    },
    onError: (error) => {
      logger.error("Failed to create post", error as Error);
    },
  });
}

export function useUpdatePost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      apiClient.patch<Post>(`/posts/${id}`, data),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...POSTS_KEY, tenantId, updatedPost.id],
      });
      logger.log("Post updated successfully");
    },
    onError: (error) => {
      logger.error("Failed to update post", error as Error);
    },
  });
}

export function useDeletePost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      logger.log("Post deleted successfully");
    },
    onError: (error) => {
      logger.error("Failed to delete post", error as Error);
    },
  });
}

export function usePublishPost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/posts/${id}/publish`, {}),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...POSTS_KEY, tenantId, postId],
      });
      logger.log("Post published successfully");
    },
    onError: (error) => {
      logger.error("Failed to publish post", error as Error);
    },
  });
}

export function useUnpublishPost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/posts/${id}/unpublish`, {}),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      queryClient.invalidateQueries({
        queryKey: [...POSTS_KEY, tenantId, postId],
      });
      logger.log("Post unpublished successfully");
    },
    onError: (error) => {
      logger.error("Failed to unpublish post", error as Error);
    },
  });
}

export function useDuplicatePost(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<Post>(`/posts/${id}/duplicate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...POSTS_KEY, tenantId] });
      logger.log("Post duplicated successfully");
    },
    onError: (error) => {
      logger.error("Failed to duplicate post", error as Error);
    },
  });
}

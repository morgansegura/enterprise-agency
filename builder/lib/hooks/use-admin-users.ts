import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "./query-keys";
import { User } from "@/lib/stores/admin-store";
import { logger } from "@/lib/logger";

// DTOs
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  agencyRole: "owner" | "admin" | "developer" | "designer" | "content_manager";
  isSuperAdmin?: boolean;
  phone?: string;
}

export interface InviteUserDto {
  email: string;
  firstName: string;
  lastName: string;
  agencyRole: "owner" | "admin" | "developer" | "designer" | "content_manager";
  phone?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  agencyRole?: "owner" | "admin" | "developer" | "designer" | "content_manager";
  status?: "active" | "inactive" | "pending";
  isSuperAdmin?: boolean;
}

/**
 * List all users with optional filters
 */
export function useAdminUsers(includeDeleted?: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.users.all({ includeDeleted }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (includeDeleted) {
        params.append("includeDeleted", "true");
      }

      const url = `/admin/users${params.toString() ? `?${params}` : ""}`;
      const data = await apiClient.get<User[]>(url);

      logger.log("Fetched admin users", { count: data.length });
      return data;
    },
  });
}

/**
 * Search users by query string
 */
export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: queryKeys.admin.users.search(query),
    queryFn: async () => {
      const data = await apiClient.get<User[]>(
        `/admin/users/search?q=${encodeURIComponent(query)}`,
      );
      logger.log("Searched users", { query, count: data.length });
      return data;
    },
    enabled: query.length > 0,
  });
}

/**
 * Get single user details with relationships
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(userId),
    queryFn: async () => {
      const data = await apiClient.get<User>(`/admin/users/${userId}`);
      logger.log("Fetched user details", { userId });
      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Create user (super admin only)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      logger.log("Creating user", { email: data.email });
      return apiClient.post<User>("/admin/users", data);
    },
    onSuccess: (newUser) => {
      logger.log("User created successfully", { userId: newUser.id });

      // Invalidate all user lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.all(),
      });

      // Set the new user in cache
      queryClient.setQueryData(
        queryKeys.admin.users.detail(newUser.id),
        newUser,
      );
    },
    onError: (error: any) => {
      logger.error("Failed to create user", error);
    },
  });
}

/**
 * Invite user - generates temporary password and sends email
 */
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteUserDto) => {
      logger.log("Inviting user", { email: data.email });
      return apiClient.post<User>("/admin/users/invite", data);
    },
    onSuccess: (newUser) => {
      logger.log("User invited successfully", { userId: newUser.id });

      // Invalidate user lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.all(),
      });

      // Set the new user in cache
      queryClient.setQueryData(
        queryKeys.admin.users.detail(newUser.id),
        newUser,
      );
    },
    onError: (error: any) => {
      logger.error("Failed to invite user", error);
    },
  });
}

/**
 * Update user with optimistic updates
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserDto;
    }) => {
      logger.log("Updating user", { userId, updates: data });
      return apiClient.patch<User>(`/admin/users/${userId}`, data);
    },

    // Optimistic update
    onMutate: async ({ userId, data }) => {
      // Cancel outgoing queries for this user
      await queryClient.cancelQueries({
        queryKey: queryKeys.admin.users.detail(userId),
      });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(
        queryKeys.admin.users.detail(userId),
      );

      // Optimistically update user
      if (previousUser) {
        queryClient.setQueryData<User>(queryKeys.admin.users.detail(userId), {
          ...previousUser,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousUser };
    },

    // Rollback on error
    onError: (error: any, { userId }, context) => {
      logger.error("Failed to update user", error, { userId });

      if (context?.previousUser) {
        queryClient.setQueryData(
          queryKeys.admin.users.detail(userId),
          context.previousUser,
        );
      }
    },

    // Refetch on success
    onSuccess: (updatedUser, { userId }) => {
      logger.log("User updated successfully", { userId });

      // Update the user in cache
      queryClient.setQueryData(
        queryKeys.admin.users.detail(userId),
        updatedUser,
      );

      // Invalidate user lists to reflect changes
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.all(),
      });
    },
  });
}

/**
 * Delete user (super admin only) - soft delete
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      logger.log("Deleting user", { userId });
      return apiClient.delete(`/admin/users/${userId}`);
    },
    onSuccess: (_, userId) => {
      logger.log("User deleted successfully", { userId });

      // Invalidate all user queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.all(),
      });

      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.admin.users.detail(userId),
      });
    },
    onError: (error: any, userId) => {
      logger.error("Failed to delete user", error, { userId });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "./query-keys";
import { ProjectAssignment } from "@/lib/stores/admin-store";
import { logger } from "@/lib/logger";

// DTOs
export interface CreateProjectAssignmentDto {
  userId: string;
  tenantId: string;
  role: "owner" | "admin" | "developer" | "designer" | "content_manager";
  permissions?: Record<string, any>;
  status?: "active" | "inactive";
}

export interface UpdateProjectAssignmentDto {
  role?: "owner" | "admin" | "developer" | "designer" | "content_manager";
  permissions?: Record<string, any>;
  status?: "active" | "inactive";
}

export interface ProjectAssignmentFilters {
  tenantId?: string;
  userId?: string;
}

/**
 * List project assignments with optional filters
 */
export function useProjectAssignments(filters?: ProjectAssignmentFilters) {
  return useQuery({
    queryKey: queryKeys.admin.projects.assignments(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.tenantId) {
        params.append("tenantId", filters.tenantId);
      }
      if (filters?.userId) {
        params.append("userId", filters.userId);
      }

      const url = `/admin/projects/assignments${params.toString() ? `?${params}` : ""}`;
      const data = await apiClient.get<ProjectAssignment[]>(url);

      logger.log("Fetched project assignments", {
        count: data.length,
        filters,
      });
      return data;
    },
  });
}

/**
 * Get single project assignment details
 */
export function useProjectAssignment(assignmentId: string) {
  return useQuery({
    queryKey: queryKeys.admin.projects.detail(assignmentId),
    queryFn: async () => {
      const data = await apiClient.get<ProjectAssignment>(
        `/admin/projects/assignments/${assignmentId}`,
      );
      logger.log("Fetched assignment details", { assignmentId });
      return data;
    },
    enabled: !!assignmentId,
  });
}

/**
 * Create new project assignment
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectAssignmentDto) => {
      logger.log("Creating project assignment", {
        userId: data.userId,
        tenantId: data.tenantId,
        role: data.role,
      });

      return apiClient.post<ProjectAssignment>(
        "/admin/projects/assignments",
        data,
      );
    },

    onSuccess: (newAssignment) => {
      logger.log("Assignment created successfully", {
        assignmentId: newAssignment.id,
      });

      // Invalidate all assignment lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.projects.assignments(),
      });

      // Set the new assignment in cache
      queryClient.setQueryData(
        queryKeys.admin.projects.detail(newAssignment.id),
        newAssignment,
      );

      // Invalidate related user and tenant queries
      if (newAssignment.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.users.detail(newAssignment.userId),
        });
      }
      if (newAssignment.tenantId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.tenants.detail(newAssignment.tenantId),
        });
      }
    },

    onError: (error: any) => {
      logger.error("Failed to create assignment", error);
    },
  });
}

/**
 * Update project assignment with optimistic updates
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      data,
    }: {
      assignmentId: string;
      data: UpdateProjectAssignmentDto;
    }) => {
      logger.log("Updating assignment", { assignmentId, updates: data });

      return apiClient.patch<ProjectAssignment>(
        `/admin/projects/assignments/${assignmentId}`,
        data,
      );
    },

    onMutate: async ({ assignmentId, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.admin.projects.detail(assignmentId),
      });

      // Snapshot previous value
      const previousAssignment = queryClient.getQueryData<ProjectAssignment>(
        queryKeys.admin.projects.detail(assignmentId),
      );

      // Optimistically update
      if (previousAssignment) {
        queryClient.setQueryData<ProjectAssignment>(
          queryKeys.admin.projects.detail(assignmentId),
          {
            ...previousAssignment,
            ...data,
          },
        );
      }

      return { previousAssignment };
    },

    onError: (error: any, { assignmentId }, context) => {
      logger.error("Failed to update assignment", error, { assignmentId });

      // Rollback on error
      if (context?.previousAssignment) {
        queryClient.setQueryData(
          queryKeys.admin.projects.detail(assignmentId),
          context.previousAssignment,
        );
      }
    },

    onSuccess: (updatedAssignment, { assignmentId }) => {
      logger.log("Assignment updated successfully", { assignmentId });

      // Update cache
      queryClient.setQueryData(
        queryKeys.admin.projects.detail(assignmentId),
        updatedAssignment,
      );

      // Invalidate assignment lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.projects.assignments(),
      });

      // Invalidate related queries
      if (updatedAssignment.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.users.detail(updatedAssignment.userId),
        });
      }
      if (updatedAssignment.tenantId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.tenants.detail(updatedAssignment.tenantId),
        });
      }
    },
  });
}

/**
 * Delete project assignment
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      logger.log("Deleting assignment", { assignmentId });

      return apiClient.delete(`/admin/projects/assignments/${assignmentId}`);
    },

    onMutate: async (assignmentId) => {
      // Get assignment before deletion for context
      const assignment = queryClient.getQueryData<ProjectAssignment>(
        queryKeys.admin.projects.detail(assignmentId),
      );

      return { assignment };
    },

    onSuccess: (_, assignmentId, context) => {
      logger.log("Assignment deleted successfully", { assignmentId });

      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.admin.projects.detail(assignmentId),
      });

      // Invalidate all assignment lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.projects.assignments(),
      });

      // Invalidate related queries
      if (context?.assignment?.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.users.detail(context.assignment.userId),
        });
      }
      if (context?.assignment?.tenantId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.tenants.detail(context.assignment.tenantId),
        });
      }
    },

    onError: (error: any, assignmentId) => {
      logger.error("Failed to delete assignment", error, { assignmentId });
    },
  });
}

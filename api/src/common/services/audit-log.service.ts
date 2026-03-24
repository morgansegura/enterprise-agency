import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * Audit actions organized by resource domain.
 */
export enum AuditAction {
  // Auth
  LOGIN = "login",
  LOGIN_FAILED = "login.failed",
  LOGOUT = "logout",
  PASSWORD_CHANGED = "password.changed",
  PASSWORD_RESET_REQUESTED = "password.reset_requested",
  PASSWORD_RESET_COMPLETED = "password.reset_completed",
  ACCOUNT_LOCKED = "account.locked",
  TOKEN_REFRESHED = "token.refreshed",
  REGISTER = "register",

  // User management
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_INVITED = "user.invited",

  // Tenant management
  TENANT_CREATED = "tenant.created",
  TENANT_UPDATED = "tenant.updated",
  TENANT_DELETED = "tenant.deleted",
  TENANT_CLONED = "tenant.cloned",

  // Features & projects
  FEATURE_ENABLED = "feature.enabled",
  FEATURE_DISABLED = "feature.disabled",
  PROJECT_ASSIGNED = "project.assigned",
  PROJECT_UNASSIGNED = "project.unassigned",
  PERMISSION_CHANGED = "permission.changed",

  // Content
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
  DUPLICATED = "duplicated",

  // Media
  UPLOADED = "uploaded",
  MOVED = "moved",
  BULK_DELETED = "bulk.deleted",
  BULK_MOVED = "bulk.moved",

  // Orders
  FULFILLED = "fulfilled",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",

  // Settings
  SETTINGS_UPDATED = "settings.updated",
}

export interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  action: AuditAction | string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event to the database. Fire-and-forget — never throws.
   * If tenantId is missing, falls back to structured logger only.
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      if (!entry.tenantId) {
        // Platform-level event with no tenant context — log only
        this.logger.log({ message: "Audit event (no tenant)", ...entry });
        return;
      }

      await this.prisma.auditLog.create({
        data: {
          tenantId: entry.tenantId,
          userId: entry.userId ?? null,
          action: entry.action,
          resourceType: entry.resourceType,
          resourceId: entry.resourceId ?? null,
          changes: (entry.changes as Record<string, never>) ?? undefined,
          metadata: (entry.metadata as Record<string, never>) ?? undefined,
          ipAddress: entry.ipAddress ?? null,
          userAgent: entry.userAgent ?? null,
        },
      });
    } catch (error) {
      // Audit logging must never break the request
      this.logger.error("Failed to write audit log", {
        error: (error as Error).message,
        entry,
      });
    }
  }

  /**
   * Get audit logs for a tenant, most recent first.
   */
  async getByTenant(
    tenantId: string,
    opts: {
      limit?: number;
      offset?: number;
      action?: string;
      resourceType?: string;
      userId?: string;
    } = {},
  ) {
    const { limit = 50, offset = 0, action, resourceType, userId } = opts;

    const where: Record<string, unknown> = { tenantId };
    if (action) where.action = action;
    if (resourceType) where.resourceType = resourceType;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  /**
   * Get audit logs for a specific user across all tenants.
   */
  async getByUser(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific resource.
   */
  async getByResource(resourceType: string, resourceId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { resourceType, resourceId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }
}

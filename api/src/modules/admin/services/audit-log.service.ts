import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";

export enum AuditAction {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_INVITED = "user.invited",
  TENANT_CREATED = "tenant.created",
  TENANT_UPDATED = "tenant.updated",
  TENANT_DELETED = "tenant.deleted",
  FEATURE_ENABLED = "feature.enabled",
  FEATURE_DISABLED = "feature.disabled",
  PROJECT_ASSIGNED = "project.assigned",
  PROJECT_UNASSIGNED = "project.unassigned",
  PERMISSION_CHANGED = "permission.changed",
}

interface AuditLogData {
  action: AuditAction;
  performedBy: string;
  targetType: "user" | "tenant" | "feature" | "project";
  targetId: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
    // For now, just log to console
    // In production, store in database or send to logging service
    console.log("[AUDIT]", {
      timestamp: new Date().toISOString(),
      ...data,
    });

    // TODO: Store in database audit_logs table
    // return this.prisma.auditLog.create({
    //   data: {
    //     action: data.action,
    //     performedBy: data.performedBy,
    //     targetType: data.targetType,
    //     targetId: data.targetId,
    //     metadata: data.metadata || {},
    //   },
    // })
  }

  async getUserAuditLogs(_userId: string, _limit = 50) {
    // TODO: Implement when audit_logs table exists
    // Will use _userId and _limit parameters for querying
    return [];
  }

  async getTenantAuditLogs(_tenantId: string, _limit = 50) {
    // TODO: Implement when audit_logs table exists
    // Will use _tenantId and _limit parameters for querying
    return [];
  }
}

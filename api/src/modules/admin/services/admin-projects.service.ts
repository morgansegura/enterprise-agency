import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import {
  CreateProjectAssignmentDto,
  UpdateProjectAssignmentDto,
} from "../dto/project-assignment.dto";
import { AuditLogService, AuditAction } from "./audit-log.service";

@Injectable()
export class AdminProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getProjectAssignments(tenantId?: string, userId?: string) {
    return this.prisma.projectAssignment.findMany({
      where: {
        ...(tenantId && { tenantId }),
        ...(userId && { userId }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        tenant: {
          select: {
            id: true,
            slug: true,
            businessName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAssignment(id: string) {
    const assignment = await this.prisma.projectAssignment.findUnique({
      where: { id },
      include: {
        user: true,
        tenant: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    return assignment;
  }

  async createAssignment(data: CreateProjectAssignmentDto, createdBy: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: data.tenantId },
    });
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const assignment = await this.prisma.projectAssignment.create({
      data: {
        userId: data.userId,
        tenantId: data.tenantId,
        role: data.role,
        permissions: data.permissions || {},
        status: data.status || "active",
      },
      include: {
        user: true,
        tenant: true,
      },
    });

    await this.auditLog.log({
      action: AuditAction.PROJECT_ASSIGNED,
      performedBy: createdBy,
      targetType: "project",
      targetId: assignment.id,
      metadata: {
        userId: data.userId,
        tenantId: data.tenantId,
        role: data.role,
      },
    });

    return assignment;
  }

  async updateAssignment(
    id: string,
    data: UpdateProjectAssignmentDto,
    updatedBy: string,
  ) {
    await this.getAssignment(id);

    const updated = await this.prisma.projectAssignment.update({
      where: { id },
      data: {
        role: data.role,
        permissions: data.permissions,
        status: data.status,
      },
      include: {
        user: true,
        tenant: true,
      },
    });

    await this.auditLog.log({
      action: AuditAction.PERMISSION_CHANGED,
      performedBy: updatedBy,
      targetType: "project",
      targetId: id,
      metadata: { changes: data },
    });

    return updated;
  }

  async deleteAssignment(id: string, deletedBy: string) {
    const assignment = await this.getAssignment(id);

    await this.prisma.projectAssignment.delete({
      where: { id },
    });

    await this.auditLog.log({
      action: AuditAction.PROJECT_UNASSIGNED,
      performedBy: deletedBy,
      targetType: "project",
      targetId: id,
      metadata: {
        userId: assignment.userId,
        tenantId: assignment.tenantId,
      },
    });

    return { success: true };
  }
}

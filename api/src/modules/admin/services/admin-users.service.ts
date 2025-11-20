import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateUserDto, InviteUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { AuditLogService, AuditAction } from "./audit-log.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async findAll(includeDeleted = false) {
    return this.prisma.user.findMany({
      where: includeDeleted ? {} : { status: "active" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isSuperAdmin: true,
        agencyRole: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          include: {
            tenant: {
              select: {
                id: true,
                slug: true,
                businessName: true,
              },
            },
          },
        },
        projectAssignments: {
          include: {
            tenant: {
              select: {
                id: true,
                slug: true,
                businessName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(data: CreateUserDto, createdBy: string) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        isSuperAdmin: data.isSuperAdmin || false,
        agencyRole: data.agencyRole || null,
        status: "active",
        emailVerified: false,
      },
    });

    await this.auditLog.log({
      action: AuditAction.USER_CREATED,
      performedBy: createdBy,
      targetType: "user",
      targetId: user.id,
      metadata: { email: user.email, agencyRole: user.agencyRole },
    });

    return user;
  }

  async invite(data: InviteUserDto, invitedBy: string) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        isSuperAdmin: data.isSuperAdmin || false,
        agencyRole: data.agencyRole || null,
        status: "active",
        emailVerified: false,
      },
    });

    await this.auditLog.log({
      action: AuditAction.USER_INVITED,
      performedBy: invitedBy,
      targetType: "user",
      targetId: user.id,
      metadata: { email: user.email },
    });

    // TODO: Send invitation email with temporary password
    // await this.emailService.sendInvitation(user.email, tempPassword)

    return { user, tempPassword };
  }

  async update(id: string, data: UpdateUserDto, updatedBy: string) {
    // Validate user exists (throws NotFoundException if not found)
    await this.findById(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        isSuperAdmin: data.isSuperAdmin,
        agencyRole: data.agencyRole,
        status: data.status,
      },
    });

    await this.auditLog.log({
      action: AuditAction.USER_UPDATED,
      performedBy: updatedBy,
      targetType: "user",
      targetId: updated.id,
      metadata: { changes: data },
    });

    return updated;
  }

  async delete(id: string, deletedBy: string) {
    const user = await this.findById(id);

    // Soft delete
    const deleted = await this.prisma.user.update({
      where: { id },
      data: { status: "inactive" },
    });

    await this.auditLog.log({
      action: AuditAction.USER_DELETED,
      performedBy: deletedBy,
      targetType: "user",
      targetId: deleted.id,
      metadata: { email: user.email },
    });

    return deleted;
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
        ],
        status: "active",
      },
      take: 20,
    });
  }
}

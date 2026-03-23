import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";
import { PaginatedResponse } from "@/common/dto/response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ListUsersDto } from "./dto/list-users.dto";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditLogService,
  ) {}

  // ---------------------------------------------------------------------------
  // Find by Clerk ID
  // ---------------------------------------------------------------------------

  async findByClerkId(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  // ---------------------------------------------------------------------------
  // Find by ID
  // ---------------------------------------------------------------------------

  async findById(id: string, tenantId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          where: tenantId ? { tenantId } : undefined,
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  // ---------------------------------------------------------------------------
  // Create (admin-only)
  // ---------------------------------------------------------------------------

  async create(
    tenantId: string,
    createData: CreateUserDto,
    performedByUserId?: string,
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createData.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(createData.password, SALT_ROUNDS);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: createData.email.toLowerCase(),
          passwordHash,
          firstName: createData.firstName,
          lastName: createData.lastName,
          emailVerified: true,
        },
      });

      await tx.tenantUser.create({
        data: {
          tenantId,
          userId: user.id,
          role: createData.role,
        },
      });

      return user;
    });

    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
      include: {
        tenantUsers: {
          where: { tenantId },
          include: { tenant: true },
        },
      },
    });

    this.logger.log(`User created: ${createData.email} for tenant ${tenantId}`);
    this.audit.log({
      tenantId,
      userId: performedByUserId,
      action: AuditAction.USER_CREATED,
      resourceType: "user",
      resourceId: result.id,
      changes: {
        email: createData.email.toLowerCase(),
        firstName: createData.firstName,
        lastName: createData.lastName,
        role: createData.role,
      },
    });

    return user;
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  async update(clerkUserId: string, updateData: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { clerkUserId },
      data: updateData,
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    return user;
  }

  // ---------------------------------------------------------------------------
  // Deactivate (soft delete)
  // ---------------------------------------------------------------------------

  async deactivate(id: string, tenantId: string, performedByUserId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenantUsers: {
          where: { tenantId },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.$transaction(async (tx) => {
      // Soft delete: set status to inactive and mark deletedAt
      await tx.user.update({
        where: { id },
        data: {
          status: "inactive",
          deletedAt: new Date(),
        },
      });

      // Remove from current tenant
      await tx.tenantUser.deleteMany({
        where: {
          userId: id,
          tenantId,
        },
      });
    });

    this.logger.log(
      `User deactivated: ${user.email}, removed from tenant ${tenantId}`,
    );
    this.audit.log({
      tenantId,
      userId: performedByUserId,
      action: AuditAction.USER_DELETED,
      resourceType: "user",
      resourceId: id,
      changes: {
        email: user.email,
        status: "inactive",
      },
    });

    return { success: true, id };
  }

  // ---------------------------------------------------------------------------
  // List users for tenant (paginated)
  // ---------------------------------------------------------------------------

  async getUsersForTenant(tenantId: string, filters?: ListUsersDto) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;

    const where: Prisma.TenantUserWhereInput = { tenantId };

    if (filters?.search) {
      where.user = {
        OR: [
          { email: { contains: filters.search, mode: "insensitive" } },
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
        ],
      };
    }

    const [tenantUsers, total] = await Promise.all([
      this.prisma.tenantUser.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tenantUser.count({ where }),
    ]);

    const data = tenantUsers.map((tu) => ({
      ...tu.user,
      role: tu.role,
      permissions: tu.permissions,
      lastActiveAt: tu.lastActiveAt,
    }));

    return new PaginatedResponse(data, total, page, limit);
  }
}

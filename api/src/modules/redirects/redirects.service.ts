import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";
import { PaginatedResponse } from "@/common/dto/response.dto";
import { CreateRedirectDto } from "./dto/create-redirect.dto";
import { UpdateRedirectDto } from "./dto/update-redirect.dto";

@Injectable()
export class RedirectsService {
  private readonly logger = new Logger(RedirectsService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditLogService,
  ) {}

  async create(tenantId: string, createData: CreateRedirectDto) {
    // Check for duplicate sourcePath within tenant
    const existing = await this.prisma.redirect.findUnique({
      where: {
        tenantId_sourcePath: {
          tenantId,
          sourcePath: createData.sourcePath,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        "A redirect for this source path already exists",
      );
    }

    const redirect = await this.prisma.redirect.create({
      data: {
        tenantId,
        sourcePath: createData.sourcePath,
        targetPath: createData.targetPath,
        statusCode: createData.statusCode ?? 301,
        isActive: createData.isActive ?? true,
      },
    });

    this.logger.log(
      `Redirect created: ${redirect.sourcePath} -> ${redirect.targetPath}`,
    );
    this.audit.log({
      tenantId,
      action: AuditAction.CREATED,
      resourceType: "redirect",
      resourceId: redirect.id,
    });

    return redirect;
  }

  async findAll(
    tenantId: string,
    filters?: {
      search?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const where: Record<string, unknown> = { tenantId };

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { sourcePath: { contains: filters.search, mode: "insensitive" } },
        { targetPath: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.redirect.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.redirect.count({ where }),
    ]);

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(tenantId: string, id: string) {
    const redirect = await this.prisma.redirect.findFirst({
      where: { id, tenantId },
    });

    if (!redirect) {
      throw new NotFoundException("Redirect not found");
    }

    return redirect;
  }

  async update(tenantId: string, id: string, updateData: UpdateRedirectDto) {
    // Verify redirect belongs to tenant
    await this.findOne(tenantId, id);

    // If sourcePath is being updated, check for conflicts
    if (updateData.sourcePath) {
      const existing = await this.prisma.redirect.findUnique({
        where: {
          tenantId_sourcePath: {
            tenantId,
            sourcePath: updateData.sourcePath,
          },
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          "A redirect for this source path already exists",
        );
      }
    }

    const redirect = await this.prisma.redirect.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(
      `Redirect updated: ${redirect.sourcePath} -> ${redirect.targetPath}`,
    );
    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "redirect",
      resourceId: redirect.id,
    });

    return redirect;
  }

  async remove(tenantId: string, id: string) {
    // Verify redirect belongs to tenant
    await this.findOne(tenantId, id);

    await this.prisma.redirect.delete({
      where: { id },
    });

    this.logger.log(`Redirect deleted: ${id}`);
    this.audit.log({
      tenantId,
      action: AuditAction.DELETED,
      resourceType: "redirect",
      resourceId: id,
    });

    return { success: true, id };
  }

  /**
   * Look up an active redirect by source path for a tenant.
   * Used by the public API for client-side redirect resolution.
   */
  async findBySourcePath(tenantId: string, sourcePath: string) {
    return this.prisma.redirect.findFirst({
      where: {
        tenantId,
        sourcePath,
        isActive: true,
      },
      select: {
        targetPath: true,
        statusCode: true,
      },
    });
  }
}

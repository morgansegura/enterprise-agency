import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "./audit-log.service";

@Injectable()
export class AdminTenantsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getTenantStats(tenantId: string) {
    const [pageCount, postCount, assetCount, userCount] = await Promise.all([
      this.prisma.page.count({ where: { tenantId } }),
      this.prisma.post.count({ where: { tenantId } }),
      this.prisma.asset.count({ where: { tenantId } }),
      this.prisma.tenantUser.count({ where: { tenantId } }),
    ]);

    return {
      pages: pageCount,
      posts: postCount,
      assets: assetCount,
      users: userCount,
    };
  }

  async getTenantActivity(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [recentPages, recentPosts] = await Promise.all([
      this.prisma.page.findMany({
        where: {
          tenantId,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.post.findMany({
        where: {
          tenantId,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      recentPages,
      recentPosts,
    };
  }

  async getAllTenantsWithStats() {
    const tenants = await this.prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            pages: true,
            posts: true,
            assets: true,
            tenantUsers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tenants;
  }
}

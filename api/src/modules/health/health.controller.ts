import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const start = Date.now();
    let dbStatus = "healthy";
    let dbResponseTime = 0;

    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
    } catch {
      dbStatus = "unhealthy";
    }

    return {
      status: dbStatus === "healthy" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - start,
      checks: {
        database: {
          status: dbStatus,
          responseTime: dbResponseTime,
        },
        memory: {
          status: "healthy",
          usage: process.memoryUsage(),
        },
      },
    };
  }

  @Get("ready")
  ready() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}

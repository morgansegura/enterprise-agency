import { Module } from "@nestjs/common";
import { RedirectsController } from "./redirects.controller";
import { RedirectsService } from "./redirects.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [RedirectsController],
  providers: [RedirectsService, PrismaService, AuditLogService],
  exports: [RedirectsService],
})
export class RedirectsModule {}

import { Module } from "@nestjs/common";
import { SiteConfigController } from "./site-config.controller";
import { SiteConfigService } from "./site-config.service";
import { PrismaService } from "../../common/services/prisma.service";
import { AuditLogService } from "../../common/services/audit-log.service";

@Module({
  controllers: [SiteConfigController],
  providers: [SiteConfigService, PrismaService, AuditLogService],
  exports: [SiteConfigService],
})
export class SiteConfigModule {}

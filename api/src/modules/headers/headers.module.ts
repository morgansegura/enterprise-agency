import { Module } from "@nestjs/common";
import { HeadersController } from "./headers.controller";
import { HeadersService } from "./headers.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [HeadersController],
  providers: [HeadersService, PrismaService, AuditLogService],
  exports: [HeadersService],
})
export class HeadersModule {}

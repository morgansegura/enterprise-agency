import { Module } from "@nestjs/common";
import { MenusController } from "./menus.controller";
import { MenusService } from "./menus.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [MenusController],
  providers: [MenusService, PrismaService, AuditLogService],
  exports: [MenusService],
})
export class MenusModule {}

import { Module } from "@nestjs/common";
import { FootersController } from "./footers.controller";
import { FootersService } from "./footers.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [FootersController],
  providers: [FootersService, PrismaService, AuditLogService],
  exports: [FootersService],
})
export class FootersModule {}

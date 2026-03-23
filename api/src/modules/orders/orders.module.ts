import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, AuditLogService],
  exports: [OrdersService],
})
export class OrdersModule {}

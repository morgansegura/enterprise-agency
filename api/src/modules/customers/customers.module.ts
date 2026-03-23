import { Module } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PrismaService, AuditLogService],
  exports: [CustomersService],
})
export class CustomersModule {}

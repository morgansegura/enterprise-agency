import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, AuditLogService],
  exports: [ProductsService],
})
export class ProductsModule {}

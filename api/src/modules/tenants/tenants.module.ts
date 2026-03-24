import { Module } from "@nestjs/common";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";
import { RolesGuard } from "@/common/guards/roles.guard";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [TenantsController],
  providers: [TenantsService, PrismaService, AuditLogService, RolesGuard],
  exports: [TenantsService],
})
export class TenantsModule {}

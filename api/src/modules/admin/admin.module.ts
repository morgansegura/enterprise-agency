import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { TenantsModule } from "../tenants/tenants.module";
import { AdminUsersController } from "./controllers/admin-users.controller";
import { AdminTenantsController } from "./controllers/admin-tenants.controller";
import { AdminFeaturesController } from "./controllers/admin-features.controller";
import { AdminProjectsController } from "./controllers/admin-projects.controller";
import { AdminUsersService } from "./services/admin-users.service";
import { AdminTenantsService } from "./services/admin-tenants.service";
import { AdminFeaturesService } from "./services/admin-features.service";
import { AdminProjectsService } from "./services/admin-projects.service";
import { AuditLogService } from "./services/audit-log.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  imports: [UsersModule, TenantsModule],
  controllers: [
    AdminUsersController,
    AdminTenantsController,
    AdminFeaturesController,
    AdminProjectsController,
  ],
  providers: [
    PrismaService,
    AdminUsersService,
    AdminTenantsService,
    AdminFeaturesService,
    AdminProjectsService,
    AuditLogService,
  ],
  exports: [
    AdminUsersService,
    AdminTenantsService,
    AdminFeaturesService,
    AdminProjectsService,
    AuditLogService,
  ],
})
export class AdminModule {}

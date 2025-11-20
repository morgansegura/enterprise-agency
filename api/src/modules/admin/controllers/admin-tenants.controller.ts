import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles, AgencyRole } from "@/common/decorators/roles.decorator";
import { AdminTenantsService } from "../services/admin-tenants.service";

@Controller("admin/tenants")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AgencyRole.OWNER, AgencyRole.ADMIN)
export class AdminTenantsController {
  constructor(private readonly tenantsService: AdminTenantsService) {}

  @Get()
  async getAllTenants() {
    return this.tenantsService.getAllTenantsWithStats();
  }

  @Get(":id/stats")
  async getTenantStats(@Param("id") id: string) {
    return this.tenantsService.getTenantStats(id);
  }

  @Get(":id/activity")
  async getTenantActivity(
    @Param("id") id: string,
    @Query("days") days?: string,
  ) {
    return this.tenantsService.getTenantActivity(
      id,
      days ? parseInt(days) : 30,
    );
  }
}

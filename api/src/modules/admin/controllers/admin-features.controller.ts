import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles, AgencyRole } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AdminFeaturesService } from "../services/admin-features.service";
import {
  UpdateFeaturesDto,
  ToggleFeatureDto,
} from "../dto/feature-management.dto";

@Controller("admin/features")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AgencyRole.OWNER, AgencyRole.ADMIN)
export class AdminFeaturesController {
  constructor(private readonly featuresService: AdminFeaturesService) {}

  @Get("available")
  async getAvailableFeatures() {
    return this.featuresService.getAvailableFeatures();
  }

  @Get("tenant/:tenantId")
  async getTenantFeatures(@Param("tenantId") tenantId: string) {
    return this.featuresService.getTenantFeatures(tenantId);
  }

  @Put("tenant/:tenantId")
  async updateTenantFeatures(
    @Param("tenantId") tenantId: string,
    @Body() data: UpdateFeaturesDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.featuresService.updateFeatures(tenantId, data, user.userId);
  }

  @Post("tenant/:tenantId/toggle")
  async toggleFeature(
    @Param("tenantId") tenantId: string,
    @Body() data: ToggleFeatureDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.featuresService.toggleFeature(tenantId, data, user.userId);
  }
}

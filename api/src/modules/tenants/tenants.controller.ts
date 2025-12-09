import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { TenantsService } from "./tenants.service";
import { UsersService } from "@/modules/users/users.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { CreateDomainDto } from "./dto/create-domain.dto";
import { UpdateDesignTokensDto } from "./dto/update-design-tokens.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Roles } from "@/common/decorators/roles.decorator";

@Controller("tenants")
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async listTenants() {
    return this.tenantsService.findAll();
  }

  /**
   * Get health overview for all tenants (agency dashboard)
   * GET /tenants/health/overview
   * Must be above :id route to avoid "health" being treated as an id
   */
  @Get("health/overview")
  async getAllTenantsHealth() {
    return this.tenantsService.getAllTenantsHealth();
  }

  @Post()
  async createTenant(
    @CurrentUser() currentUser: { id: string; sessionId: string },
    @Body() createData: CreateTenantDto,
  ) {
    // Get user from database by Clerk ID
    const user = await this.usersService.findByClerkId(currentUser.id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.tenantsService.create(createData, user.id);
  }

  @Get("slug/:slug")
  async getTenantBySlug(@Param("slug") slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @Get(":id")
  async getTenant(@Param("id") id: string) {
    return this.tenantsService.findById(id);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async updateTenant(
    @Param("id") id: string,
    @Body() updateData: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateData);
  }

  @Post(":id/domains")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async addDomain(
    @Param("id") tenantId: string,
    @Body() domainData: CreateDomainDto,
  ) {
    return this.tenantsService.addDomain(tenantId, domainData);
  }

  @Delete(":id/domains/:domainId")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async removeDomain(
    @Param("id") tenantId: string,
    @Param("domainId") domainId: string,
  ) {
    return this.tenantsService.removeDomain(tenantId, domainId);
  }

  /**
   * Get all users for a tenant
   * GET /tenants/:id/users
   */
  @Get(":id/users")
  async getTenantUsers(@Param("id") tenantId: string) {
    return this.tenantsService.getUsers(tenantId);
  }

  /**
   * Add user to tenant
   * POST /tenants/:id/users
   */
  @Post(":id/users")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async addUserToTenant(
    @Param("id") tenantId: string,
    @Body() data: { userId: string; role?: string },
  ) {
    return this.tenantsService.addUser(
      tenantId,
      data.userId,
      data.role || "editor",
    );
  }

  /**
   * Update user role/permissions in tenant
   * PATCH /tenants/:id/users/:userId
   */
  @Patch(":id/users/:userId")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async updateTenantUser(
    @Param("id") tenantId: string,
    @Param("userId") userId: string,
    @Body() data: { role?: string; permissions?: Record<string, unknown> },
  ) {
    return this.tenantsService.updateUser(tenantId, userId, data);
  }

  /**
   * Remove user from tenant
   * DELETE /tenants/:id/users/:userId
   */
  @Delete(":id/users/:userId")
  @UseGuards(RolesGuard)
  @Roles("owner", "admin")
  async removeUserFromTenant(
    @Param("id") tenantId: string,
    @Param("userId") userId: string,
  ) {
    return this.tenantsService.removeUser(tenantId, userId);
  }

  /**
   * Get tenant design tokens
   * GET /tenants/:id/tokens
   */
  @Get(":id/tokens")
  async getDesignTokens(@Param("id") tenantId: string) {
    return this.tenantsService.getDesignTokens(tenantId);
  }

  /**
   * Update tenant design tokens
   * PUT /tenants/:id/tokens
   */
  @Put(":id/tokens")
  async updateDesignTokens(
    @Param("id") tenantId: string,
    @Body() tokensData: UpdateDesignTokensDto,
  ) {
    return this.tenantsService.updateDesignTokens(tenantId, tokensData);
  }

  /**
   * Get tenant statistics/analytics
   * GET /tenants/:id/stats
   */
  @Get(":id/stats")
  async getTenantStats(@Param("id") tenantId: string) {
    return this.tenantsService.getStats(tenantId);
  }
}

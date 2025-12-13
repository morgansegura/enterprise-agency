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
} from "@nestjs/common";
import { TenantType } from "@prisma";
import { TenantsService } from "./tenants.service";
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
  constructor(private readonly tenantsService: TenantsService) {}

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

  /**
   * Get the primary/marketing site tenant
   * GET /tenants/primary
   */
  @Get("primary")
  async getPrimaryTenant() {
    return this.tenantsService.findPrimary();
  }

  /**
   * Get tenant by domain
   * GET /tenants/domain/:domain
   */
  @Get("domain/:domain")
  async getTenantByDomain(@Param("domain") domain: string) {
    return this.tenantsService.findByDomain(domain);
  }

  // ============================================
  // TENANT HIERARCHY ENDPOINTS
  // ============================================

  /**
   * Get the agency tenant (root of all tenants)
   * GET /tenants/agency
   */
  @Get("agency")
  async getAgencyTenant() {
    return this.tenantsService.getAgencyTenant();
  }

  /**
   * Get all tenants accessible to the current user (for tenant switcher)
   * GET /tenants/accessible
   */
  @Get("accessible")
  async getAccessibleTenants(
    @CurrentUser() currentUser: { id: string; sessionId: string },
  ) {
    return this.tenantsService.getAccessibleTenants(currentUser.id);
  }

  /**
   * Get tenants by type
   * GET /tenants/type/:type
   */
  @Get("type/:type")
  async getTenantsByType(@Param("type") type: TenantType) {
    return this.tenantsService.findByTenantType(type);
  }

  /**
   * Set a tenant as the primary/marketing site
   * POST /tenants/:id/set-primary
   */
  @Post(":id/set-primary")
  @UseGuards(RolesGuard)
  @Roles("owner")
  async setPrimaryTenant(@Param("id") id: string) {
    return this.tenantsService.setPrimary(id);
  }

  @Post()
  async createTenant(
    @CurrentUser() currentUser: { id: string; sessionId: string },
    @Body() createData: CreateTenantDto,
  ) {
    // currentUser.id is already the database user ID from JWT
    return this.tenantsService.create(createData, currentUser.id);
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

  // ============================================
  // TENANT HIERARCHY PARAMETERIZED ENDPOINTS
  // ============================================

  /**
   * Get child tenants of a parent tenant
   * GET /tenants/:id/children
   */
  @Get(":id/children")
  async getChildTenants(@Param("id") parentTenantId: string) {
    return this.tenantsService.getChildTenants(parentTenantId);
  }

  /**
   * Get full tenant hierarchy (ancestors + children)
   * GET /tenants/:id/hierarchy
   */
  @Get(":id/hierarchy")
  async getTenantHierarchy(@Param("id") tenantId: string) {
    return this.tenantsService.getTenantHierarchy(tenantId);
  }

  /**
   * Check if current user has access to a tenant
   * GET /tenants/:id/access
   */
  @Get(":id/access")
  async checkTenantAccess(
    @Param("id") tenantId: string,
    @CurrentUser() currentUser: { id: string; sessionId: string },
  ) {
    return this.tenantsService.checkUserTenantAccess(currentUser.id, tenantId);
  }
}

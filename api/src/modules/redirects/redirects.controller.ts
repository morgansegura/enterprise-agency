import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { RedirectsService } from "./redirects.service";
import { CreateRedirectDto } from "./dto/create-redirect.dto";
import { UpdateRedirectDto } from "./dto/update-redirect.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { TenantId } from "@/common/decorators/tenant.decorator";

@Controller("redirects")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  /**
   * Create a new redirect
   */
  @Post()
  @Permissions(Permission.REDIRECTS_CREATE)
  create(
    @TenantId() tenantId: string,
    @Body() createRedirectDto: CreateRedirectDto,
  ) {
    return this.redirectsService.create(tenantId, createRedirectDto);
  }

  /**
   * List all redirects for a tenant (paginated)
   */
  @Get()
  @Permissions(Permission.REDIRECTS_VIEW)
  findAll(
    @TenantId() tenantId: string,
    @Query("search") search?: string,
    @Query("isActive", new DefaultValuePipe(undefined))
    isActive?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.redirectsService.findAll(tenantId, {
      search,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
      page,
      limit,
    });
  }

  /**
   * Get a single redirect by ID
   */
  @Get(":id")
  @Permissions(Permission.REDIRECTS_VIEW)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.redirectsService.findOne(tenantId, id);
  }

  /**
   * Update a redirect
   */
  @Patch(":id")
  @Permissions(Permission.REDIRECTS_EDIT)
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateRedirectDto: UpdateRedirectDto,
  ) {
    return this.redirectsService.update(tenantId, id, updateRedirectDto);
  }

  /**
   * Delete a redirect
   */
  @Delete(":id")
  @Permissions(Permission.REDIRECTS_DELETE)
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.redirectsService.remove(tenantId, id);
  }
}

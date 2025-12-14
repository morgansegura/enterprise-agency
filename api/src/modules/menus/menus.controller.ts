import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { CurrentTenant } from "@/common/decorators/current-tenant.decorator";
import { MenusService } from "./menus.service";
import { CreateMenuDto, UpdateMenuDto } from "./dto";

@ApiTags("Menus")
@ApiBearerAuth()
@Controller("tenants/:tenantId/menus")
@UseGuards(JwtAuthGuard, TenantGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: "Create a new menu" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 201, description: "Menu created successfully" })
  @ApiResponse({ status: 409, description: "Menu with slug already exists" })
  async create(@CurrentTenant() tenantId: string, @Body() dto: CreateMenuDto) {
    return this.menusService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List all menus for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Menus retrieved successfully" })
  async findAll(@CurrentTenant() tenantId: string) {
    return this.menusService.findAll(tenantId);
  }

  @Get("default")
  @ApiOperation({ summary: "Get the default menu for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Default menu retrieved" })
  async findDefault(@CurrentTenant() tenantId: string) {
    return this.menusService.findDefault(tenantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a menu by ID" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiResponse({ status: 200, description: "Menu retrieved successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async findOne(@CurrentTenant() tenantId: string, @Param("id") id: string) {
    return this.menusService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a menu by slug" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "slug", description: "Menu slug" })
  @ApiResponse({ status: 200, description: "Menu retrieved successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async findBySlug(
    @CurrentTenant() tenantId: string,
    @Param("slug") slug: string,
  ) {
    return this.menusService.findBySlug(tenantId, slug);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a menu" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiResponse({ status: 200, description: "Menu updated successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  @ApiResponse({ status: 409, description: "Menu with slug already exists" })
  async update(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menusService.update(tenantId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a menu" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiResponse({ status: 200, description: "Menu deleted successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async remove(@CurrentTenant() tenantId: string, @Param("id") id: string) {
    return this.menusService.remove(tenantId, id);
  }

  @Post(":id/duplicate")
  @ApiOperation({ summary: "Duplicate a menu" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Menu ID to duplicate" })
  @ApiResponse({ status: 201, description: "Menu duplicated successfully" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async duplicate(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string },
  ) {
    return this.menusService.duplicate(tenantId, id, body.name);
  }

  @Post(":id/save-to-library")
  @ApiOperation({ summary: "Save menu to component library" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Menu ID" })
  @ApiResponse({ status: 201, description: "Menu saved to library" })
  @ApiResponse({ status: 404, description: "Menu not found" })
  async saveToLibrary(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.menusService.saveToLibrary(tenantId, id, body);
  }
}

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
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { FootersService } from "./footers.service";
import { CreateFooterDto } from "./dto/create-footer.dto";
import { UpdateFooterDto } from "./dto/update-footer.dto";

@ApiTags("Footers")
@ApiBearerAuth()
@Controller("tenants/:tenantId/footers")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class FootersController {
  constructor(private readonly footersService: FootersService) {}

  @Post()
  @Permissions(Permission.FOOTERS_CREATE)
  @ApiOperation({ summary: "Create a new footer" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 201, description: "Footer created successfully" })
  @ApiResponse({ status: 409, description: "Footer with slug already exists" })
  async create(@TenantId() tenantId: string, @Body() dto: CreateFooterDto) {
    return this.footersService.create(tenantId, dto);
  }

  @Get()
  @Permissions(Permission.FOOTERS_VIEW)
  @ApiOperation({ summary: "List all footers for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Footers retrieved successfully" })
  async findAll(@TenantId() tenantId: string) {
    return this.footersService.findAll(tenantId);
  }

  @Get("default")
  @Permissions(Permission.FOOTERS_VIEW)
  @ApiOperation({ summary: "Get the default footer for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Default footer retrieved" })
  async findDefault(@TenantId() tenantId: string) {
    return this.footersService.findDefault(tenantId);
  }

  @Get(":id")
  @Permissions(Permission.FOOTERS_VIEW)
  @ApiOperation({ summary: "Get a footer by ID" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Footer ID" })
  @ApiResponse({ status: 200, description: "Footer retrieved successfully" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  async findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.footersService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @Permissions(Permission.FOOTERS_VIEW)
  @ApiOperation({ summary: "Get a footer by slug" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "slug", description: "Footer slug" })
  @ApiResponse({ status: 200, description: "Footer retrieved successfully" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  async findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.footersService.findBySlug(tenantId, slug);
  }

  @Put(":id")
  @Permissions(Permission.FOOTERS_EDIT)
  @ApiOperation({ summary: "Update a footer" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Footer ID" })
  @ApiResponse({ status: 200, description: "Footer updated successfully" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  @ApiResponse({ status: 409, description: "Footer with slug already exists" })
  async update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFooterDto,
  ) {
    return this.footersService.update(tenantId, id, dto);
  }

  @Delete(":id")
  @Permissions(Permission.FOOTERS_DELETE)
  @ApiOperation({ summary: "Delete a footer" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Footer ID" })
  @ApiResponse({ status: 200, description: "Footer deleted successfully" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  async remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.footersService.remove(tenantId, id);
  }

  @Post(":id/duplicate")
  @Permissions(Permission.FOOTERS_CREATE)
  @ApiOperation({ summary: "Duplicate a footer" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Footer ID to duplicate" })
  @ApiResponse({ status: 201, description: "Footer duplicated successfully" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  async duplicate(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string },
  ) {
    return this.footersService.duplicate(tenantId, id, body.name);
  }

  @Post(":id/save-to-library")
  @Permissions(Permission.LIBRARY_CREATE)
  @ApiOperation({ summary: "Save footer to component library" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Footer ID" })
  @ApiResponse({ status: 201, description: "Footer saved to library" })
  @ApiResponse({ status: 404, description: "Footer not found" })
  async saveToLibrary(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.footersService.saveToLibrary(tenantId, id, body);
  }
}

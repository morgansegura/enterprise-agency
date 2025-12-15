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
import { TenantId } from "@/common/decorators/tenant.decorator";
import { HeadersService } from "./headers.service";
import { CreateHeaderDto, UpdateHeaderDto } from "./dto";

@ApiTags("Headers")
@ApiBearerAuth()
@Controller("tenants/:tenantId/headers")
@UseGuards(JwtAuthGuard, TenantGuard)
export class HeadersController {
  constructor(private readonly headersService: HeadersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new header" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 201, description: "Header created successfully" })
  @ApiResponse({ status: 409, description: "Header with slug already exists" })
  async create(@TenantId() tenantId: string, @Body() dto: CreateHeaderDto) {
    return this.headersService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List all headers for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Headers retrieved successfully" })
  async findAll(@TenantId() tenantId: string) {
    return this.headersService.findAll(tenantId);
  }

  @Get("default")
  @ApiOperation({ summary: "Get the default header for tenant" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiResponse({ status: 200, description: "Default header retrieved" })
  async findDefault(@TenantId() tenantId: string) {
    return this.headersService.findDefault(tenantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a header by ID" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Header ID" })
  @ApiResponse({ status: 200, description: "Header retrieved successfully" })
  @ApiResponse({ status: 404, description: "Header not found" })
  async findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.headersService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a header by slug" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "slug", description: "Header slug" })
  @ApiResponse({ status: 200, description: "Header retrieved successfully" })
  @ApiResponse({ status: 404, description: "Header not found" })
  async findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.headersService.findBySlug(tenantId, slug);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a header" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Header ID" })
  @ApiResponse({ status: 200, description: "Header updated successfully" })
  @ApiResponse({ status: 404, description: "Header not found" })
  @ApiResponse({ status: 409, description: "Header with slug already exists" })
  async update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateHeaderDto,
  ) {
    return this.headersService.update(tenantId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a header" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Header ID" })
  @ApiResponse({ status: 200, description: "Header deleted successfully" })
  @ApiResponse({ status: 404, description: "Header not found" })
  async remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.headersService.remove(tenantId, id);
  }

  @Post(":id/duplicate")
  @ApiOperation({ summary: "Duplicate a header" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Header ID to duplicate" })
  @ApiResponse({ status: 201, description: "Header duplicated successfully" })
  @ApiResponse({ status: 404, description: "Header not found" })
  async duplicate(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string },
  ) {
    return this.headersService.duplicate(tenantId, id, body.name);
  }

  @Post(":id/save-to-library")
  @ApiOperation({ summary: "Save header to component library" })
  @ApiParam({ name: "tenantId", description: "Tenant ID" })
  @ApiParam({ name: "id", description: "Header ID" })
  @ApiResponse({ status: 201, description: "Header saved to library" })
  @ApiResponse({ status: 404, description: "Header not found" })
  async saveToLibrary(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.headersService.saveToLibrary(tenantId, id, body);
  }
}

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
import { LibraryService } from "./library.service";
import { CreateLibraryItemDto, UpdateLibraryItemDto } from "./dto/library.dto";

@ApiTags("Library")
@ApiBearerAuth()
@Controller("tenants/:tenantId/library")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class LibraryController {
  constructor(private readonly library: LibraryService) {}

  @Get()
  @Permissions(Permission.LIBRARY_VIEW)
  @ApiOperation({ summary: "List library items" })
  @ApiParam({ name: "tenantId", type: String })
  @ApiResponse({ status: 200, description: "List of library items" })
  list(
    @TenantId() tenantId: string,
    @Query("type") type?: "SECTION" | "BLOCK",
    @Query("category") category?: string,
    @Query("search") search?: string,
    @Query("scope") scope?: "TENANT" | "GLOBAL" | "ALL",
  ) {
    return this.library.list(tenantId, { type, category, search, scope });
  }

  @Get(":id")
  @Permissions(Permission.LIBRARY_VIEW)
  @ApiOperation({ summary: "Get a library item by ID" })
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.library.findOne(tenantId, id);
  }

  @Post()
  @Permissions(Permission.LIBRARY_CREATE)
  @ApiOperation({ summary: "Save an element to the library" })
  create(@TenantId() tenantId: string, @Body() dto: CreateLibraryItemDto) {
    return this.library.create(tenantId, dto);
  }

  @Patch(":id")
  @Permissions(Permission.LIBRARY_EDIT)
  @ApiOperation({ summary: "Update library item metadata" })
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateLibraryItemDto,
  ) {
    return this.library.update(tenantId, id, dto);
  }

  @Delete(":id")
  @Permissions(Permission.LIBRARY_DELETE)
  @ApiOperation({ summary: "Delete a library item" })
  delete(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.library.delete(tenantId, id);
  }

  @Post(":id/use")
  @Permissions(Permission.LIBRARY_VIEW)
  @ApiOperation({ summary: "Increment usage count for a library item" })
  use(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.library.incrementUsage(tenantId, id);
  }
}

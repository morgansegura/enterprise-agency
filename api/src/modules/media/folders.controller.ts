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
import { FoldersService } from "./folders.service";
import { CreateFolderDto, UpdateFolderDto, MoveFolderDto } from "./dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { CurrentTenant } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("tenants/:tenantId/media/folders")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  /**
   * Create a new folder
   */
  @Post()
  @Permissions(Permission.MEDIA_EDIT)
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser("id") userId: string,
    @Body() dto: CreateFolderDto,
  ) {
    return this.foldersService.create(tenantId, userId, dto);
  }

  /**
   * Get folder tree
   */
  @Get("tree")
  @Permissions(Permission.MEDIA_VIEW)
  async getTree(@CurrentTenant() tenantId: string) {
    return this.foldersService.getTree(tenantId);
  }

  /**
   * List folders (flat)
   */
  @Get()
  @Permissions(Permission.MEDIA_VIEW)
  async list(
    @CurrentTenant() tenantId: string,
    @Query("parentId") parentId?: string,
  ) {
    return this.foldersService.list(
      tenantId,
      parentId === "null" ? null : parentId,
    );
  }

  /**
   * Get a single folder
   */
  @Get(":id")
  @Permissions(Permission.MEDIA_VIEW)
  async findById(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
  ) {
    return this.foldersService.findById(tenantId, id);
  }

  /**
   * Update folder (rename)
   */
  @Patch(":id")
  @Permissions(Permission.MEDIA_EDIT)
  async update(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateFolderDto,
  ) {
    return this.foldersService.update(tenantId, id, dto);
  }

  /**
   * Move folder to new parent
   */
  @Patch(":id/move")
  @Permissions(Permission.MEDIA_EDIT)
  async move(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: MoveFolderDto,
  ) {
    return this.foldersService.move(tenantId, id, dto);
  }

  /**
   * Delete folder
   */
  @Delete(":id")
  @Permissions(Permission.MEDIA_DELETE)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Query("deleteContents") deleteContents?: string,
  ) {
    return this.foldersService.delete(
      tenantId,
      id,
      deleteContents === "true",
    );
  }
}

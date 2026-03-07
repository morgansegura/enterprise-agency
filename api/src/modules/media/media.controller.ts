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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";
import {
  MediaQueryDto,
  UpdateMediaDto,
  MoveMediaDto,
  BulkMoveDto,
  BulkDeleteDto,
  BulkTagDto,
  CropMediaDto,
  UploadMediaDto,
} from "./dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { CurrentTenant } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("tenants/:tenantId/media")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  // ============================================================================
  // QUERY ENDPOINTS
  // ============================================================================

  /**
   * List media with filters
   */
  @Get()
  @Permissions(Permission.MEDIA_VIEW)
  async list(
    @CurrentTenant() tenantId: string,
    @Query() query: MediaQueryDto,
  ) {
    return this.mediaService.list(tenantId, query);
  }

  /**
   * Get a single media item
   */
  @Get(":id")
  @Permissions(Permission.MEDIA_VIEW)
  async findById(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
  ) {
    return this.mediaService.findById(tenantId, id);
  }

  // ============================================================================
  // UPLOAD ENDPOINTS
  // ============================================================================

  /**
   * Upload a file
   */
  @Post("upload")
  @Permissions(Permission.MEDIA_UPLOAD)
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @CurrentTenant() tenantId: string,
    @CurrentUser("id") userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: UploadMediaDto,
  ) {
    return this.mediaService.upload(file, tenantId, userId, metadata);
  }

  // ============================================================================
  // UPDATE ENDPOINTS
  // ============================================================================

  /**
   * Update media metadata
   */
  @Patch(":id")
  @Permissions(Permission.MEDIA_EDIT)
  async update(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateMediaDto,
  ) {
    return this.mediaService.update(tenantId, id, dto);
  }

  /**
   * Move media to folder
   */
  @Patch(":id/move")
  @Permissions(Permission.MEDIA_EDIT)
  async move(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: MoveMediaDto,
  ) {
    return this.mediaService.move(tenantId, id, dto);
  }

  /**
   * Crop an image
   */
  @Post(":id/crop")
  @Permissions(Permission.MEDIA_EDIT)
  async crop(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: CropMediaDto,
  ) {
    return this.mediaService.crop(tenantId, id, dto);
  }

  // ============================================================================
  // DELETE ENDPOINTS
  // ============================================================================

  /**
   * Delete a media item
   */
  @Delete(":id")
  @Permissions(Permission.MEDIA_DELETE)
  async delete(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
  ) {
    return this.mediaService.delete(tenantId, id);
  }

  // ============================================================================
  // BULK ENDPOINTS
  // ============================================================================

  /**
   * Bulk move media to folder
   */
  @Post("bulk/move")
  @Permissions(Permission.MEDIA_EDIT)
  async bulkMove(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkMoveDto,
  ) {
    return this.mediaService.bulkMove(tenantId, dto);
  }

  /**
   * Bulk delete media
   */
  @Post("bulk/delete")
  @Permissions(Permission.MEDIA_DELETE)
  async bulkDelete(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkDeleteDto,
  ) {
    return this.mediaService.bulkDelete(tenantId, dto);
  }

  /**
   * Bulk add tags
   */
  @Post("bulk/tag")
  @Permissions(Permission.MEDIA_EDIT)
  async bulkTag(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkTagDto,
  ) {
    return this.mediaService.bulkTag(tenantId, dto);
  }

  /**
   * Bulk remove tags
   */
  @Post("bulk/untag")
  @Permissions(Permission.MEDIA_EDIT)
  async bulkUntag(
    @CurrentTenant() tenantId: string,
    @Body() dto: BulkTagDto,
  ) {
    return this.mediaService.bulkUntag(tenantId, dto);
  }
}

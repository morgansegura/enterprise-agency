import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AssetsService } from "./assets.service";
import { UsersService } from "@/modules/users/users.service";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import { UploadAssetDto } from "./dto/upload-asset.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";

@Controller("assets")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly usersService: UsersService,
  ) {}

  @Post("upload")
  @Permissions(Permission.MEDIA_UPLOAD)
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: { id: string; sessionId: string },
    @Body() uploadDto: UploadAssetDto,
  ) {
    // Get database user ID from Clerk ID
    const user = await this.usersService.findByClerkId(currentUser.id);

    return this.assetsService.upload(file, tenantId, user.id, {
      altText: uploadDto.altText,
      usageContext: uploadDto.usageContext,
    });
  }

  @Get()
  @Permissions(Permission.MEDIA_VIEW)
  async list(
    @TenantId() tenantId: string,
    @Query("fileType") fileType?: string,
    @Query("usageContext") usageContext?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.assetsService.list(tenantId, {
      fileType,
      usageContext,
      page,
      limit,
    });
  }

  @Get(":id")
  @Permissions(Permission.MEDIA_VIEW)
  async getById(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.assetsService.findById(id, tenantId);
  }

  @Patch(":id")
  @Permissions(Permission.MEDIA_EDIT)
  async update(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: UpdateAssetDto,
  ) {
    return this.assetsService.update(id, tenantId, updateDto);
  }

  @Delete(":id")
  @Permissions(Permission.MEDIA_DELETE)
  async delete(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.assetsService.delete(id, tenantId);
  }
}

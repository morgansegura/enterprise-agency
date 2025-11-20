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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AssetsService } from "./assets.service";
import { UsersService } from "@/modules/users/users.service";
import { UpdateAssetDto } from "./dto/update-asset.dto";
import { UploadAssetDto } from "./dto/upload-asset.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";

@Controller("assets")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly usersService: UsersService,
  ) {}

  @Post("upload")
  @Roles("owner", "admin", "editor")
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
  @Roles("owner", "admin", "editor", "viewer")
  async list(
    @TenantId() tenantId: string,
    @Query("fileType") fileType?: string,
    @Query("usageContext") usageContext?: string,
  ) {
    return this.assetsService.list(tenantId, {
      fileType,
      usageContext,
    });
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  async getById(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.assetsService.findById(id, tenantId);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  async update(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Body() updateDto: UpdateAssetDto,
  ) {
    return this.assetsService.update(id, tenantId, updateDto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  async delete(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.assetsService.delete(id, tenantId);
  }
}

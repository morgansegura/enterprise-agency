import { Controller, Get, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getCurrentUser(@CurrentUser() user: { id: string; sessionId: string }) {
    return this.usersService.findByClerkId(user.id);
  }

  @Patch("me")
  async updateCurrentUser(
    @CurrentUser() user: { id: string; sessionId: string },
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateData);
  }

  @Get("tenant")
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_VIEW)
  async getTenantUsers(@TenantId() tenantId: string) {
    if (!tenantId) {
      return [];
    }
    return this.usersService.getUsersForTenant(tenantId);
  }

  @Get(":id")
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_VIEW)
  async getUser(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.usersService.findById(id, tenantId);
  }
}

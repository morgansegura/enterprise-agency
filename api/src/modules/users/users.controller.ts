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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ListUsersDto } from "./dto/list-users.dto";
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

  @Post()
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_EDIT)
  async createUser(
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: { id: string },
    @Body() createData: CreateUserDto,
  ) {
    return this.usersService.create(tenantId, createData, currentUser.id);
  }

  @Get("tenant")
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_VIEW)
  async getTenantUsers(
    @TenantId() tenantId: string,
    @Query() query: ListUsersDto,
  ) {
    if (!tenantId) {
      return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }
    return this.usersService.getUsersForTenant(tenantId, query);
  }

  @Get(":id")
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_VIEW)
  async getUser(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.usersService.findById(id, tenantId);
  }

  @Delete(":id")
  @UseGuards(TenantAccessGuard, PermissionGuard)
  @Permissions(Permission.USERS_DELETE)
  async deactivateUser(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.usersService.deactivate(id, tenantId, currentUser.id);
  }
}

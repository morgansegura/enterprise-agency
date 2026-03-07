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
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { TenantRole } from "@/common/permissions";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AdminUsersService } from "../services/admin-users.service";
import { CreateUserDto, InviteUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TenantRole.SUPERADMIN, TenantRole.AGENCY_ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Get()
  async getAllUsers(@Query("includeDeleted") includeDeleted?: string) {
    return this.usersService.findAll(includeDeleted === "true");
  }

  @Get("search")
  async searchUsers(@Query("q") query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(TenantRole.SUPERADMIN)
  async createUser(
    @Body() data: CreateUserDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.usersService.create(data, user.userId);
  }

  @Post("invite")
  async inviteUser(
    @Body() data: InviteUserDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.usersService.invite(data, user.userId);
  }

  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() data: UpdateUserDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.usersService.update(id, data, user.userId);
  }

  @Delete(":id")
  @Roles(TenantRole.SUPERADMIN)
  async deleteUser(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.usersService.delete(id, user.userId);
  }
}

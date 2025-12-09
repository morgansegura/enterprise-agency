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
import { Roles, AgencyRole } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AdminProjectsService } from "../services/admin-projects.service";
import {
  CreateProjectAssignmentDto,
  UpdateProjectAssignmentDto,
} from "../dto/project-assignment.dto";

@Controller("admin/projects")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AgencyRole.OWNER, AgencyRole.ADMIN)
export class AdminProjectsController {
  constructor(private readonly projectsService: AdminProjectsService) {}

  @Get("assignments")
  async getAssignments(
    @Query("tenantId") tenantId?: string,
    @Query("userId") userId?: string,
  ) {
    return this.projectsService.getProjectAssignments(tenantId, userId);
  }

  @Get("assignments/:id")
  async getAssignment(@Param("id") id: string) {
    return this.projectsService.getAssignment(id);
  }

  @Post("assignments")
  async createAssignment(
    @Body() data: CreateProjectAssignmentDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.projectsService.createAssignment(data, user.userId);
  }

  @Patch("assignments/:id")
  async updateAssignment(
    @Param("id") id: string,
    @Body() data: UpdateProjectAssignmentDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.projectsService.updateAssignment(id, data, user.userId);
  }

  @Delete("assignments/:id")
  async deleteAssignment(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.projectsService.deleteAssignment(id, user.userId);
  }
}

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
import { PagesService } from "./pages.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("pages")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @Roles("owner", "admin", "editor")
  create(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(tenantId, user.id, createPageDto);
  }

  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("template") template?: string,
    @Query("search") search?: string,
  ) {
    return this.pagesService.findAll(tenantId, { status, template, search });
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @Roles("owner", "admin", "editor", "viewer")
  findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.pagesService.findBySlug(tenantId, slug);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(tenantId, id, updatePageDto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.remove(tenantId, id);
  }

  @Post(":id/publish")
  @Roles("owner", "admin", "editor")
  publish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.publish(tenantId, id);
  }

  @Post(":id/unpublish")
  @Roles("owner", "admin", "editor")
  unpublish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.pagesService.unpublish(tenantId, id);
  }

  @Post(":id/duplicate")
  @Roles("owner", "admin", "editor")
  duplicate(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Param("id") id: string,
  ) {
    return this.pagesService.duplicate(tenantId, user.id, id);
  }
}

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
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("posts")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles("owner", "admin", "editor")
  create(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(tenantId, user.id, createPostDto);
  }

  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("category") category?: string,
    @Query("tags") tags?: string,
    @Query("search") search?: string,
  ) {
    const tagsArray = tags ? tags.split(",") : undefined;
    return this.postsService.findAll(tenantId, {
      status,
      category,
      tags: tagsArray,
      search,
    });
  }

  @Get("categories")
  @Roles("owner", "admin", "editor", "viewer")
  getCategories(@TenantId() tenantId: string) {
    return this.postsService.getCategories(tenantId);
  }

  @Get("tags")
  @Roles("owner", "admin", "editor", "viewer")
  getTags(@TenantId() tenantId: string) {
    return this.postsService.getTags(tenantId);
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @Roles("owner", "admin", "editor", "viewer")
  findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.postsService.findBySlug(tenantId, slug);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(tenantId, id, updatePostDto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.remove(tenantId, id);
  }

  @Post(":id/publish")
  @Roles("owner", "admin", "editor")
  publish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.publish(tenantId, id);
  }

  @Post(":id/unpublish")
  @Roles("owner", "admin", "editor")
  unpublish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.unpublish(tenantId, id);
  }

  @Post(":id/duplicate")
  @Roles("owner", "admin", "editor")
  duplicate(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string; sessionId: string },
    @Param("id") id: string,
  ) {
    return this.postsService.duplicate(tenantId, user.id, id);
  }
}

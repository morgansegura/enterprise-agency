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
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("posts")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Permissions(Permission.BLOG_CREATE)
  create(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(tenantId, user.id, createPostDto);
  }

  @Get()
  @Permissions(Permission.BLOG_VIEW)
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("category") category?: string,
    @Query("tags") tags?: string,
    @Query("search") search?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const tagsArray = tags ? tags.split(",") : undefined;
    return this.postsService.findAll(tenantId, {
      status,
      category,
      tags: tagsArray,
      search,
      page,
      limit,
    });
  }

  @Get("categories")
  @Permissions(Permission.BLOG_VIEW)
  getCategories(@TenantId() tenantId: string) {
    return this.postsService.getCategories(tenantId);
  }

  @Get("tags")
  @Permissions(Permission.BLOG_VIEW)
  getTags(@TenantId() tenantId: string) {
    return this.postsService.getTags(tenantId);
  }

  @Get(":id")
  @Permissions(Permission.BLOG_VIEW)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.findOne(tenantId, id);
  }

  @Get("slug/:slug")
  @Permissions(Permission.BLOG_VIEW)
  findBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.postsService.findBySlug(tenantId, slug);
  }

  @Patch(":id")
  @Permissions(Permission.BLOG_EDIT)
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(tenantId, id, updatePostDto);
  }

  @Delete(":id")
  @Permissions(Permission.BLOG_DELETE)
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.remove(tenantId, id);
  }

  @Post(":id/publish")
  @Permissions(Permission.BLOG_PUBLISH)
  publish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.publish(tenantId, id);
  }

  @Post(":id/unpublish")
  @Permissions(Permission.BLOG_PUBLISH)
  unpublish(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.postsService.unpublish(tenantId, id);
  }

  @Post(":id/duplicate")
  @Permissions(Permission.BLOG_CREATE)
  duplicate(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
  ) {
    return this.postsService.duplicate(tenantId, user.id, id);
  }
}

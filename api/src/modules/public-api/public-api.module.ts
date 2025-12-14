import { Module } from "@nestjs/common";
import { PublicApiController } from "./public-api.controller";
import { PublicApiService } from "./public-api.service";
import { PrismaService } from "@/common/services/prisma.service";
import { PreviewModule } from "@/modules/preview/preview.module";

/**
 * Public API Module
 *
 * Provides unauthenticated endpoints for client frontends
 * to fetch published content (pages, posts, site config)
 *
 * Enterprise features:
 * - Tenant isolation
 * - Rate limiting
 * - HTTP caching
 * - OpenAPI documentation
 * - Preview mode support for draft content
 */
@Module({
  imports: [PreviewModule],
  controllers: [PublicApiController],
  providers: [PublicApiService, PrismaService],
  exports: [PublicApiService],
})
export class PublicApiModule {}

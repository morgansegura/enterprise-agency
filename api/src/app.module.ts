import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { LoggerModule } from "./common/logger";
import { HealthModule } from "./modules/health/health.module";
import { WebhooksModule } from "./modules/webhooks/webhooks.module";
import { UsersModule } from "./modules/users/users.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { PagesModule } from "./modules/pages/pages.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AssetsModule } from "./modules/assets/assets.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SiteConfigModule } from "./modules/site-config/site-config.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // Rate limiting (global default: 10 requests per minute)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (adjust based on needs)
      },
    ]),
    // Logger
    LoggerModule,
    // Core modules
    HealthModule,
    AuthModule,
    // Admin management
    AdminModule,
    // Content modules
    PagesModule,
    PostsModule,
    AssetsModule,
    // Multi-tenancy
    TenantsModule,
    UsersModule,
    SiteConfigModule,
    // Integrations
    WebhooksModule,
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant middleware to all routes except health check and webhooks
    consumer
      .apply(TenantMiddleware)
      .exclude("api/health(.*)", "api/webhooks(.*)")
      .forRoutes("*");
  }
}

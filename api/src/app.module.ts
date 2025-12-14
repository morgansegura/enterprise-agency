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
import { PublicApiModule } from "./modules/public-api/public-api.module";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PreviewModule } from "./modules/preview/preview.module";
import { MenusModule } from "./modules/menus/menus.module";

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
    // Public API (unauthenticated)
    PublicApiModule,
    // Admin management
    AdminModule,
    // Content modules
    PagesModule,
    PostsModule,
    AssetsModule,
    // E-Commerce modules
    ProductsModule,
    OrdersModule,
    CustomersModule,
    PaymentsModule,
    // Multi-tenancy
    TenantsModule,
    UsersModule,
    SiteConfigModule,
    // Preview system
    PreviewModule,
    // Builder components
    MenusModule,
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
    // Apply tenant middleware to all routes except health, webhooks, public API, and payment webhooks
    consumer
      .apply(TenantMiddleware)
      .exclude(
        "api/v1/health(.*)",
        "api/v1/webhooks(.*)",
        "api/v1/public(.*)",
        "api/v1/preview/validate(.*)",
        "api/v1/payments/webhooks(.*)",
      )
      .forRoutes("*");
  }
}

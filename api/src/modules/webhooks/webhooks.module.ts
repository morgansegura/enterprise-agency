import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { WebhooksService } from "./webhooks.service";
import { WebhookManagementController } from "./webhook-management.controller";
import { WebhookManagementService } from "./webhook-management.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [WebhooksController, WebhookManagementController],
  providers: [
    WebhooksService,
    WebhookManagementService,
    PrismaService,
    AuditLogService,
  ],
  exports: [WebhookManagementService],
})
export class WebhooksModule {}

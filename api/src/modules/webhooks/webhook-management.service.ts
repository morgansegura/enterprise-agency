import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";
import {
  AuditLogService,
  AuditAction,
} from "@/common/services/audit-log.service";
import { CreateWebhookDto, UpdateWebhookDto, ListWebhooksDto } from "./dto";

@Injectable()
export class WebhookManagementService {
  private readonly logger = new Logger(WebhookManagementService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditLogService,
  ) {}

  /**
   * Create a new webhook subscription for a tenant.
   */
  async create(tenantId: string, dto: CreateWebhookDto) {
    const webhook = await this.prisma.webhook.create({
      data: {
        tenantId,
        url: dto.url,
        events: dto.events,
        secret: dto.secret ?? null,
        status: dto.isActive === false ? "inactive" : "active",
      },
    });

    this.logger.log(`Webhook created: ${webhook.id} for tenant ${tenantId}`);
    this.audit.log({
      tenantId,
      action: AuditAction.CREATED,
      resourceType: "webhook",
      resourceId: webhook.id,
      metadata: { url: dto.url, events: dto.events },
    });

    return webhook;
  }

  /**
   * List webhooks for a tenant with pagination.
   */
  async findAll(tenantId: string, filters: ListWebhooksDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { tenantId };

    const [data, total] = await Promise.all([
      this.prisma.webhook.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          _count: {
            select: { deliveries: true },
          },
        },
      }),
      this.prisma.webhook.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single webhook by ID, scoped to tenant.
   */
  async findOne(tenantId: string, id: string) {
    const webhook = await this.prisma.webhook.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    });

    if (!webhook) {
      throw new NotFoundException(`Webhook ${id} not found`);
    }

    return webhook;
  }

  /**
   * Update a webhook subscription.
   */
  async update(tenantId: string, id: string, dto: UpdateWebhookDto) {
    // Verify ownership
    await this.findOne(tenantId, id);

    const data: Record<string, unknown> = {};
    if (dto.url !== undefined) data.url = dto.url;
    if (dto.events !== undefined) data.events = dto.events;
    if (dto.secret !== undefined) data.secret = dto.secret;
    if (dto.isActive !== undefined)
      data.status = dto.isActive ? "active" : "inactive";

    const webhook = await this.prisma.webhook.update({
      where: { id },
      data,
    });

    this.logger.log(`Webhook updated: ${webhook.id}`);
    this.audit.log({
      tenantId,
      action: AuditAction.UPDATED,
      resourceType: "webhook",
      resourceId: webhook.id,
      changes: data,
    });

    return webhook;
  }

  /**
   * Delete a webhook subscription.
   */
  async remove(tenantId: string, id: string) {
    // Verify ownership
    await this.findOne(tenantId, id);

    await this.prisma.webhook.delete({
      where: { id },
    });

    this.logger.log(`Webhook deleted: ${id}`);
    this.audit.log({
      tenantId,
      action: AuditAction.DELETED,
      resourceType: "webhook",
      resourceId: id,
    });

    return { deleted: true };
  }

  /**
   * List delivery attempts for a specific webhook.
   */
  async getDeliveries(
    tenantId: string,
    webhookId: string,
    pagination: { page?: number; limit?: number } = {},
  ) {
    // Verify the webhook belongs to this tenant
    await this.findOne(tenantId, webhookId);

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { webhookId };

    const [data, total] = await Promise.all([
      this.prisma.webhookDelivery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      this.prisma.webhookDelivery.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Send a test event to a webhook URL to verify connectivity.
   */
  async testWebhook(tenantId: string, id: string) {
    const webhook = await this.findOne(tenantId, id);

    const testPayload = {
      type: "webhook.test",
      data: {
        webhookId: webhook.id,
        tenantId,
        timestamp: new Date().toISOString(),
        message: "This is a test event from your webhook configuration.",
      },
    };

    // Create a delivery record for the test
    const delivery = await this.prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        eventType: "webhook.test",
        payload: testPayload,
        status: "pending",
        attempts: 1,
      },
    });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Webhook-Event": "webhook.test",
        "X-Webhook-Delivery": delivery.id,
      };

      // Include HMAC signature if secret is configured
      if (webhook.secret) {
        const crypto = await import("crypto");
        const signature = crypto
          .createHmac("sha256", webhook.secret)
          .update(JSON.stringify(testPayload))
          .digest("hex");
        headers["X-Webhook-Signature"] = `sha256=${signature}`;
      }

      const response = await fetch(webhook.url, {
        method: "POST",
        headers,
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const responseBody = await response.text().catch(() => "");

      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: response.ok ? "success" : "failed",
          statusCode: response.status,
          responseBody: responseBody.slice(0, 4096),
          deliveredAt: response.ok ? new Date() : null,
        },
      });

      // Update webhook tracking timestamps
      await this.prisma.webhook.update({
        where: { id: webhook.id },
        data: {
          lastTriggeredAt: new Date(),
          ...(response.ok
            ? { lastSuccessAt: new Date(), failureCount: 0 }
            : { lastFailureAt: new Date(), failureCount: { increment: 1 } }),
        },
      });

      return {
        success: response.ok,
        statusCode: response.status,
        deliveryId: delivery.id,
        responseBody: responseBody.slice(0, 1024),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "failed",
          errorMessage,
        },
      });

      await this.prisma.webhook.update({
        where: { id: webhook.id },
        data: {
          lastTriggeredAt: new Date(),
          lastFailureAt: new Date(),
          failureCount: { increment: 1 },
        },
      });

      throw new BadRequestException(`Webhook test failed: ${errorMessage}`);
    }
  }
}

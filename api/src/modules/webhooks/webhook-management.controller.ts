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
import { WebhookManagementService } from "./webhook-management.service";
import { CreateWebhookDto, UpdateWebhookDto, ListWebhooksDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";

@Controller("tenants/:tenantId/webhooks")
@UseGuards(JwtAuthGuard, TenantAccessGuard, PermissionGuard)
export class WebhookManagementController {
  constructor(
    private readonly webhookManagementService: WebhookManagementService,
  ) {}

  /**
   * GET /api/tenants/:tenantId/webhooks
   * List all webhooks for a tenant.
   */
  @Get()
  @Permissions(Permission.SETTINGS_VIEW)
  async findAll(
    @Param("tenantId") tenantId: string,
    @Query() query: ListWebhooksDto,
  ) {
    return this.webhookManagementService.findAll(tenantId, query);
  }

  /**
   * POST /api/tenants/:tenantId/webhooks
   * Create a new webhook subscription.
   */
  @Post()
  @Permissions(Permission.SETTINGS_EDIT)
  async create(
    @Param("tenantId") tenantId: string,
    @Body() dto: CreateWebhookDto,
  ) {
    return this.webhookManagementService.create(tenantId, dto);
  }

  /**
   * GET /api/tenants/:tenantId/webhooks/:id
   * Get a single webhook by ID.
   */
  @Get(":id")
  @Permissions(Permission.SETTINGS_VIEW)
  async findOne(@Param("tenantId") tenantId: string, @Param("id") id: string) {
    return this.webhookManagementService.findOne(tenantId, id);
  }

  /**
   * PATCH /api/tenants/:tenantId/webhooks/:id
   * Update a webhook subscription.
   */
  @Patch(":id")
  @Permissions(Permission.SETTINGS_EDIT)
  async update(
    @Param("tenantId") tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateWebhookDto,
  ) {
    return this.webhookManagementService.update(tenantId, id, dto);
  }

  /**
   * DELETE /api/tenants/:tenantId/webhooks/:id
   * Delete a webhook subscription.
   */
  @Delete(":id")
  @Permissions(Permission.SETTINGS_EDIT)
  async remove(@Param("tenantId") tenantId: string, @Param("id") id: string) {
    return this.webhookManagementService.remove(tenantId, id);
  }

  /**
   * GET /api/tenants/:tenantId/webhooks/:id/deliveries
   * List delivery attempts for a webhook.
   */
  @Get(":id/deliveries")
  @Permissions(Permission.SETTINGS_VIEW)
  async getDeliveries(
    @Param("tenantId") tenantId: string,
    @Param("id") id: string,
    @Query() query: ListWebhooksDto,
  ) {
    return this.webhookManagementService.getDeliveries(tenantId, id, {
      page: query.page,
      limit: query.limit,
    });
  }

  /**
   * POST /api/tenants/:tenantId/webhooks/:id/test
   * Send a test event to the webhook URL.
   */
  @Post(":id/test")
  @Permissions(Permission.SETTINGS_EDIT)
  async testWebhook(
    @Param("tenantId") tenantId: string,
    @Param("id") id: string,
  ) {
    return this.webhookManagementService.testWebhook(tenantId, id);
  }
}

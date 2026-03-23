import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  RawBodyRequest,
  Headers,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { RequireFeature } from "@/common/decorators/feature.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { PaymentsService } from "./payments.service";
import {
  CreateCheckoutDto,
  UpdatePaymentConfigDto,
  CreateRefundDto,
} from "./dto";

@ApiTags("Payments")
@Controller("payments")
@UseGuards(JwtAuthGuard, TenantAccessGuard, FeatureGuard, PermissionGuard)
@RequireFeature("payments")
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // =========================================================================
  // Payment Configuration
  // =========================================================================

  @Get("config")
  @Permissions(Permission.SETTINGS_VIEW)
  @ApiOperation({ summary: "Get payment configuration (Stripe/Square)" })
  @ApiResponse({ status: 200, description: "Payment configuration" })
  async getPaymentConfig(@TenantId() tenantId: string) {
    return this.paymentsService.getPaymentConfig(tenantId);
  }

  @Put("config")
  @Permissions(Permission.SETTINGS_EDIT)
  @ApiOperation({ summary: "Update payment configuration (Stripe/Square)" })
  @ApiResponse({ status: 200, description: "Configuration updated" })
  async updatePaymentConfig(
    @TenantId() tenantId: string,
    @Body() dto: UpdatePaymentConfigDto,
  ) {
    return this.paymentsService.updatePaymentConfig(tenantId, dto);
  }

  // =========================================================================
  // Checkout
  // =========================================================================

  @Post("checkout")
  @Permissions(Permission.ORDERS_CREATE)
  @ApiOperation({ summary: "Create a Stripe checkout session" })
  @ApiResponse({ status: 201, description: "Checkout session created" })
  @ApiResponse({ status: 400, description: "Invalid request" })
  async createCheckout(
    @TenantId() tenantId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.paymentsService.createCheckoutSession(tenantId, dto);
  }

  // =========================================================================
  // Refunds
  // =========================================================================

  @Post("refund")
  @Permissions(Permission.ORDERS_REFUND)
  @ApiOperation({ summary: "Create a refund for an order" })
  @ApiResponse({ status: 201, description: "Refund created" })
  @ApiResponse({ status: 400, description: "Invalid request" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async createRefund(
    @TenantId() tenantId: string,
    @Body() dto: CreateRefundDto,
  ) {
    return this.paymentsService.createRefund(tenantId, dto);
  }

  // =========================================================================
  // Payment Details
  // =========================================================================

  @Get("orders/:orderId")
  @Permissions(Permission.ORDERS_VIEW)
  @ApiOperation({ summary: "Get payment details for an order" })
  @ApiResponse({ status: 200, description: "Payment details" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async getPaymentDetails(
    @TenantId() tenantId: string,
    @Param("orderId") orderId: string,
  ) {
    return this.paymentsService.getPaymentDetails(tenantId, orderId);
  }
}

/**
 * Separate controller for webhooks (no auth required)
 */
@ApiTags("Payments Webhooks")
@Controller("payments/webhooks")
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("stripe/:tenantId")
  @ApiOperation({ summary: "Handle Stripe webhook events" })
  @ApiResponse({ status: 200, description: "Webhook processed" })
  @ApiResponse({ status: 400, description: "Invalid webhook" })
  async handleStripeWebhook(
    @Param("tenantId") tenantId: string,
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") signature: string,
  ) {
    const payload = req.rawBody;
    if (!payload) {
      throw new Error("Raw body not available");
    }
    return this.paymentsService.handleStripeWebhook(
      tenantId,
      payload,
      signature,
    );
  }

  @Post("square/:tenantId")
  @ApiOperation({ summary: "Handle Square webhook events" })
  @ApiResponse({ status: 200, description: "Webhook processed" })
  @ApiResponse({ status: 400, description: "Invalid webhook" })
  async handleSquareWebhook(
    @Param("tenantId") tenantId: string,
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-square-hmacsha256-signature") signature: string,
  ) {
    const payload = req.rawBody?.toString() || "";
    const notificationUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    return this.paymentsService.handleSquareWebhook(
      tenantId,
      payload,
      signature,
      notificationUrl,
    );
  }
}

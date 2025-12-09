import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/services/prisma.service";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import {
  SquareClient,
  SquareEnvironment,
  Currency as SquareCurrency,
} from "square";
import {
  CreateCheckoutDto,
  CreateRefundDto,
  UpdatePaymentConfigDto,
} from "./dto";

// Type for payment config stored in database
interface PaymentConfigData {
  [key: string]: unknown;
  stripe?: {
    publishableKey?: string;
    secretKey?: string;
    webhookSecret?: string;
  };
  square?: {
    applicationId?: string;
    accessToken?: string;
    locationId?: string;
    webhookSignatureKey?: string;
  };
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    // Initialize with platform Stripe account (for platform-level operations)
    const platformSecretKey = this.config.get<string>("STRIPE_SECRET_KEY");
    if (platformSecretKey) {
      this.stripe = new Stripe(platformSecretKey, {
        apiVersion: "2025-11-17.clover",
      });
    }
  }

  // =========================================================================
  // Configuration
  // =========================================================================

  /**
   * Get payment configuration for a tenant (without secrets)
   */
  async getPaymentConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        paymentProvider: true,
        paymentConfig: true,
      },
    });

    const config = tenant?.paymentConfig as PaymentConfigData | null;

    return {
      provider: tenant?.paymentProvider || null,
      stripe: {
        isConfigured: !!config?.stripe?.secretKey,
        publishableKey: config?.stripe?.publishableKey || null,
      },
      square: {
        isConfigured: !!config?.square?.accessToken,
        applicationId: config?.square?.applicationId || null,
        locationId: config?.square?.locationId || null,
      },
    };
  }

  /**
   * Update payment configuration for a tenant
   */
  async updatePaymentConfig(tenantId: string, dto: UpdatePaymentConfigDto) {
    // Get existing config
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });

    const existingConfig = (tenant?.paymentConfig as PaymentConfigData) || {};
    const newConfig: PaymentConfigData = { ...existingConfig };

    // Update Stripe config if provided
    if (dto.stripe) {
      newConfig.stripe = {
        ...existingConfig.stripe,
        ...dto.stripe,
      };
    }

    // Update Square config if provided
    if (dto.square) {
      newConfig.square = {
        ...existingConfig.square,
        ...dto.square,
      };
    }

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        paymentProvider: dto.provider,
        paymentConfig: newConfig as Prisma.InputJsonValue,
      },
    });

    this.logger.log(`Payment config updated for tenant ${tenantId}`);
    return this.getPaymentConfig(tenantId);
  }

  // =========================================================================
  // Provider Clients
  // =========================================================================

  /**
   * Get a Stripe client for a specific tenant
   */
  private async getStripeForTenant(tenantId: string): Promise<Stripe> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });

    const config = tenant?.paymentConfig as PaymentConfigData | null;

    if (config?.stripe?.secretKey) {
      return new Stripe(config.stripe.secretKey, {
        apiVersion: "2025-11-17.clover",
      });
    }

    // Fall back to platform Stripe account
    if (!this.stripe) {
      throw new BadRequestException(
        "Stripe is not configured. Please configure Stripe keys in settings.",
      );
    }

    return this.stripe;
  }

  /**
   * Get a Square client for a specific tenant
   */
  private async getSquareForTenant(tenantId: string): Promise<SquareClient> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });

    const config = tenant?.paymentConfig as PaymentConfigData | null;

    if (!config?.square?.accessToken) {
      throw new BadRequestException(
        "Square is not configured. Please configure Square credentials in settings.",
      );
    }

    return new SquareClient({
      token: config.square.accessToken,
      environment:
        this.config.get("NODE_ENV") === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }

  /**
   * Get the active payment provider for a tenant
   */
  private async getActiveProvider(
    tenantId: string,
  ): Promise<"stripe" | "square"> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentProvider: true },
    });

    if (!tenant?.paymentProvider) {
      throw new BadRequestException(
        "No payment provider configured. Please configure a payment provider in settings.",
      );
    }

    return tenant.paymentProvider as "stripe" | "square";
  }

  // =========================================================================
  // Checkout
  // =========================================================================

  /**
   * Create a checkout session (routes to appropriate provider)
   */
  async createCheckoutSession(tenantId: string, dto: CreateCheckoutDto) {
    const provider = await this.getActiveProvider(tenantId);

    if (provider === "stripe") {
      return this.createStripeCheckout(tenantId, dto);
    } else {
      return this.createSquareCheckout(tenantId, dto);
    }
  }

  /**
   * Create Stripe checkout session
   */
  private async createStripeCheckout(tenantId: string, dto: CreateCheckoutDto) {
    const stripe = await this.getStripeForTenant(tenantId);

    // Validate customer exists
    const customer = await this.prisma.customer.findFirst({
      where: { id: dto.customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Build line items from cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, tenantId, status: "active" },
      });

      if (!product) {
        throw new BadRequestException(
          `Product ${item.productId} not found or not active`,
        );
      }

      let price: number;
      let name = product.name;
      const description = product.shortDescription || undefined;

      if (item.variantId) {
        const variant = await this.prisma.productVariant.findFirst({
          where: { id: item.variantId, productId: item.productId },
        });

        if (!variant) {
          throw new BadRequestException(`Variant ${item.variantId} not found`);
        }

        if (!variant.available) {
          throw new BadRequestException(
            `Variant ${variant.title} is not available`,
          );
        }

        price = variant.price ? Number(variant.price) : Number(product.price);
        name = `${product.name} - ${variant.title}`;
      } else {
        price = Number(product.price);
      }

      // Stripe expects amounts in cents
      const unitAmount = Math.round(price * 100);

      // Get first product image
      const images: string[] = [];
      if (product.images && Array.isArray(product.images)) {
        const productImages = product.images as string[];
        if (productImages.length > 0) {
          images.push(productImages[0]);
        }
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name,
            description,
            images,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      });
    }

    // Add shipping as a line item if provided
    if (dto.shippingAmount && dto.shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: dto.shippingAmount,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
      customer_email: dto.email || customer.email,
      metadata: {
        tenantId,
        customerId: dto.customerId,
        customerNote: dto.customerNote || "",
        provider: "stripe",
      },
      ...(dto.taxAmount && {
        automatic_tax: { enabled: false },
      }),
      ...(dto.discountAmount &&
        dto.discountAmount > 0 && {
          discounts: [
            {
              coupon: await this.createStripeOneTimeCoupon(
                stripe,
                dto.discountAmount,
              ),
            },
          ],
        }),
    });

    this.logger.log(
      `Stripe checkout session created: ${session.id} for tenant ${tenantId}`,
    );

    return {
      provider: "stripe" as const,
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Create a one-time coupon for a specific discount amount (Stripe)
   */
  private async createStripeOneTimeCoupon(
    stripe: Stripe,
    amountOff: number,
  ): Promise<string> {
    const coupon = await stripe.coupons.create({
      amount_off: amountOff,
      currency: "usd",
      duration: "once",
      name: "Order Discount",
    });
    return coupon.id;
  }

  /**
   * Create Square checkout session
   */
  private async createSquareCheckout(tenantId: string, dto: CreateCheckoutDto) {
    const square = await this.getSquareForTenant(tenantId);

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });
    const config = tenant?.paymentConfig as PaymentConfigData;
    const locationId = config?.square?.locationId;

    if (!locationId) {
      throw new BadRequestException("Square location ID not configured");
    }

    // Validate customer exists
    const customer = await this.prisma.customer.findFirst({
      where: { id: dto.customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Build line items for Square
    const lineItems: Array<{
      name: string;
      quantity: string;
      basePriceMoney: { amount: bigint; currency: typeof SquareCurrency.Usd };
    }> = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, tenantId, status: "active" },
      });

      if (!product) {
        throw new BadRequestException(
          `Product ${item.productId} not found or not active`,
        );
      }

      let price: number;
      let name = product.name;

      if (item.variantId) {
        const variant = await this.prisma.productVariant.findFirst({
          where: { id: item.variantId, productId: item.productId },
        });

        if (!variant || !variant.available) {
          throw new BadRequestException(
            `Variant ${item.variantId} not available`,
          );
        }

        price = variant.price ? Number(variant.price) : Number(product.price);
        name = `${product.name} - ${variant.title}`;
      } else {
        price = Number(product.price);
      }

      lineItems.push({
        name,
        quantity: item.quantity.toString(),
        basePriceMoney: {
          amount: BigInt(Math.round(price * 100)),
          currency: SquareCurrency.Usd,
        },
      });
    }

    // Add shipping if provided
    if (dto.shippingAmount && dto.shippingAmount > 0) {
      lineItems.push({
        name: "Shipping",
        quantity: "1",
        basePriceMoney: {
          amount: BigInt(dto.shippingAmount),
          currency: SquareCurrency.Usd,
        },
      });
    }

    // Create Square checkout link
    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: `${tenantId}-${Date.now()}`,
      order: {
        locationId,
        lineItems,
        metadata: {
          tenantId,
          customerId: dto.customerId,
          customerNote: dto.customerNote || "",
          provider: "square",
        },
      },
      checkoutOptions: {
        redirectUrl: dto.successUrl,
      },
    });

    const paymentLink = response.paymentLink;
    if (!paymentLink) {
      throw new BadRequestException("Failed to create Square checkout");
    }

    this.logger.log(
      `Square checkout created: ${paymentLink.id} for tenant ${tenantId}`,
    );

    return {
      provider: "square" as const,
      sessionId: paymentLink.id || "",
      url: paymentLink.url || null,
    };
  }

  // =========================================================================
  // Webhooks
  // =========================================================================

  /**
   * Handle Stripe webhook events
   */
  async handleStripeWebhook(
    tenantId: string,
    payload: Buffer,
    signature: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });

    const config = tenant?.paymentConfig as PaymentConfigData | null;
    const webhookSecret =
      config?.stripe?.webhookSecret ||
      this.config.get<string>("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      throw new BadRequestException("Stripe webhook secret not configured");
    }

    const stripe = await this.getStripeForTenant(tenantId);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Stripe webhook signature verification failed: ${err}`);
      throw new BadRequestException("Invalid webhook signature");
    }

    this.logger.log(`Processing Stripe webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleStripeCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "payment_intent.succeeded":
        await this.handleStripePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "payment_intent.payment_failed":
        await this.handleStripePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "charge.refunded":
        await this.handleStripeRefund(event.data.object as Stripe.Charge);
        break;

      default:
        this.logger.log(`Unhandled Stripe webhook event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handle Square webhook events
   */
  async handleSquareWebhook(
    tenantId: string,
    payload: string,
    _signature: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });

    const config = tenant?.paymentConfig as PaymentConfigData | null;
    const webhookSignatureKey = config?.square?.webhookSignatureKey;

    if (!webhookSignatureKey) {
      throw new BadRequestException(
        "Square webhook signature key not configured",
      );
    }

    // Square webhook verification would go here
    // For now, we trust the webhook (in production, verify the signature)

    const event = JSON.parse(payload);
    this.logger.log(`Processing Square webhook event: ${event.type}`);

    switch (event.type) {
      case "payment.completed":
        await this.handleSquarePaymentCompleted(event.data);
        break;

      case "refund.created":
        await this.handleSquareRefundCreated(event.data);
        break;

      default:
        this.logger.log(`Unhandled Square webhook event type: ${event.type}`);
    }

    return { received: true };
  }

  // =========================================================================
  // Stripe Event Handlers
  // =========================================================================

  private async handleStripeCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const tenantId = session.metadata?.tenantId;
    const customerId = session.metadata?.customerId;

    if (!tenantId || !customerId) {
      this.logger.warn(
        `Stripe checkout session ${session.id} missing required metadata`,
      );
      return;
    }

    // Check if order already exists for this session
    const existingOrder = await this.prisma.order.findFirst({
      where: { transactionId: session.payment_intent as string },
    });

    if (existingOrder) {
      this.logger.log(
        `Order already exists for session ${session.id}, skipping`,
      );
      return;
    }

    // Retrieve full session with line items
    const stripe = await this.getStripeForTenant(tenantId);
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    // Calculate totals
    const subtotal = (fullSession.amount_subtotal || 0) / 100;
    const total = (fullSession.amount_total || 0) / 100;
    const discount = subtotal - total;

    // Get next order number
    const lastOrder = await this.prisma.order.findFirst({
      where: { tenantId },
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });
    const orderNumber = (lastOrder?.orderNumber ?? 0) + 1;

    // Create order
    await this.prisma.order.create({
      data: {
        tenantId,
        customerId,
        orderNumber,
        email: session.customer_email || "",
        subtotal,
        total,
        discount: discount > 0 ? discount : 0,
        paymentStatus: "paid",
        paymentMethod: "stripe",
        transactionId: session.payment_intent as string,
        customerNote: session.metadata?.customerNote,
      },
    });

    // Update customer stats
    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
      },
    });

    this.logger.log(
      `Order #${orderNumber} created from Stripe checkout session ${session.id}`,
    );
  }

  private async handleStripePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { transactionId: paymentIntent.id },
    });

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "paid" },
      });
      this.logger.log(`Order ${order.id} payment succeeded`);
    }
  }

  private async handleStripePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const order = await this.prisma.order.findFirst({
      where: { transactionId: paymentIntent.id },
    });

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "pending" },
      });
      this.logger.log(`Order ${order.id} payment failed`);
    }
  }

  private async handleStripeRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent;
    if (!paymentIntentId) return;

    const order = await this.prisma.order.findFirst({
      where: { transactionId: paymentIntentId as string },
    });

    if (order) {
      const refundedAmount = charge.amount_refunded / 100;
      const orderTotal = Number(order.total);

      const paymentStatus =
        refundedAmount >= orderTotal ? "refunded" : "partially_refunded";

      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus },
      });

      this.logger.log(
        `Order ${order.id} refunded: $${refundedAmount} (${paymentStatus})`,
      );
    }
  }

  // =========================================================================
  // Square Event Handlers
  // =========================================================================

  private async handleSquarePaymentCompleted(data: {
    object: {
      payment: { order_id?: string; amount_money?: { amount?: number } };
    };
  }) {
    const orderId = data.object?.payment?.order_id;
    if (!orderId) return;

    // Square payments are linked via order ID in metadata
    // This would need to be implemented based on how orders are created
    this.logger.log(`Square payment completed for order: ${orderId}`);
  }

  private async handleSquareRefundCreated(data: {
    object: {
      refund: { payment_id?: string; amount_money?: { amount?: number } };
    };
  }) {
    const paymentId = data.object?.refund?.payment_id;
    const amount = data.object?.refund?.amount_money?.amount;

    this.logger.log(
      `Square refund created: payment ${paymentId}, amount ${amount}`,
    );
  }

  // =========================================================================
  // Refunds
  // =========================================================================

  /**
   * Create a refund for an order
   */
  async createRefund(tenantId: string, dto: CreateRefundDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, tenantId },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!order.transactionId) {
      throw new BadRequestException("Order has no payment to refund");
    }

    if (
      order.paymentStatus === "refunded" ||
      order.paymentStatus === "pending"
    ) {
      throw new BadRequestException(
        `Cannot refund order with payment status: ${order.paymentStatus}`,
      );
    }

    // Route to appropriate provider
    if (order.paymentMethod === "stripe") {
      return this.createStripeRefund(tenantId, order, dto);
    } else if (order.paymentMethod === "square") {
      return this.createSquareRefund(tenantId, order, dto);
    }

    throw new BadRequestException(
      `Unknown payment method: ${order.paymentMethod}`,
    );
  }

  private async createStripeRefund(
    tenantId: string,
    order: {
      id: string;
      transactionId: string | null;
      total: number | unknown;
    },
    dto: CreateRefundDto,
  ) {
    const stripe = await this.getStripeForTenant(tenantId);

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.transactionId!,
    );

    if (!paymentIntent.latest_charge) {
      throw new BadRequestException("No charge found for this payment");
    }

    const refundParams: Stripe.RefundCreateParams = {
      charge: paymentIntent.latest_charge as string,
      reason: "requested_by_customer",
    };

    if (dto.amount) {
      refundParams.amount = dto.amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    const refundedAmount = refund.amount / 100;
    const orderTotal = Number(order.total);
    const paymentStatus =
      refundedAmount >= orderTotal ? "refunded" : "partially_refunded";

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus },
    });

    this.logger.log(
      `Stripe refund created for order ${order.id}: $${refundedAmount}`,
    );

    return {
      provider: "stripe" as const,
      refundId: refund.id,
      amount: refundedAmount,
      status: refund.status,
    };
  }

  private async createSquareRefund(
    tenantId: string,
    order: {
      id: string;
      transactionId: string | null;
      total: number | unknown;
    },
    dto: CreateRefundDto,
  ) {
    const square = await this.getSquareForTenant(tenantId);

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { paymentConfig: true },
    });
    const config = tenant?.paymentConfig as PaymentConfigData;
    const locationId = config?.square?.locationId;

    if (!locationId) {
      throw new BadRequestException("Square location ID not configured");
    }

    const orderTotal = Number(order.total);
    const refundAmount = dto.amount || Math.round(orderTotal * 100);

    const response = await square.refunds.refundPayment({
      idempotencyKey: `refund-${order.id}-${Date.now()}`,
      paymentId: order.transactionId!,
      amountMoney: {
        amount: BigInt(refundAmount),
        currency: SquareCurrency.Usd,
      },
      reason: dto.reason || "Customer requested refund",
    });

    const refund = response.refund;
    const refundedAmount = Number(refund?.amountMoney?.amount || 0) / 100;
    const paymentStatus =
      refundedAmount >= orderTotal ? "refunded" : "partially_refunded";

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus },
    });

    this.logger.log(
      `Square refund created for order ${order.id}: $${refundedAmount}`,
    );

    return {
      provider: "square" as const,
      refundId: refund?.id || "",
      amount: refundedAmount,
      status: refund?.status || "PENDING",
    };
  }

  // =========================================================================
  // Payment Details
  // =========================================================================

  /**
   * Get payment details for an order
   */
  async getPaymentDetails(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      select: {
        id: true,
        transactionId: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!order.transactionId) {
      return {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        providerDetails: null,
      };
    }

    if (order.paymentMethod === "stripe") {
      return this.getStripePaymentDetails(tenantId, order);
    } else if (order.paymentMethod === "square") {
      return this.getSquarePaymentDetails(tenantId, order);
    }

    return {
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      providerDetails: null,
    };
  }

  private async getStripePaymentDetails(
    tenantId: string,
    order: {
      id: string;
      transactionId: string | null;
      paymentStatus: string;
      paymentMethod: string | null;
    },
  ) {
    try {
      const stripe = await this.getStripeForTenant(tenantId);
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.transactionId!,
        { expand: ["charges", "latest_charge"] },
      );

      return {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        providerDetails: {
          provider: "stripe" as const,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          amountReceived: paymentIntent.amount_received / 100,
          currency: paymentIntent.currency,
          created: new Date(paymentIntent.created * 1000),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve Stripe payment: ${error}`);
      return {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        providerDetails: null,
      };
    }
  }

  private async getSquarePaymentDetails(
    tenantId: string,
    order: {
      id: string;
      transactionId: string | null;
      paymentStatus: string;
      paymentMethod: string | null;
    },
  ) {
    try {
      const square = await this.getSquareForTenant(tenantId);
      const response = await square.payments.get({
        paymentId: order.transactionId!,
      });

      const payment = response.payment;

      return {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        providerDetails: {
          provider: "square" as const,
          paymentId: payment?.id,
          status: payment?.status,
          amount: Number(payment?.amountMoney?.amount || 0) / 100,
          currency: payment?.amountMoney?.currency,
          created: payment?.createdAt,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve Square payment: ${error}`);
      return {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        providerDetails: null,
      };
    }
  }
}

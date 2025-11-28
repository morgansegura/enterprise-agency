import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/common/services/prisma.service";
import { CreateOrderDto, UpdateOrderDto } from "./dto";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createData: CreateOrderDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: createData.customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    const orderItems: Array<{
      productId: string;
      variantId: string | null;
      productTitle: string;
      variantTitle: string | null;
      sku: string | null;
      price: number;
      quantity: number;
      total: number;
    }> = [];

    let subtotal = 0;

    for (const item of createData.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, tenantId, status: "active" },
      });

      if (!product) {
        throw new BadRequestException(
          `Product ${item.productId} not found or not active`,
        );
      }

      let price: number;
      let variantTitle: string | null = null;
      let sku: string | null = product.sku;

      if (item.variantId) {
        const variant = await this.prisma.productVariant.findFirst({
          where: { id: item.variantId, productId: item.productId },
        });

        if (!variant) {
          throw new BadRequestException(
            `Variant ${item.variantId} not found for product ${item.productId}`,
          );
        }

        if (!variant.available) {
          throw new BadRequestException(
            `Variant ${item.variantId} is not available`,
          );
        }

        price = variant.price ? Number(variant.price) : Number(product.price);
        variantTitle = variant.title;
        sku = variant.sku || product.sku;

        if (product.trackInventory && variant.inventoryQty < item.quantity) {
          if (!product.allowBackorder) {
            throw new BadRequestException(
              `Insufficient inventory for variant ${variant.title}`,
            );
          }
        }
      } else {
        price = Number(product.price);

        if (
          product.trackInventory &&
          !product.hasVariants &&
          product.inventoryQty < item.quantity
        ) {
          if (!product.allowBackorder) {
            throw new BadRequestException(
              `Insufficient inventory for product ${product.name}`,
            );
          }
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        productTitle: product.name,
        variantTitle,
        sku,
        price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const tax = createData.tax ?? 0;
    const shipping = createData.shipping ?? 0;
    const discount = createData.discount ?? 0;
    const total = subtotal + tax + shipping - discount;

    const lastOrder = await this.prisma.order.findFirst({
      where: { tenantId },
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });

    const orderNumber = (lastOrder?.orderNumber ?? 0) + 1;

    let shippingAddressId: string | undefined;
    let billingAddressId: string | undefined;

    if (createData.shippingAddress) {
      const shippingAddr = await this.prisma.customerAddress.create({
        data: {
          customerId: createData.customerId,
          ...createData.shippingAddress,
        },
      });
      shippingAddressId = shippingAddr.id;
    }

    if (createData.billingAddress) {
      const billingAddr = await this.prisma.customerAddress.create({
        data: {
          customerId: createData.customerId,
          ...createData.billingAddress,
        },
      });
      billingAddressId = billingAddr.id;
    }

    const order = await this.prisma.order.create({
      data: {
        tenantId,
        customerId: createData.customerId,
        orderNumber,
        email: createData.email,
        phone: createData.phone,
        shippingAddressId,
        billingAddressId,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        currency: createData.currency ?? "USD",
        shippingMethod: createData.shippingMethod,
        customerNote: createData.customerNote,
        staffNote: createData.staffNote,
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    for (const item of orderItems) {
      if (item.variantId) {
        await this.prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventoryQty: {
              decrement: item.quantity,
            },
          },
        });
      } else {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (product?.trackInventory && !product.hasVariants) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              inventoryQty: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    }

    await this.prisma.customer.update({
      where: { id: createData.customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
      },
    });

    this.logger.log(`Order created: #${orderNumber} for tenant ${tenantId}`);
    return order;
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: string;
      paymentStatus?: string;
      fulfillmentStatus?: string;
      customerId?: string;
      search?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: Prisma.OrderWhereInput = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.fulfillmentStatus) {
      where.fulfillmentStatus = filters.fulfillmentStatus;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        {
          orderNumber: isNaN(Number(filters.search))
            ? undefined
            : Number(filters.search),
        },
      ];
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: filters?.limit,
        skip: filters?.offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async findOne(tenantId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  async findByOrderNumber(tenantId: string, orderNumber: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        tenantId_orderNumber: {
          tenantId,
          orderNumber,
        },
      },
      include: {
        customer: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  async update(tenantId: string, id: string, updateData: UpdateOrderDto) {
    await this.findOne(tenantId, id);

    const updatePayload: Prisma.OrderUpdateInput = {};

    if (updateData.status !== undefined) {
      updatePayload.status = updateData.status;
      if (updateData.status === "completed") {
        updatePayload.completedAt = new Date();
      } else if (updateData.status === "cancelled") {
        updatePayload.cancelledAt = new Date();
      }
    }

    if (updateData.paymentStatus !== undefined) {
      updatePayload.paymentStatus = updateData.paymentStatus;
    }

    if (updateData.paymentMethod !== undefined) {
      updatePayload.paymentMethod = updateData.paymentMethod;
    }

    if (updateData.transactionId !== undefined) {
      updatePayload.transactionId = updateData.transactionId;
    }

    if (updateData.fulfillmentStatus !== undefined) {
      updatePayload.fulfillmentStatus = updateData.fulfillmentStatus;
    }

    if (updateData.shippingMethod !== undefined) {
      updatePayload.shippingMethod = updateData.shippingMethod;
    }

    if (updateData.trackingNumber !== undefined) {
      updatePayload.trackingNumber = updateData.trackingNumber;
    }

    if (updateData.trackingUrl !== undefined) {
      updatePayload.trackingUrl = updateData.trackingUrl;
    }

    if (updateData.customerNote !== undefined) {
      updatePayload.customerNote = updateData.customerNote;
    }

    if (updateData.staffNote !== undefined) {
      updatePayload.staffNote = updateData.staffNote;
    }

    if (
      updateData.tax !== undefined ||
      updateData.shipping !== undefined ||
      updateData.discount !== undefined
    ) {
      const order = await this.findOne(tenantId, id);
      const tax = updateData.tax ?? Number(order.tax);
      const shipping = updateData.shipping ?? Number(order.shipping);
      const discount = updateData.discount ?? Number(order.discount);
      const total = Number(order.subtotal) + tax + shipping - discount;

      updatePayload.tax = tax;
      updatePayload.shipping = shipping;
      updatePayload.discount = discount;
      updatePayload.total = total;
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updatePayload,
      include: {
        customer: true,
        shippingAddress: true,
        billingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    this.logger.log(`Order updated: #${order.orderNumber}`);
    return order;
  }

  async cancel(tenantId: string, id: string) {
    const order = await this.findOne(tenantId, id);

    if (order.status === "cancelled") {
      throw new BadRequestException("Order is already cancelled");
    }

    for (const item of order.items) {
      if (item.variantId) {
        await this.prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventoryQty: {
              increment: item.quantity,
            },
          },
        });
      } else {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (product?.trackInventory && !product.hasVariants) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              inventoryQty: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    await this.prisma.customer.update({
      where: { id: order.customerId },
      data: {
        totalOrders: { decrement: 1 },
        totalSpent: { decrement: Number(order.total) },
      },
    });

    const cancelled = await this.prisma.order.update({
      where: { id },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
      include: {
        customer: true,
        items: true,
      },
    });

    this.logger.log(`Order cancelled: #${cancelled.orderNumber}`);
    return cancelled;
  }

  async fulfillItems(tenantId: string, id: string, itemIds: string[]) {
    const order = await this.findOne(tenantId, id);

    const itemsToFulfill = order.items.filter((item) =>
      itemIds.includes(item.id),
    );

    if (itemsToFulfill.length === 0) {
      throw new BadRequestException("No valid items to fulfill");
    }

    await this.prisma.orderItem.updateMany({
      where: {
        id: { in: itemIds },
        orderId: id,
      },
      data: { fulfilled: true },
    });

    const allItems = await this.prisma.orderItem.findMany({
      where: { orderId: id },
    });

    const allFulfilled = allItems.every((item) => item.fulfilled);
    const someFulfilled = allItems.some((item) => item.fulfilled);

    let fulfillmentStatus: string;
    if (allFulfilled) {
      fulfillmentStatus = "fulfilled";
    } else if (someFulfilled) {
      fulfillmentStatus = "partial";
    } else {
      fulfillmentStatus = "unfulfilled";
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { fulfillmentStatus },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    this.logger.log(
      `Order items fulfilled: #${updated.orderNumber} - ${itemIds.length} items`,
    );
    return updated;
  }

  async getOrderStats(tenantId: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.OrderWhereInput = {
      tenantId,
      status: { not: "cancelled" },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [stats, statusCounts] = await Promise.all([
      this.prisma.order.aggregate({
        where,
        _count: true,
        _sum: {
          total: true,
          subtotal: true,
          tax: true,
          shipping: true,
          discount: true,
        },
        _avg: {
          total: true,
        },
      }),
      this.prisma.order.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: true,
      }),
    ]);

    return {
      totalOrders: stats._count,
      totalRevenue: stats._sum.total || 0,
      totalSubtotal: stats._sum.subtotal || 0,
      totalTax: stats._sum.tax || 0,
      totalShipping: stats._sum.shipping || 0,
      totalDiscount: stats._sum.discount || 0,
      averageOrderValue: stats._avg.total || 0,
      statusBreakdown: statusCounts.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}

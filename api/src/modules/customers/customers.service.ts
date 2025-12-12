import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from "./dto";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // CUSTOMERS
  // ============================================================================

  async create(tenantId: string, createData: CreateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: createData.email,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        "Customer with this email already exists for this tenant",
      );
    }

    if (createData.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createData.userId },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }
    }

    const customer = await this.prisma.customer.create({
      data: {
        tenantId,
        email: createData.email,
        firstName: createData.firstName,
        lastName: createData.lastName,
        phone: createData.phone,
        acceptsMarketing: createData.acceptsMarketing ?? false,
        note: createData.note,
        userId: createData.userId,
        hasAccount: !!createData.userId,
      },
      include: {
        addresses: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Customer created: ${customer.email}`);
    return customer;
  }

  async findAll(
    tenantId: string,
    filters?: {
      search?: string;
      hasAccount?: boolean;
      acceptsMarketing?: boolean;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: Prisma.CustomerWhereInput = { tenantId };

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.hasAccount !== undefined) {
      where.hasAccount = filters.hasAccount;
    }

    if (filters?.acceptsMarketing !== undefined) {
      where.acceptsMarketing = filters.acceptsMarketing;
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: {
          addresses: {
            where: { isDefault: true },
            take: 1,
          },
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: filters?.limit,
        skip: filters?.offset,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }

  async findOne(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer;
  }

  async findByEmail(tenantId: string, email: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer;
  }

  async update(tenantId: string, id: string, updateData: UpdateCustomerDto) {
    const existing = await this.findOne(tenantId, id);

    if (updateData.email && updateData.email !== existing.email) {
      const emailTaken = await this.prisma.customer.findUnique({
        where: {
          tenantId_email: {
            tenantId,
            email: updateData.email,
          },
        },
      });

      if (emailTaken) {
        throw new ConflictException(
          "Customer with this email already exists for this tenant",
        );
      }
    }

    if (updateData.userId && updateData.userId !== existing.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateData.userId },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...updateData,
        hasAccount: updateData.userId ? true : existing.hasAccount,
      },
      include: {
        addresses: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Customer updated: ${customer.email}`);
    return customer;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    const orderCount = await this.prisma.order.count({
      where: { customerId: id },
    });

    if (orderCount > 0) {
      throw new ConflictException(
        `Cannot delete customer with ${orderCount} orders. Consider anonymizing instead.`,
      );
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    this.logger.log(`Customer deleted: ${id}`);
    return { success: true, id };
  }

  // ============================================================================
  // CUSTOMER ADDRESSES
  // ============================================================================

  async createAddress(
    tenantId: string,
    customerId: string,
    createData: CreateCustomerAddressDto,
  ) {
    await this.findOne(tenantId, customerId);

    if (createData.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.customerAddress.create({
      data: {
        customerId,
        ...createData,
      },
    });

    this.logger.log(`Customer address created for customer ${customerId}`);
    return address;
  }

  async findAllAddresses(tenantId: string, customerId: string) {
    await this.findOne(tenantId, customerId);

    const addresses = await this.prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return addresses;
  }

  async findOneAddress(
    tenantId: string,
    customerId: string,
    addressId: string,
  ) {
    await this.findOne(tenantId, customerId);

    const address = await this.prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
    });

    if (!address) {
      throw new NotFoundException("Customer address not found");
    }

    return address;
  }

  async updateAddress(
    tenantId: string,
    customerId: string,
    addressId: string,
    updateData: UpdateCustomerAddressDto,
  ) {
    await this.findOneAddress(tenantId, customerId, addressId);

    if (updateData.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.customerAddress.update({
      where: { id: addressId },
      data: updateData,
    });

    this.logger.log(`Customer address updated: ${addressId}`);
    return address;
  }

  async removeAddress(tenantId: string, customerId: string, addressId: string) {
    await this.findOneAddress(tenantId, customerId, addressId);

    const ordersUsingAddress = await this.prisma.order.count({
      where: {
        OR: [{ shippingAddressId: addressId }, { billingAddressId: addressId }],
      },
    });

    if (ordersUsingAddress > 0) {
      throw new ConflictException(
        `Cannot delete address used in ${ordersUsingAddress} orders`,
      );
    }

    await this.prisma.customerAddress.delete({
      where: { id: addressId },
    });

    this.logger.log(`Customer address deleted: ${addressId}`);
    return { success: true, id: addressId };
  }

  async setDefaultAddress(
    tenantId: string,
    customerId: string,
    addressId: string,
  ) {
    await this.findOneAddress(tenantId, customerId, addressId);

    await this.prisma.customerAddress.updateMany({
      where: { customerId },
      data: { isDefault: false },
    });

    const address = await this.prisma.customerAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    this.logger.log(`Default address set: ${addressId}`);
    return address;
  }

  // ============================================================================
  // CUSTOMER STATS
  // ============================================================================

  async getCustomerStats(tenantId: string) {
    const [totalCustomers, withAccounts, acceptingMarketing, totalSpent] =
      await Promise.all([
        this.prisma.customer.count({ where: { tenantId } }),
        this.prisma.customer.count({ where: { tenantId, hasAccount: true } }),
        this.prisma.customer.count({
          where: { tenantId, acceptsMarketing: true },
        }),
        this.prisma.customer.aggregate({
          where: { tenantId },
          _sum: { totalSpent: true },
          _avg: { totalSpent: true },
        }),
      ]);

    return {
      totalCustomers,
      withAccounts,
      acceptingMarketing,
      totalRevenue: totalSpent._sum.totalSpent || 0,
      averageLifetimeValue: totalSpent._avg.totalSpent || 0,
    };
  }
}

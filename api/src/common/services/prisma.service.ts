import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client = createPrismaClient();

  // Expose all PrismaClient properties
  get tenant() {
    return this.client.tenant;
  }
  get tenantDomain() {
    return this.client.tenantDomain;
  }
  get user() {
    return this.client.user;
  }
  get tenantUser() {
    return this.client.tenantUser;
  }
  get projectAssignment() {
    return this.client.projectAssignment;
  }
  get asset() {
    return this.client.asset;
  }
  get page() {
    return this.client.page;
  }
  get post() {
    return this.client.post;
  }
  get auditLog() {
    return this.client.auditLog;
  }
  get tenantUsage() {
    return this.client.tenantUsage;
  }
  get webhook() {
    return this.client.webhook;
  }
  get webhookDelivery() {
    return this.client.webhookDelivery;
  }
  get productCategory() {
    return this.client.productCategory;
  }
  get product() {
    return this.client.product;
  }
  get productVariant() {
    return this.client.productVariant;
  }
  get customer() {
    return this.client.customer;
  }
  get customerAddress() {
    return this.client.customerAddress;
  }
  get order() {
    return this.client.order;
  }
  get orderItem() {
    return this.client.orderItem;
  }
  get previewToken() {
    return this.client.previewToken;
  }
  get pageVersion() {
    return this.client.pageVersion;
  }
  get libraryComponent() {
    return this.client.libraryComponent;
  }
  get menu() {
    return this.client.menu;
  }
  get header() {
    return this.client.header;
  }
  get footer() {
    return this.client.footer;
  }

  // Expose transaction and other methods
  $transaction<T>(
    fn: Parameters<typeof this.client.$transaction>[0],
  ): Promise<T> {
    return this.client.$transaction(fn) as Promise<T>;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}

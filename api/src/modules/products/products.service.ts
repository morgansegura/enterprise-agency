import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma";
import { PrismaService } from "@/common/services/prisma.service";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "./dto";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // PRODUCT CATEGORIES
  // ============================================================================

  async createCategory(tenantId: string, createData: CreateProductCategoryDto) {
    const existing = await this.prisma.productCategory.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createData.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        "Category with this slug already exists for this tenant",
      );
    }

    if (createData.parentId) {
      const parent = await this.prisma.productCategory.findFirst({
        where: { id: createData.parentId, tenantId },
      });

      if (!parent) {
        throw new NotFoundException("Parent category not found");
      }
    }

    const category = await this.prisma.productCategory.create({
      data: {
        tenantId,
        name: createData.name,
        slug: createData.slug,
        description: createData.description,
        imageUrl: createData.imageUrl,
        parentId: createData.parentId,
        sortOrder: createData.sortOrder ?? 0,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    this.logger.log(`Product category created: ${category.slug}`);
    return category;
  }

  async findAllCategories(
    tenantId: string,
    filters?: {
      parentId?: string | null;
      search?: string;
    },
  ) {
    const where: Prisma.ProductCategoryWhereInput = { tenantId };

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const categories = await this.prisma.productCategory.findMany({
      where,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return categories;
  }

  async findOneCategory(tenantId: string, id: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Product category not found");
    }

    return category;
  }

  async updateCategory(
    tenantId: string,
    id: string,
    updateData: UpdateProductCategoryDto,
  ) {
    const existing = await this.findOneCategory(tenantId, id);

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugTaken = await this.prisma.productCategory.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug: updateData.slug,
          },
        },
      });

      if (slugTaken) {
        throw new ConflictException(
          "Category with this slug already exists for this tenant",
        );
      }
    }

    if (updateData.parentId) {
      if (updateData.parentId === id) {
        throw new BadRequestException("Category cannot be its own parent");
      }

      const parent = await this.prisma.productCategory.findFirst({
        where: { id: updateData.parentId, tenantId },
      });

      if (!parent) {
        throw new NotFoundException("Parent category not found");
      }
    }

    const category = await this.prisma.productCategory.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    this.logger.log(`Product category updated: ${category.slug}`);
    return category;
  }

  async removeCategory(tenantId: string, id: string) {
    const category = await this.findOneCategory(tenantId, id);

    const productsUsingCategory = await this.prisma.product.count({
      where: { categoryId: id, tenantId },
    });

    if (productsUsingCategory > 0) {
      throw new ConflictException(
        `Cannot delete category with ${productsUsingCategory} products. Reassign products first.`,
      );
    }

    await this.prisma.productCategory.updateMany({
      where: { parentId: id },
      data: { parentId: category.parentId },
    });

    await this.prisma.productCategory.delete({
      where: { id },
    });

    this.logger.log(`Product category deleted: ${id}`);
    return { success: true, id };
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================

  async createProduct(tenantId: string, createData: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createData.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        "Product with this slug already exists for this tenant",
      );
    }

    if (createData.categoryId) {
      const category = await this.prisma.productCategory.findFirst({
        where: { id: createData.categoryId, tenantId },
      });

      if (!category) {
        throw new NotFoundException("Product category not found");
      }
    }

    const product = await this.prisma.product.create({
      data: {
        tenantId,
        name: createData.name,
        slug: createData.slug,
        description: createData.description,
        shortDescription: createData.shortDescription,
        categoryId: createData.categoryId,
        price: createData.price,
        compareAtPrice: createData.compareAtPrice,
        costPerItem: createData.costPerItem,
        sku: createData.sku,
        barcode: createData.barcode,
        trackInventory: createData.trackInventory ?? true,
        inventoryQty: createData.inventoryQty ?? 0,
        allowBackorder: createData.allowBackorder ?? false,
        lowStockThreshold: createData.lowStockThreshold ?? 10,
        images: createData.images
          ? (JSON.parse(
              JSON.stringify(createData.images),
            ) as Prisma.InputJsonValue)
          : undefined,
        metaTitle: createData.metaTitle,
        metaDescription: createData.metaDescription,
        hasVariants: createData.hasVariants ?? false,
        options: createData.options
          ? (JSON.parse(
              JSON.stringify(createData.options),
            ) as Prisma.InputJsonValue)
          : undefined,
        status: createData.status ?? "draft",
        sortOrder: createData.sortOrder ?? 0,
        featured: createData.featured ?? false,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    this.logger.log(`Product created: ${product.slug}`);
    return product;
  }

  async findAllProducts(
    tenantId: string,
    filters?: {
      status?: string;
      categoryId?: string;
      featured?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: Prisma.ProductWhereInput = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: filters?.limit,
        skip: filters?.offset,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findOneProduct(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async findProductBySlug(tenantId: string, slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug,
        },
      },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async updateProduct(
    tenantId: string,
    id: string,
    updateData: UpdateProductDto,
  ) {
    const existing = await this.findOneProduct(tenantId, id);

    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugTaken = await this.prisma.product.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug: updateData.slug,
          },
        },
      });

      if (slugTaken) {
        throw new ConflictException(
          "Product with this slug already exists for this tenant",
        );
      }
    }

    if (updateData.categoryId) {
      const category = await this.prisma.productCategory.findFirst({
        where: { id: updateData.categoryId, tenantId },
      });

      if (!category) {
        throw new NotFoundException("Product category not found");
      }
    }

    const updatePayload: Prisma.ProductUpdateInput = {};

    if (updateData.name !== undefined) updatePayload.name = updateData.name;
    if (updateData.slug !== undefined) updatePayload.slug = updateData.slug;
    if (updateData.description !== undefined)
      updatePayload.description = updateData.description;
    if (updateData.shortDescription !== undefined)
      updatePayload.shortDescription = updateData.shortDescription;
    if (updateData.categoryId !== undefined) {
      if (updateData.categoryId === null) {
        updatePayload.category = { disconnect: true };
      } else {
        updatePayload.category = { connect: { id: updateData.categoryId } };
      }
    }
    if (updateData.price !== undefined) updatePayload.price = updateData.price;
    if (updateData.compareAtPrice !== undefined)
      updatePayload.compareAtPrice = updateData.compareAtPrice;
    if (updateData.costPerItem !== undefined)
      updatePayload.costPerItem = updateData.costPerItem;
    if (updateData.sku !== undefined) updatePayload.sku = updateData.sku;
    if (updateData.barcode !== undefined)
      updatePayload.barcode = updateData.barcode;
    if (updateData.trackInventory !== undefined)
      updatePayload.trackInventory = updateData.trackInventory;
    if (updateData.inventoryQty !== undefined)
      updatePayload.inventoryQty = updateData.inventoryQty;
    if (updateData.allowBackorder !== undefined)
      updatePayload.allowBackorder = updateData.allowBackorder;
    if (updateData.lowStockThreshold !== undefined)
      updatePayload.lowStockThreshold = updateData.lowStockThreshold;
    if (updateData.metaTitle !== undefined)
      updatePayload.metaTitle = updateData.metaTitle;
    if (updateData.metaDescription !== undefined)
      updatePayload.metaDescription = updateData.metaDescription;
    if (updateData.hasVariants !== undefined)
      updatePayload.hasVariants = updateData.hasVariants;
    if (updateData.status !== undefined)
      updatePayload.status = updateData.status;
    if (updateData.sortOrder !== undefined)
      updatePayload.sortOrder = updateData.sortOrder;
    if (updateData.featured !== undefined)
      updatePayload.featured = updateData.featured;

    if (updateData.images !== undefined) {
      updatePayload.images = JSON.parse(
        JSON.stringify(updateData.images),
      ) as Prisma.InputJsonValue;
    }

    if (updateData.options !== undefined) {
      updatePayload.options = JSON.parse(
        JSON.stringify(updateData.options),
      ) as Prisma.InputJsonValue;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updatePayload,
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    this.logger.log(`Product updated: ${product.slug}`);
    return product;
  }

  async removeProduct(tenantId: string, id: string) {
    await this.findOneProduct(tenantId, id);

    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        `Cannot delete product with ${orderItemsCount} order items. Archive the product instead.`,
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    this.logger.log(`Product deleted: ${id}`);
    return { success: true, id };
  }

  async archiveProduct(tenantId: string, id: string) {
    const product = await this.updateProduct(tenantId, id, {
      status: "archived",
    });

    this.logger.log(`Product archived: ${product.slug}`);
    return product;
  }

  async duplicateProduct(tenantId: string, id: string) {
    const original = await this.findOneProduct(tenantId, id);

    let newSlug = `${original.slug}-copy`;
    let counter = 1;
    while (true) {
      try {
        await this.findProductBySlug(tenantId, newSlug);
        newSlug = `${original.slug}-copy-${counter++}`;
      } catch {
        break;
      }
    }

    const duplicated = await this.prisma.product.create({
      data: {
        tenantId,
        name: `${original.name} (Copy)`,
        slug: newSlug,
        description: original.description,
        shortDescription: original.shortDescription,
        categoryId: original.categoryId,
        price: original.price,
        compareAtPrice: original.compareAtPrice,
        costPerItem: original.costPerItem,
        sku: original.sku ? `${original.sku}-copy` : null,
        barcode: null,
        trackInventory: original.trackInventory,
        inventoryQty: 0,
        allowBackorder: original.allowBackorder,
        lowStockThreshold: original.lowStockThreshold,
        images: original.images
          ? (JSON.parse(
              JSON.stringify(original.images),
            ) as Prisma.InputJsonValue)
          : undefined,
        metaTitle: original.metaTitle,
        metaDescription: original.metaDescription,
        hasVariants: original.hasVariants,
        options: original.options
          ? (JSON.parse(
              JSON.stringify(original.options),
            ) as Prisma.InputJsonValue)
          : undefined,
        status: "draft",
        sortOrder: original.sortOrder,
        featured: false,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    this.logger.log(
      `Product duplicated: ${original.slug} -> ${duplicated.slug}`,
    );
    return duplicated;
  }

  // ============================================================================
  // PRODUCT VARIANTS
  // ============================================================================

  async createVariant(tenantId: string, createData: CreateProductVariantDto) {
    const product = await this.findOneProduct(tenantId, createData.productId);

    if (!product.hasVariants) {
      throw new BadRequestException(
        "Product does not have variants enabled. Update product first.",
      );
    }

    const existingVariant = await this.prisma.productVariant.findFirst({
      where: {
        productId: createData.productId,
        options: {
          equals: createData.options,
        },
      },
    });

    if (existingVariant) {
      throw new ConflictException(
        "A variant with these options already exists",
      );
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId: createData.productId,
        title: createData.title,
        options: createData.options as Prisma.InputJsonValue,
        price: createData.price,
        compareAtPrice: createData.compareAtPrice,
        sku: createData.sku,
        barcode: createData.barcode,
        inventoryQty: createData.inventoryQty ?? 0,
        imageUrl: createData.imageUrl,
        available: createData.available ?? true,
        sortOrder: createData.sortOrder ?? 0,
      },
    });

    this.logger.log(`Product variant created: ${variant.title}`);
    return variant;
  }

  async findAllVariants(tenantId: string, productId: string) {
    await this.findOneProduct(tenantId, productId);

    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { sortOrder: "asc" },
    });

    return variants;
  }

  async findOneVariant(tenantId: string, productId: string, variantId: string) {
    await this.findOneProduct(tenantId, productId);

    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, productId },
    });

    if (!variant) {
      throw new NotFoundException("Product variant not found");
    }

    return variant;
  }

  async updateVariant(
    tenantId: string,
    productId: string,
    variantId: string,
    updateData: UpdateProductVariantDto,
  ) {
    await this.findOneVariant(tenantId, productId, variantId);

    const updatePayload: Prisma.ProductVariantUpdateInput = {
      ...updateData,
    };

    if (updateData.options) {
      const existingVariant = await this.prisma.productVariant.findFirst({
        where: {
          productId,
          options: {
            equals: updateData.options,
          },
          NOT: { id: variantId },
        },
      });

      if (existingVariant) {
        throw new ConflictException(
          "A variant with these options already exists",
        );
      }

      updatePayload.options = updateData.options as Prisma.InputJsonValue;
    }

    const variant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: updatePayload,
    });

    this.logger.log(`Product variant updated: ${variant.title}`);
    return variant;
  }

  async removeVariant(tenantId: string, productId: string, variantId: string) {
    await this.findOneVariant(tenantId, productId, variantId);

    const orderItemsCount = await this.prisma.orderItem.count({
      where: { variantId },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        `Cannot delete variant with ${orderItemsCount} order items.`,
      );
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });

    this.logger.log(`Product variant deleted: ${variantId}`);
    return { success: true, id: variantId };
  }

  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  async adjustInventory(
    tenantId: string,
    productId: string,
    variantId: string | null,
    adjustment: number,
    reason?: string,
  ) {
    await this.findOneProduct(tenantId, productId);

    if (variantId) {
      const variant = await this.findOneVariant(tenantId, productId, variantId);
      const newQty = Math.max(0, variant.inventoryQty + adjustment);

      const updated = await this.prisma.productVariant.update({
        where: { id: variantId },
        data: { inventoryQty: newQty },
      });

      this.logger.log(
        `Inventory adjusted for variant ${variantId}: ${adjustment} (${reason || "manual adjustment"})`,
      );
      return updated;
    } else {
      const product = await this.findOneProduct(tenantId, productId);
      const newQty = Math.max(0, product.inventoryQty + adjustment);

      const updated = await this.prisma.product.update({
        where: { id: productId },
        data: { inventoryQty: newQty },
        include: {
          category: true,
          variants: true,
        },
      });

      this.logger.log(
        `Inventory adjusted for product ${productId}: ${adjustment} (${reason || "manual adjustment"})`,
      );
      return updated;
    }
  }

  async getLowStockProducts(tenantId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        tenantId,
        trackInventory: true,
        hasVariants: false,
        status: "active",
        inventoryQty: {
          lte: this.prisma.product.fields.lowStockThreshold,
        },
      },
      include: {
        category: true,
      },
      orderBy: { inventoryQty: "asc" },
    });

    const variants = await this.prisma.productVariant.findMany({
      where: {
        product: {
          tenantId,
          trackInventory: true,
          hasVariants: true,
          status: "active",
        },
        available: true,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });

    const lowStockVariants = variants.filter((v) => {
      const threshold = v.product.lowStockThreshold ?? 10;
      return v.inventoryQty <= threshold;
    });

    return {
      products,
      variants: lowStockVariants,
    };
  }
}

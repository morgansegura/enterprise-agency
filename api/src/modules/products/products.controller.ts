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
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "./dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
import { RequireFeature } from "@/common/decorators/feature.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";

/**
 * Products Controller
 *
 * Manages products, product categories, and product variants for e-commerce.
 * All endpoints require authentication and tenant context.
 * Requires the 'shop' feature to be enabled for the tenant.
 */
@Controller("products")
@UseGuards(JwtAuthGuard, TenantAccessGuard, FeatureGuard, PermissionGuard)
@RequireFeature("shop")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============================================================================
  // PRODUCT CATEGORIES
  // ============================================================================

  @Post("categories")
  @Permissions(Permission.CATEGORIES_CREATE)
  createCategory(
    @TenantId() tenantId: string,
    @Body() createDto: CreateProductCategoryDto,
  ) {
    return this.productsService.createCategory(tenantId, createDto);
  }

  @Get("categories")
  @Permissions(Permission.CATEGORIES_VIEW)
  findAllCategories(
    @TenantId() tenantId: string,
    @Query("parentId") parentId?: string,
    @Query("search") search?: string,
  ) {
    return this.productsService.findAllCategories(tenantId, {
      parentId: parentId === "null" ? null : parentId,
      search,
    });
  }

  @Get("categories/:id")
  @Permissions(Permission.CATEGORIES_VIEW)
  findOneCategory(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.findOneCategory(tenantId, id);
  }

  @Patch("categories/:id")
  @Permissions(Permission.CATEGORIES_EDIT)
  updateCategory(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateProductCategoryDto,
  ) {
    return this.productsService.updateCategory(tenantId, id, updateDto);
  }

  @Delete("categories/:id")
  @Permissions(Permission.CATEGORIES_DELETE)
  removeCategory(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.removeCategory(tenantId, id);
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================

  @Post()
  @Permissions(Permission.PRODUCTS_CREATE)
  createProduct(
    @TenantId() tenantId: string,
    @Body() createDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(tenantId, createDto);
  }

  @Get()
  @Permissions(Permission.PRODUCTS_VIEW)
  findAllProducts(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("categoryId") categoryId?: string,
    @Query("featured", new DefaultValuePipe(undefined)) featured?: string,
    @Query("search") search?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.productsService.findAllProducts(tenantId, {
      status,
      categoryId,
      featured: featured === undefined ? undefined : featured === "true",
      search,
      page,
      limit,
    });
  }

  @Get("low-stock")
  @Permissions(Permission.PRODUCTS_VIEW)
  getLowStockProducts(@TenantId() tenantId: string) {
    return this.productsService.getLowStockProducts(tenantId);
  }

  @Get(":id")
  @Permissions(Permission.PRODUCTS_VIEW)
  findOneProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.findOneProduct(tenantId, id);
  }

  @Get("slug/:slug")
  @Permissions(Permission.PRODUCTS_VIEW)
  findProductBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.productsService.findProductBySlug(tenantId, slug);
  }

  @Patch(":id")
  @Permissions(Permission.PRODUCTS_EDIT)
  updateProduct(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(tenantId, id, updateDto);
  }

  @Delete(":id")
  @Permissions(Permission.PRODUCTS_DELETE)
  removeProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.removeProduct(tenantId, id);
  }

  @Post(":id/archive")
  @Permissions(Permission.PRODUCTS_EDIT)
  archiveProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.archiveProduct(tenantId, id);
  }

  @Post(":id/duplicate")
  @Permissions(Permission.PRODUCTS_CREATE)
  duplicateProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.duplicateProduct(tenantId, id);
  }

  @Post(":id/inventory")
  @Permissions(Permission.PRODUCTS_EDIT)
  adjustInventory(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { adjustment: number; variantId?: string; reason?: string },
  ) {
    return this.productsService.adjustInventory(
      tenantId,
      id,
      body.variantId ?? null,
      body.adjustment,
      body.reason,
    );
  }

  // ============================================================================
  // PRODUCT VARIANTS
  // ============================================================================

  @Post(":productId/variants")
  @Permissions(Permission.PRODUCTS_CREATE)
  createVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Body() createDto: Omit<CreateProductVariantDto, "productId">,
  ) {
    return this.productsService.createVariant(tenantId, {
      ...createDto,
      productId,
    });
  }

  @Get(":productId/variants")
  @Permissions(Permission.PRODUCTS_VIEW)
  findAllVariants(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
  ) {
    return this.productsService.findAllVariants(tenantId, productId);
  }

  @Get(":productId/variants/:variantId")
  @Permissions(Permission.PRODUCTS_VIEW)
  findOneVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
  ) {
    return this.productsService.findOneVariant(tenantId, productId, variantId);
  }

  @Patch(":productId/variants/:variantId")
  @Permissions(Permission.PRODUCTS_EDIT)
  updateVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
    @Body() updateDto: UpdateProductVariantDto,
  ) {
    return this.productsService.updateVariant(
      tenantId,
      productId,
      variantId,
      updateDto,
    );
  }

  @Delete(":productId/variants/:variantId")
  @Permissions(Permission.PRODUCTS_DELETE)
  removeVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
  ) {
    return this.productsService.removeVariant(tenantId, productId, variantId);
  }
}

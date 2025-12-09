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
import { TenantGuard } from "@/common/guards/tenant.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
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
@UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard, RolesGuard)
@RequireFeature("shop")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============================================================================
  // PRODUCT CATEGORIES
  // ============================================================================

  @Post("categories")
  @Roles("owner", "admin", "editor")
  createCategory(
    @TenantId() tenantId: string,
    @Body() createDto: CreateProductCategoryDto,
  ) {
    return this.productsService.createCategory(tenantId, createDto);
  }

  @Get("categories")
  @Roles("owner", "admin", "editor", "viewer")
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
  @Roles("owner", "admin", "editor", "viewer")
  findOneCategory(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.findOneCategory(tenantId, id);
  }

  @Patch("categories/:id")
  @Roles("owner", "admin", "editor")
  updateCategory(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateProductCategoryDto,
  ) {
    return this.productsService.updateCategory(tenantId, id, updateDto);
  }

  @Delete("categories/:id")
  @Roles("owner", "admin")
  removeCategory(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.removeCategory(tenantId, id);
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================

  @Post()
  @Roles("owner", "admin", "editor")
  createProduct(
    @TenantId() tenantId: string,
    @Body() createDto: CreateProductDto,
  ) {
    return this.productsService.createProduct(tenantId, createDto);
  }

  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAllProducts(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("categoryId") categoryId?: string,
    @Query("featured", new DefaultValuePipe(undefined)) featured?: string,
    @Query("search") search?: string,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.productsService.findAllProducts(tenantId, {
      status,
      categoryId,
      featured: featured === undefined ? undefined : featured === "true",
      search,
      limit,
      offset,
    });
  }

  @Get("low-stock")
  @Roles("owner", "admin", "editor")
  getLowStockProducts(@TenantId() tenantId: string) {
    return this.productsService.getLowStockProducts(tenantId);
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOneProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.findOneProduct(tenantId, id);
  }

  @Get("slug/:slug")
  @Roles("owner", "admin", "editor", "viewer")
  findProductBySlug(@TenantId() tenantId: string, @Param("slug") slug: string) {
    return this.productsService.findProductBySlug(tenantId, slug);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  updateProduct(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(tenantId, id, updateDto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  removeProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.removeProduct(tenantId, id);
  }

  @Post(":id/archive")
  @Roles("owner", "admin", "editor")
  archiveProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.archiveProduct(tenantId, id);
  }

  @Post(":id/duplicate")
  @Roles("owner", "admin", "editor")
  duplicateProduct(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.productsService.duplicateProduct(tenantId, id);
  }

  @Post(":id/inventory")
  @Roles("owner", "admin", "editor")
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
  @Roles("owner", "admin", "editor")
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
  @Roles("owner", "admin", "editor", "viewer")
  findAllVariants(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
  ) {
    return this.productsService.findAllVariants(tenantId, productId);
  }

  @Get(":productId/variants/:variantId")
  @Roles("owner", "admin", "editor", "viewer")
  findOneVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
  ) {
    return this.productsService.findOneVariant(tenantId, productId, variantId);
  }

  @Patch(":productId/variants/:variantId")
  @Roles("owner", "admin", "editor")
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
  @Roles("owner", "admin")
  removeVariant(
    @TenantId() tenantId: string,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
  ) {
    return this.productsService.removeVariant(tenantId, productId, variantId);
  }
}

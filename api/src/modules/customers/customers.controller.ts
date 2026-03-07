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
import { CustomersService } from "./customers.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
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
 * Customers Controller
 *
 * Manages customers and customer addresses for e-commerce.
 * All endpoints require authentication and tenant context.
 * Requires the 'shop' feature to be enabled for the tenant.
 */
@Controller("customers")
@UseGuards(JwtAuthGuard, TenantAccessGuard, FeatureGuard, PermissionGuard)
@RequireFeature("shop")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ============================================================================
  // CUSTOMERS
  // ============================================================================

  @Post()
  @Permissions(Permission.CUSTOMERS_CREATE)
  create(@TenantId() tenantId: string, @Body() createDto: CreateCustomerDto) {
    return this.customersService.create(tenantId, createDto);
  }

  @Get()
  @Permissions(Permission.CUSTOMERS_VIEW)
  findAll(
    @TenantId() tenantId: string,
    @Query("search") search?: string,
    @Query("hasAccount") hasAccount?: string,
    @Query("acceptsMarketing") acceptsMarketing?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.customersService.findAll(tenantId, {
      search,
      hasAccount: hasAccount === undefined ? undefined : hasAccount === "true",
      acceptsMarketing:
        acceptsMarketing === undefined
          ? undefined
          : acceptsMarketing === "true",
      page,
      limit,
    });
  }

  @Get("stats")
  @Permissions(Permission.CUSTOMERS_VIEW)
  getStats(@TenantId() tenantId: string) {
    return this.customersService.getCustomerStats(tenantId);
  }

  @Get(":id")
  @Permissions(Permission.CUSTOMERS_VIEW)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.customersService.findOne(tenantId, id);
  }

  @Get("email/:email")
  @Permissions(Permission.CUSTOMERS_VIEW)
  findByEmail(@TenantId() tenantId: string, @Param("email") email: string) {
    return this.customersService.findByEmail(tenantId, email);
  }

  @Patch(":id")
  @Permissions(Permission.CUSTOMERS_EDIT)
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenantId, id, updateDto);
  }

  @Delete(":id")
  @Permissions(Permission.CUSTOMERS_DELETE)
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.customersService.remove(tenantId, id);
  }

  // ============================================================================
  // CUSTOMER ADDRESSES
  // ============================================================================

  @Post(":customerId/addresses")
  @Permissions(Permission.CUSTOMERS_EDIT)
  createAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Body() createDto: CreateCustomerAddressDto,
  ) {
    return this.customersService.createAddress(tenantId, customerId, createDto);
  }

  @Get(":customerId/addresses")
  @Permissions(Permission.CUSTOMERS_VIEW)
  findAllAddresses(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.customersService.findAllAddresses(tenantId, customerId);
  }

  @Get(":customerId/addresses/:addressId")
  @Permissions(Permission.CUSTOMERS_VIEW)
  findOneAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Param("addressId") addressId: string,
  ) {
    return this.customersService.findOneAddress(
      tenantId,
      customerId,
      addressId,
    );
  }

  @Patch(":customerId/addresses/:addressId")
  @Permissions(Permission.CUSTOMERS_EDIT)
  updateAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Param("addressId") addressId: string,
    @Body() updateDto: UpdateCustomerAddressDto,
  ) {
    return this.customersService.updateAddress(
      tenantId,
      customerId,
      addressId,
      updateDto,
    );
  }

  @Delete(":customerId/addresses/:addressId")
  @Permissions(Permission.CUSTOMERS_DELETE)
  removeAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Param("addressId") addressId: string,
  ) {
    return this.customersService.removeAddress(tenantId, customerId, addressId);
  }

  @Post(":customerId/addresses/:addressId/default")
  @Permissions(Permission.CUSTOMERS_EDIT)
  setDefaultAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Param("addressId") addressId: string,
  ) {
    return this.customersService.setDefaultAddress(
      tenantId,
      customerId,
      addressId,
    );
  }
}

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
import { TenantGuard } from "@/common/guards/tenant.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
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
@UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard, RolesGuard)
@RequireFeature("shop")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ============================================================================
  // CUSTOMERS
  // ============================================================================

  @Post()
  @Roles("owner", "admin", "editor")
  create(@TenantId() tenantId: string, @Body() createDto: CreateCustomerDto) {
    return this.customersService.create(tenantId, createDto);
  }

  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAll(
    @TenantId() tenantId: string,
    @Query("search") search?: string,
    @Query("hasAccount") hasAccount?: string,
    @Query("acceptsMarketing") acceptsMarketing?: string,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.customersService.findAll(tenantId, {
      search,
      hasAccount: hasAccount === undefined ? undefined : hasAccount === "true",
      acceptsMarketing:
        acceptsMarketing === undefined
          ? undefined
          : acceptsMarketing === "true",
      limit,
      offset,
    });
  }

  @Get("stats")
  @Roles("owner", "admin", "editor", "viewer")
  getStats(@TenantId() tenantId: string) {
    return this.customersService.getCustomerStats(tenantId);
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.customersService.findOne(tenantId, id);
  }

  @Get("email/:email")
  @Roles("owner", "admin", "editor", "viewer")
  findByEmail(@TenantId() tenantId: string, @Param("email") email: string) {
    return this.customersService.findByEmail(tenantId, email);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenantId, id, updateDto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  remove(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.customersService.remove(tenantId, id);
  }

  // ============================================================================
  // CUSTOMER ADDRESSES
  // ============================================================================

  @Post(":customerId/addresses")
  @Roles("owner", "admin", "editor")
  createAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Body() createDto: CreateCustomerAddressDto,
  ) {
    return this.customersService.createAddress(tenantId, customerId, createDto);
  }

  @Get(":customerId/addresses")
  @Roles("owner", "admin", "editor", "viewer")
  findAllAddresses(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.customersService.findAllAddresses(tenantId, customerId);
  }

  @Get(":customerId/addresses/:addressId")
  @Roles("owner", "admin", "editor", "viewer")
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
  @Roles("owner", "admin", "editor")
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
  @Roles("owner", "admin")
  removeAddress(
    @TenantId() tenantId: string,
    @Param("customerId") customerId: string,
    @Param("addressId") addressId: string,
  ) {
    return this.customersService.removeAddress(tenantId, customerId, addressId);
  }

  @Post(":customerId/addresses/:addressId/default")
  @Roles("owner", "admin", "editor")
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

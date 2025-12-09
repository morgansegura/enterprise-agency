import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderDto } from "./dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { RequireFeature } from "@/common/decorators/feature.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";

/**
 * Orders Controller
 *
 * Manages orders for e-commerce.
 * All endpoints require authentication and tenant context.
 * Requires the 'shop' feature to be enabled for the tenant.
 */
@Controller("orders")
@UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard, RolesGuard)
@RequireFeature("shop")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles("owner", "admin", "editor")
  create(@TenantId() tenantId: string, @Body() createDto: CreateOrderDto) {
    return this.ordersService.create(tenantId, createDto);
  }

  @Get()
  @Roles("owner", "admin", "editor", "viewer")
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("paymentStatus") paymentStatus?: string,
    @Query("fulfillmentStatus") fulfillmentStatus?: string,
    @Query("customerId") customerId?: string,
    @Query("search") search?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.ordersService.findAll(tenantId, {
      status,
      paymentStatus,
      fulfillmentStatus,
      customerId,
      search,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit,
      offset,
    });
  }

  @Get("stats")
  @Roles("owner", "admin", "editor", "viewer")
  getStats(
    @TenantId() tenantId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.ordersService.getOrderStats(
      tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(":id")
  @Roles("owner", "admin", "editor", "viewer")
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.ordersService.findOne(tenantId, id);
  }

  @Get("number/:orderNumber")
  @Roles("owner", "admin", "editor", "viewer")
  findByOrderNumber(
    @TenantId() tenantId: string,
    @Param("orderNumber", ParseIntPipe) orderNumber: number,
  ) {
    return this.ordersService.findByOrderNumber(tenantId, orderNumber);
  }

  @Patch(":id")
  @Roles("owner", "admin", "editor")
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(tenantId, id, updateDto);
  }

  @Post(":id/cancel")
  @Roles("owner", "admin")
  cancel(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.ordersService.cancel(tenantId, id);
  }

  @Post(":id/fulfill")
  @Roles("owner", "admin", "editor")
  fulfillItems(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { itemIds: string[] },
  ) {
    return this.ordersService.fulfillItems(tenantId, id, body.itemIds);
  }
}

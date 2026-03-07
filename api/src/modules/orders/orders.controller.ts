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
import { TenantAccessGuard } from "@/common/guards/tenant-access.guard";
import { FeatureGuard } from "@/common/guards/feature.guard";
import { PermissionGuard } from "@/common/guards/permission.guard";
import { Permissions } from "@/common/decorators/permissions.decorator";
import { Permission } from "@/common/permissions";
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
@UseGuards(JwtAuthGuard, TenantAccessGuard, FeatureGuard, PermissionGuard)
@RequireFeature("shop")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Permissions(Permission.ORDERS_CREATE)
  create(@TenantId() tenantId: string, @Body() createDto: CreateOrderDto) {
    return this.ordersService.create(tenantId, createDto);
  }

  @Get()
  @Permissions(Permission.ORDERS_VIEW)
  findAll(
    @TenantId() tenantId: string,
    @Query("status") status?: string,
    @Query("paymentStatus") paymentStatus?: string,
    @Query("fulfillmentStatus") fulfillmentStatus?: string,
    @Query("customerId") customerId?: string,
    @Query("search") search?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.ordersService.findAll(tenantId, {
      status,
      paymentStatus,
      fulfillmentStatus,
      customerId,
      search,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      limit,
    });
  }

  @Get("stats")
  @Permissions(Permission.ORDERS_VIEW)
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
  @Permissions(Permission.ORDERS_VIEW)
  findOne(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.ordersService.findOne(tenantId, id);
  }

  @Get("number/:orderNumber")
  @Permissions(Permission.ORDERS_VIEW)
  findByOrderNumber(
    @TenantId() tenantId: string,
    @Param("orderNumber", ParseIntPipe) orderNumber: number,
  ) {
    return this.ordersService.findByOrderNumber(tenantId, orderNumber);
  }

  @Patch(":id")
  @Permissions(Permission.ORDERS_EDIT)
  update(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(tenantId, id, updateDto);
  }

  @Post(":id/cancel")
  @Permissions(Permission.ORDERS_DELETE)
  cancel(@TenantId() tenantId: string, @Param("id") id: string) {
    return this.ordersService.cancel(tenantId, id);
  }

  @Post(":id/fulfill")
  @Permissions(Permission.ORDERS_FULFILL)
  fulfillItems(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() body: { itemIds: string[] },
  ) {
    return this.ordersService.fulfillItems(tenantId, id, body.itemIds);
  }
}

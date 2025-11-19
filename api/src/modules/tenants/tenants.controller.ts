import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common'
import { TenantsService } from './tenants.service'
import { UsersService } from '@/modules/users/users.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { CreateDomainDto } from './dto/create-domain.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from '@/common/guards/roles.guard'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { Roles } from '@/common/decorators/roles.decorator'

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  async listTenants() {
    return this.tenantsService.findAll()
  }

  @Post()
  async createTenant(
    @CurrentUser() currentUser: { id: string; sessionId: string },
    @Body() createData: CreateTenantDto
  ) {
    // Get user from database by Clerk ID
    const user = await this.usersService.findByClerkId(currentUser.id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.tenantsService.create(createData, user.id)
  }

  @Get(':id')
  async getTenant(@Param('id') id: string) {
    return this.tenantsService.findById(id)
  }

  @Get('slug/:slug')
  async getTenantBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  async updateTenant(@Param('id') id: string, @Body() updateData: UpdateTenantDto) {
    return this.tenantsService.update(id, updateData)
  }

  @Post(':id/domains')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  async addDomain(@Param('id') tenantId: string, @Body() domainData: CreateDomainDto) {
    return this.tenantsService.addDomain(tenantId, domainData)
  }

  @Delete(':id/domains/:domainId')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  async removeDomain(@Param('id') tenantId: string, @Param('domainId') domainId: string) {
    return this.tenantsService.removeDomain(tenantId, domainId)
  }
}

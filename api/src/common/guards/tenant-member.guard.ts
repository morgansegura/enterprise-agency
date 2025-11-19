import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '@/common/services/prisma.service'

@Injectable()
export class TenantMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const tenantId = request.tenantId

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    if (!tenantId) {
      throw new ForbiddenException('Tenant context required')
    }

    // DEVELOPMENT MODE: Allow access if tenant exists (skip user membership check)
    if (process.env.NODE_ENV === 'development') {
      // Try to find tenant by slug first, then by ID
      const tenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [{ slug: tenantId }, { id: tenantId }],
        },
      })

      if (tenant) {
        // Create a mock tenant user for development
        request.tenantUser = {
          tenantId: tenant.id,
          userId: user.id,
          role: 'owner',
        }
        return true
      }
    }

    // Get user from database by Clerk ID
    const dbUser = await this.prisma.user.findUnique({
      where: { clerkUserId: user.id },
    })

    if (!dbUser) {
      throw new ForbiddenException('User not found')
    }

    // Check if user is member of tenant
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: {
          tenantId,
          userId: dbUser.id,
        },
      },
    })

    if (!tenantUser) {
      throw new ForbiddenException('You do not have access to this tenant')
    }

    // Attach tenant user info to request for use in controllers
    request.tenantUser = tenantUser

    return true
  }
}

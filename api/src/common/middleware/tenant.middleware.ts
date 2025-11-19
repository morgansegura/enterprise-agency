import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain (e.g., demo.example.com)
    const host = req.get('host') || ''
    const subdomain = host.split('.')[0]

    // Extract tenant from query parameter (e.g., ?tenant=demo)
    const tenantFromQuery = req.query.tenant as string

    // Determine tenant ID
    let tenantId: string | null = null

    if (tenantFromQuery) {
      tenantId = tenantFromQuery
    } else if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      tenantId = subdomain
    }

    // For development: allow requests without tenant for health checks
    // In production, all routes except health should require a tenant
    if (!tenantId && process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Tenant identifier required')
    }

    // Attach tenant to request object for use in controllers/services
    ;(req as Request & { tenantId?: string }).tenantId = tenantId || undefined

    next()
  }
}

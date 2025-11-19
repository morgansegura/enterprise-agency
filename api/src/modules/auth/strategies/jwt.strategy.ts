import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/common/services/prisma.service'
import type { Request } from 'express'

export interface JwtPayload {
  sub: string // user ID
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract from cookie (primary method for browser clients)
        (request: Request) => {
          return request?.cookies?.accessToken
        },
        // Fallback to Authorization header (for API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        config.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
    })
  }

  async validate(payload: JwtPayload) {
    // Verify user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified')
    }

    // Return user object that will be attached to request.user
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      tenants: user.tenantUsers.map((tu) => ({
        id: tu.tenant.id,
        slug: tu.tenant.slug,
        businessName: tu.tenant.businessName,
        role: tu.role,
        permissions: tu.permissions,
      })),
    }
  }
}

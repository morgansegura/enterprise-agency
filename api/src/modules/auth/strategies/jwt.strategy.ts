import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/services/prisma.service";
import type { Request } from "express";

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  tokenVersion: number; // For token revocation
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get("JWT_SECRET");

    // SECURITY: Fail fast if JWT_SECRET is not configured
    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 64",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract from cookie (primary method for browser clients)
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
        // Fallback to Authorization header (for API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
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
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException("Email not verified");
    }

    // SECURITY: Check token version (for token revocation)
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException("Token has been revoked");
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
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/services/prisma.service';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Cookie first (browser clients)
        (request: Request) => request?.cookies?.access_token,
        // Bearer header fallback (API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSuperAdmin: user.isSuperAdmin,
      emailVerified: user.emailVerified,
    };
  }
}

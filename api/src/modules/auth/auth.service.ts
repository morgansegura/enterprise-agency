import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/services/prisma.service';
import { EmailService } from '@/common/services/email.service';
import { AuditLogService, AuditAction } from '@/common/services/audit-log.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const PASSWORD_RESET_EXPIRY_MINUTES = 15;
const MAX_RESET_REQUESTS_PER_HOUR = 3;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 24 * 60 * 60 * 1000;

interface RequestContext {
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
    private audit: AuditLogService,
  ) {}

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    const genericMessage =
      "If this email is not already registered, we've sent a verification email. Please check your inbox.";

    if (existingUser) {
      if (existingUser.emailVerified) {
        await this.emailService.sendAccountExistsEmail(existingUser.email);
      } else {
        const newToken = this.generateSecureToken();
        const newExpiry = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN);

        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { verificationToken: newToken, verificationTokenExpires: newExpiry },
        });

        await this.emailService.sendVerificationEmail(existingUser.email, newToken);
      }
      return { message: genericMessage };
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const verificationToken = this.generateSecureToken();
    const verificationTokenExpires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        emailVerified: false,
        verificationToken,
        verificationTokenExpires,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, verificationToken);
    return { message: genericMessage };
  }

  // ---------------------------------------------------------------------------
  // Portal Registration (sub-client self-service)
  // ---------------------------------------------------------------------------

  async registerPortalCustomer(dto: RegisterDto, tenantId: string, context?: RequestContext) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          emailVerified: true, // Portal customers are verified on creation
        },
      });

      await tx.customer.create({
        data: {
          tenantId,
          email: dto.email.toLowerCase(),
          firstName: dto.firstName,
          lastName: dto.lastName,
          hasAccount: true,
          userId: user.id,
        },
      });

      await tx.tenantUser.create({
        data: { tenantId, userId: user.id, role: 'SUB_CLIENT' },
      });

      return user;
    });

    const tokens = await this.generateTokens(result.id, result.email);
    const tenantAccess = await this.getUserTenantAccess(result.id);

    this.audit.log({
      tenantId,
      userId: result.id,
      action: AuditAction.REGISTER,
      resourceType: 'auth',
      metadata: { portal: true },
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    return {
      tokens,
      user: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        tenants: tenantAccess,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  async login(dto: LoginDto, context?: RequestContext) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Timing-attack safe: always compare even if user doesn't exist
    const dummyHash = '$2b$12$dummyHashToPreventTimingAttack1234567890123456789012345678';
    const hashToCompare = user?.passwordHash || dummyHash;
    const isPasswordValid = await bcrypt.compare(dto.password, hashToCompare);

    if (!user || !user.passwordHash || !isPasswordValid || user.deletedAt) {
      if (user && isPasswordValid === false) {
        await this.handleFailedLogin(user.id, user.failedLoginAttempts);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      this.logger.warn(`Login attempt on locked account: ${user.email}`);
      throw new UnauthorizedException('Account is locked. Please try again later.');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Reset failed attempts on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: context?.ipAddress || null,
      },
    });

    const accessToken = await this.signAccessToken(user.id, user.email, user.tokenVersion);
    const refreshToken = await this.generateRefreshToken(user.id);
    const tenantAccess = await this.getUserTenantAccess(user.id);

    this.audit.log({
      tenantId: context?.tenantId,
      userId: user.id,
      action: AuditAction.LOGIN,
      resourceType: 'auth',
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperAdmin: user.isSuperAdmin,
        emailVerified: user.emailVerified,
        status: user.status,
        tenants: tenantAccess,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Token Refresh (with rotation)
  // ---------------------------------------------------------------------------

  async refreshAccessToken(refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
      include: { user: true },
    });

    if (!storedToken || storedToken.user.deletedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = storedToken.user;
    const accessToken = await this.signAccessToken(user.id, user.email, user.tokenVersion);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken, expiresIn: 900 };
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const hashedToken = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { token: hashedToken, userId },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all refresh tokens
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Also increment tokenVersion to invalidate all access tokens instantly
    await this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    this.audit.log({
      userId,
      action: AuditAction.LOGOUT,
      resourceType: 'auth',
    });

    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenantUsers: { include: { tenant: true } } },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isSuperAdmin: user.isSuperAdmin,
      emailVerified: user.emailVerified,
      status: user.status,
      tenants: user.tenantUsers.map((tu) => ({
        id: tu.tenant.id,
        slug: tu.tenant.slug,
        businessName: tu.tenant.businessName,
        role: tu.role,
        permissions: tu.permissions,
      })),
    };
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true },
    });

    return user;
  }

  // ---------------------------------------------------------------------------
  // Password Management
  // ---------------------------------------------------------------------------

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      throw new BadRequestException('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    this.audit.log({
      userId,
      action: AuditAction.PASSWORD_CHANGED,
      resourceType: 'auth',
    });

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string, ipAddress?: string, userAgent?: string) {
    const successMessage = {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      await this.simulateProcessingDelay();
      return successMessage;
    }

    // Rate limit
    const recentRequests = await this.prisma.passwordResetToken.count({
      where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
    });

    if (recentRequests >= MAX_RESET_REQUESTS_PER_HOUR) {
      return successMessage;
    }

    // Invalidate existing tokens
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent ? userAgent.substring(0, 500) : null,
      },
    });

    await this.emailService.sendPasswordResetEmail(user.email, rawToken);

    this.audit.log({
      userId: user.id,
      action: AuditAction.PASSWORD_RESET_REQUESTED,
      resourceType: 'auth',
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

    return successMessage;
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const hashedToken = this.hashToken(token);

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: { token: hashedToken, expiresAt: { gt: new Date() }, usedAt: null },
      include: { user: true },
    });

    return { valid: !!(resetToken && !resetToken.user.deletedAt) };
  }

  async resetPassword(token: string, newPassword: string, ipAddress?: string) {
    const hashedToken = this.hashToken(token);

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: { token: hashedToken, expiresAt: { gt: new Date() }, usedAt: null },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    if (resetToken.user.deletedAt) {
      throw new BadRequestException('Account no longer exists.');
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
      });

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });

      // Revoke all refresh tokens for security
      await tx.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    });

    this.audit.log({
      userId: resetToken.userId,
      action: AuditAction.PASSWORD_RESET_COMPLETED,
      resourceType: 'auth',
      ipAddress: ipAddress,
    });

    return { message: 'Password has been reset successfully. Please log in.' };
  }

  // ---------------------------------------------------------------------------
  // Email Verification
  // ---------------------------------------------------------------------------

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token, verificationTokenExpires: { gt: new Date() } },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null, verificationTokenExpires: null },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return { message: 'If an account exists with this email, a verification email has been sent.' };
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = this.generateSecureToken();
    const verificationTokenExpires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, verificationTokenExpires },
    });

    await this.emailService.sendVerificationEmail(user.email, verificationToken);
    return { message: 'Verification email sent. Please check your inbox.' };
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private async handleFailedLogin(userId: string, currentAttempts: number): Promise<void> {
    const newAttempts = currentAttempts + 1;

    const data: { failedLoginAttempts: number; lockedUntil?: Date } = {
      failedLoginAttempts: newAttempts,
    };

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      this.logger.warn(`Account locked after ${newAttempts} failed attempts: ${userId}`);
      this.audit.log({
        userId,
        action: AuditAction.ACCOUNT_LOCKED,
        resourceType: 'auth',
        metadata: { attempts: newAttempts },
      });
    } else {
      this.audit.log({
        userId,
        action: AuditAction.LOGIN_FAILED,
        resourceType: 'auth',
        metadata: { attempts: newAttempts },
      });
    }

    await this.prisma.user.update({ where: { id: userId }, data });
  }

  private async signAccessToken(userId: string, email: string, tokenVersion: number): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    if (!jwtSecret) throw new Error('JWT_SECRET is not configured');

    const payload: JwtPayload = { sub: userId, email, tokenVersion };
    return this.jwtService.signAsync(payload, { secret: jwtSecret, expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const rawToken = crypto.randomBytes(64).toString('hex');
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { token: hashedToken, userId, expiresAt },
    });

    return rawToken;
  }

  private async generateTokens(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenVersion: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const accessToken = await this.signAccessToken(userId, email, user.tokenVersion);
    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  private async getUserTenantAccess(userId: string) {
    const tenantUsers = await this.prisma.tenantUser.findMany({
      where: { userId },
      include: { tenant: { select: { id: true, slug: true, businessName: true, tenantType: true } } },
      orderBy: { tenant: { businessName: 'asc' } },
    });

    return tenantUsers.map((tu) => ({
      id: tu.tenant.id,
      slug: tu.tenant.slug,
      name: tu.tenant.businessName,
      type: tu.tenant.tenantType,
      role: tu.role,
    }));
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async simulateProcessingDelay(): Promise<void> {
    const delay = 100 + Math.random() * 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

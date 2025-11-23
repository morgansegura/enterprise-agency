import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/services/prisma.service";
import { EmailService } from "@/common/services/email.service";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dto";
import { JwtPayload } from "./strategies/jwt.strategy";

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const PASSWORD_RESET_TOKEN_EXPIRES_IN = 60 * 60 * 1000; // 1 hour
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // SECURITY: Always return same message to prevent email enumeration
    const genericMessage =
      "If this email is not already registered, we've sent a verification email. Please check your inbox.";

    if (existingUser) {
      // User exists - don't reveal this in the response
      // Send appropriate email based on their status
      if (existingUser.emailVerified) {
        // Account already exists and verified - send a reminder email
        await this.emailService.sendAccountExistsEmail(existingUser.email);
      } else {
        // Account exists but unverified - resend verification
        const newToken = this.generateSecureToken();
        const newExpiry = new Date(
          Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
        );

        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            verificationToken: newToken,
            verificationTokenExpires: newExpiry,
          },
        });

        await this.emailService.sendVerificationEmail(
          existingUser.email,
          newToken,
        );
      }

      return { message: genericMessage };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Generate email verification token
    const verificationToken = this.generateSecureToken();
    const verificationTokenExpires = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
    );

    // Create user
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

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return { message: genericMessage };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto, ipAddress?: string) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    // SECURITY: Always perform bcrypt comparison to prevent timing attacks
    // Use dummy hash if user doesn't exist to keep timing consistent
    const dummyHash =
      "$2b$12$dummyHashToPreventTimingAttack1234567890123456789012345678";
    const hashToCompare = user?.passwordHash || dummyHash;

    const isPasswordValid = await bcrypt.compare(dto.password, hashToCompare);

    // Check credentials after comparison to prevent timing-based user enumeration
    if (!user || !user.passwordHash || !isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        "Please verify your email before logging in",
      );
    }

    // Update last login with timestamp and IP address
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress || null,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSuperAdmin: user.isSuperAdmin,
        agencyRole: user.agencyRole,
        emailVerified: user.emailVerified,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        tenants: user.tenantUsers.map((tu) => ({
          id: tu.tenant.id,
          slug: tu.tenant.slug,
          businessName: tu.tenant.businessName,
          role: tu.role,
          permissions: tu.permissions,
        })),
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string) {
    const jwtSecret = this.config.get("JWT_SECRET");

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: jwtSecret,
        },
      );

      // Verify user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    // Update user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return {
      message: "Email verified successfully. You can now log in.",
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return {
        message:
          "If an account exists with this email, a verification email has been sent.",
      };
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email is already verified");
    }

    // Generate new verification token
    const verificationToken = this.generateSecureToken();
    const verificationTokenExpires = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return { message: "Verification email sent. Please check your inbox." };
  }

  /**
   * Forgot password - send reset token
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Don't reveal if user exists
    if (!user) {
      return {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }

    // Generate password reset token
    const resetToken = this.generateSecureToken();
    const resetTokenExpires = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_EXPIRES_IN,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: "Password reset email sent. Please check your inbox." };
  }

  /**
   * Reset password with token
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Update password and clear reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return {
      message:
        "Password reset successfully. You can now log in with your new password.",
    };
  }

  /**
   * Logout - Revokes all tokens by incrementing tokenVersion
   */
  async logout(userId: string) {
    // SECURITY: Increment tokenVersion to invalidate all existing tokens
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    return { message: "Logged out successfully" };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenantUsers: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSuperAdmin: user.isSuperAdmin,
      agencyRole: user.agencyRole,
      emailVerified: user.emailVerified,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      tenants: user.tenantUsers.map((tu) => ({
        id: tu.tenant.id,
        slug: tu.tenant.slug,
        businessName: tu.tenant.businessName,
        role: tu.role,
        permissions: tu.permissions,
      })),
    };
  }

  /**
   * Private helpers
   */

  private async generateTokens(userId: string, email: string) {
    // Fetch user's current tokenVersion
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenVersion: true },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const payload: JwtPayload = {
      sub: userId,
      email,
      tokenVersion: user.tokenVersion, // Include tokenVersion for revocation
    };

    const jwtSecret = this.config.get("JWT_SECRET");

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}

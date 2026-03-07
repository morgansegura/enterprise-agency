import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  Res,
  Req,
  Ip,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendVerificationDto,
  RefreshTokenDto,
} from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public, CurrentUser } from './decorators';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('portal/register')
  async portalRegister(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tenantId = (req as Request & { tenantId?: string }).tenantId;
    if (!tenantId) throw new UnauthorizedException('Tenant context required');

    const result = await this.authService.registerPortalCustomer(dto, tenantId, {
      tenantId,
      ipAddress: this.getIp(req),
      userAgent: req.headers['user-agent'],
    });

    this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    return { user: result.user };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, {
      tenantId: (req as Request & { tenantId?: string }).tenantId,
      ipAddress: this.getIp(req),
      userAgent: req.headers['user-agent'],
    });

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RefreshTokenDto,
  ) {
    const refreshToken = req.cookies?.refresh_token || dto.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const result = await this.authService.refreshAccessToken(refreshToken);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return { message: 'Token refreshed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: { id: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    await this.authService.logout(user.id, refreshToken);

    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    return { user: await this.authService.getProfile(user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('change-password')
  async changePassword(@CurrentUser() user: { id: string }, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Ip() ip: string, @Req() req: Request) {
    return this.authService.forgotPassword(dto.email, ip, req.headers['user-agent']);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify-reset-token')
  async verifyResetToken(@Body() dto: { token: string }) {
    return this.authService.verifyResetToken(dto.token);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Ip() ip: string) {
    return this.authService.resetPassword(dto.token, dto.password, ip);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE });
  }

  private getIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { Public, CurrentUser } from './decorators'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user
   * POST /api/auth/register
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  /**
   * Login with email and password
   * POST /api/auth/login
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto)

    // Set HTTP-only cookies for tokens
    this.setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken)

    // Return user data only (no tokens in response body)
    return {
      user: result.user,
      message: 'Login successful',
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken']

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found')
    }

    try {
      const tokens = await this.authService.refreshTokens(refreshToken)

      // Set new HTTP-only cookies
      this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

      return {
        message: 'Token refreshed successfully',
      }
    } catch (error) {
      // Clear invalid cookies
      res.clearCookie('accessToken', { path: '/' })
      res.clearCookie('refreshToken', { path: '/' })
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
  }

  /**
   * Helper to set secure HTTP-only cookies
   */
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production'

    // Access token - 15 minutes
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // 'lax' for development (cross-port)
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    })

    // Refresh token - 7 days
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax', // 'lax' for development (cross-port)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    })
  }

  /**
   * Verify email with token
   * GET /api/auth/verify-email?token=xxx
   */
  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token)
  }

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  @Public()
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email)
  }

  /**
   * Forgot password - send reset email
   * POST /api/auth/forgot-password
   */
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto)
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }

  /**
   * Logout (protected route)
   * POST /api/auth/logout
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    // Clear HTTP-only cookies
    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('refreshToken', { path: '/' })

    return this.authService.logout(userId)
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: string) {
    return this.authService.getCurrentUser(userId)
  }
}

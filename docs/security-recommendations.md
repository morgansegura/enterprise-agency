# Security Recommendations & Fixes

**Status:** B+ (Good, Production-Ready with Critical Fixes)
**Last Security Audit:** November 2025

---

## Executive Summary

Your authentication system uses **HTTP-only cookie-based JWT authentication** for a multi-tenant SaaS platform. The implementation is solid with **good security practices** but requires **critical fixes before production deployment**.

---

## 🔴 CRITICAL FIXES (P0 - Do Before Production)

### 1. Hardcoded JWT Secret Fallback

**Location:** `api/src/modules/auth/strategies/jwt.strategy.ts:26-28`

**Current Code:**

```typescript
secretOrKey: config.get("JWT_SECRET") ||
  "your-super-secret-jwt-key-change-this-in-production";
```

**Risk:** HIGH - Predictable secret if env var not set

**Fix:**

```typescript
const jwtSecret = config.get("JWT_SECRET");
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

super({
  jwtFromRequest: ExtractJwt.fromExtractors([...]),
  secretOrKey: jwtSecret,
  ignoreExpiration: false,
});
```

**File to modify:** `api/src/modules/auth/strategies/jwt.strategy.ts`

---

### 2. No Rate Limiting (Brute Force Vulnerability)

**Risk:** HIGH - Vulnerable to brute force attacks on login

**Fix:** Install and configure rate limiting

```bash
cd api
pnpm add @nestjs/throttler
```

**Update `api/src/app.module.ts`:**

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,      // 1 minute window
      limit: 10,       // 10 requests per minute
    }]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

**Apply stricter limits to auth endpoints:**

**Update `api/src/modules/auth/auth.controller.ts`:**

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller("auth")
export class AuthController {

  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 attempts per minute
  @Post("login")
  async login(...) { ... }

  @Throttle({ default: { limit: 3, ttl: 300000 } })  // 3 attempts per 5 minutes
  @Post("forgot-password")
  async forgotPassword(...) { ... }
}
```

---

### 3. No Token Revocation Mechanism

**Risk:** HIGH - Cannot invalidate tokens on logout or security breach

**Solution:** Implement token versioning in database

**Update Prisma Schema (`api/prisma/schema.prisma`):**

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?
  tokenVersion  Int      @default(0)  // ADD THIS
  // ... other fields
}
```

**Run migration:**

```bash
cd api
pnpm db:migrate
```

**Update `api/src/modules/auth/auth.service.ts`:**

```typescript
// In generateTokens method
private async generateTokens(userId: string, email: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { tokenVersion: true }
  });

  const payload: JwtPayload = {
    sub: userId,
    email,
    tokenVersion: user.tokenVersion,  // ADD THIS
  };

  // ... rest of token generation
}

// In logout method
async logout(userId: string) {
  // Increment token version to invalidate all tokens
  await this.prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } }
  });

  return { message: "Logged out successfully" };
}
```

**Update JWT Strategy validation (`api/src/modules/auth/strategies/jwt.strategy.ts`):**

```typescript
async validate(payload: JwtPayload) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
    include: { tenantUsers: { include: { tenant: true } } }
  });

  if (!user || !user.emailVerified) {
    throw new UnauthorizedException('User not found or email not verified');
  }

  // Check token version
  if (user.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedException('Token has been revoked');
  }

  return user;
}
```

---

### 4. Missing Security Headers

**Risk:** MEDIUM - Missing protection against common web vulnerabilities

**Fix:** Install Helmet.js

```bash
cd api
pnpm add helmet
```

**Update `api/src/main.ts`:**

```typescript
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add Helmet security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // ... rest of bootstrap
}
```

---

## 🟡 IMPORTANT IMPROVEMENTS (P1 - Do Soon)

### 5. Refresh Token Rotation

**Risk:** MEDIUM - Same refresh token can be reused indefinitely

**Current Flow:**

```
Login → Get refresh token
Use refresh token → Get new access token (same refresh token reused)
```

**Recommended Flow:**

```
Login → Get refresh token A
Use refresh token A → Get new access token + new refresh token B
Use refresh token B → Get new access token + new refresh token C
```

**Update `api/src/modules/auth/auth.service.ts`:**

```typescript
async refreshTokens(refreshToken: string) {
  try {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      { secret: this.config.get("JWT_SECRET") }
    );

    // Verify user still exists
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // Check token version
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException("Token has been revoked");
    }

    // Generate BOTH new access AND refresh tokens
    return this.generateTokens(user.id, user.email);
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired refresh token");
  }
}
```

**Update `api/src/modules/auth/auth.controller.ts`:**

```typescript
@Post("refresh")
async refresh(
  @Req() req: Request,
  @Res({ passthrough: true }) res: Response,
) {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    throw new UnauthorizedException("No refresh token found");
  }

  try {
    const tokens = await this.authService.refreshTokens(refreshToken);

    // Set BOTH new tokens (rotation)
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: "Tokens refreshed successfully",
    };
  } catch (error) {
    // Clear invalid cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    throw new UnauthorizedException("Invalid or expired refresh token");
  }
}
```

---

### 6. Development Mode Bypasses

**Risk:** HIGH (if deployed to production)

**Locations:**

- `api/src/common/guards/roles.guard.ts`
- `api/src/common/guards/tenant-member.guard.ts`

**Current Code:**

```typescript
if (process.env.NODE_ENV === "development") {
  return true; // Bypasses authentication!
}
```

**Fix:** Add production environment validation

**Update `api/src/main.ts`:**

```typescript
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validate environment in production
  if (process.env.NODE_ENV === "production") {
    const required = ["JWT_SECRET", "DATABASE_URL"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length) {
      throw new Error(`Missing required env vars: ${missing.join(", ")}`);
    }

    // Ensure JWT_SECRET is not default
    if (process.env.JWT_SECRET?.includes("change-this")) {
      throw new Error("Default JWT_SECRET detected in production");
    }
  }

  // ... rest of bootstrap
}
```

---

### 7. Improved CORS Configuration

**Current:** Basic origin whitelist with empty string fallback

**Recommended:** Stricter validation

**Update `api/src/main.ts`:**

```typescript
const allowedOrigins = [
  "http://localhost:4002", // Client (dev)
  "http://localhost:4001", // Builder (dev)
  process.env.APP_URL,
  process.env.ADMIN_URL,
].filter(Boolean); // Remove undefined/empty

app.enableCors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-Id"],
  exposedHeaders: ["X-Total-Count"],
  maxAge: 86400, // 24 hours
});
```

---

## 🟢 NICE TO HAVE (P2 - Future Enhancements)

### 8. CSRF Protection

**Current:** Partial protection via `sameSite: "strict"` in production

**Enhancement:** Implement double-submit cookie pattern

**Not critical** because:

- Using `sameSite: "strict"` in production
- HTTP-only cookies already prevent XSS
- All requests are same-origin in production

**If needed in future:**

```typescript
// Generate CSRF token on login
const csrfToken = crypto.randomBytes(32).toString('hex');
res.cookie('csrf-token', csrfToken, {
  httpOnly: false,  // Allow client to read
  secure: isProduction,
  sameSite: 'strict',
});

// Validate on state-changing requests
@Post()
checkCsrfToken(@Req() req: Request) {
  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || cookieToken !== headerToken) {
    throw new ForbiddenException('CSRF validation failed');
  }
}
```

---

### 9. Password Complexity Scoring

**Current:** Regex-based validation (good)

**Enhancement:** Use zxcvbn for strength scoring

```bash
pnpm add zxcvbn
```

```typescript
import zxcvbn from 'zxcvbn';

async register(dto: RegisterDto) {
  // Check password strength
  const strength = zxcvbn(dto.password);

  if (strength.score < 3) {
    throw new BadRequestException(
      `Password too weak. Suggestions: ${strength.feedback.suggestions.join(', ')}`
    );
  }

  // ... rest of registration
}
```

---

### 10. Multi-Factor Authentication (MFA)

**Future enhancement** for high-security clients

**Libraries:**

- `speakeasy` for TOTP
- `qrcode` for QR code generation

**Flow:**

```
1. User enables MFA in settings
2. Generate TOTP secret
3. Show QR code
4. Verify code
5. Store secret (encrypted)
6. Require code on login
```

---

## Implementation Checklist

### Before Production Deploy

- [ ] Fix hardcoded JWT secret fallback (P0)
- [ ] Add rate limiting to auth endpoints (P0)
- [ ] Implement token revocation with tokenVersion (P0)
- [ ] Add Helmet security headers (P0)
- [ ] Validate production environment variables (P1)
- [ ] Implement refresh token rotation (P1)
- [ ] Improve CORS configuration (P1)
- [ ] Test all fixes in staging environment
- [ ] Security penetration testing
- [ ] Update .env.example with all required vars

### Post-Launch Improvements

- [ ] Add password strength scoring (P2)
- [ ] Implement audit logging for sensitive actions
- [ ] Add session management dashboard
- [ ] Consider MFA for admin users
- [ ] Setup security monitoring (failed logins, etc.)

---

## Environment Variables Required

**Production `.env` file must include:**

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"

# JWT (CRITICAL - must be unique and secure)
JWT_SECRET="<generate-with-openssl-rand-base64-64>"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server
NODE_ENV="production"
PORT=4000

# CORS
APP_URL="https://app.yourdomain.com"
ADMIN_URL="https://builder.yourdomain.com"

# Email (for verification/password reset)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="<sendgrid-api-key>"
EMAIL_FROM="noreply@yourdomain.com"
```

**Generate secure JWT secret:**

```bash
openssl rand -base64 64
```

---

## Security Testing

### Manual Testing

```bash
# Test rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should get 429 after 5 attempts

# Test token revocation
# 1. Login and save cookies
# 2. Logout
# 3. Try to access protected endpoint with old cookie
# Should get 401
```

### Automated Testing

Create `api/test/security.e2e-spec.ts`:

```typescript
describe("Security (e2e)", () => {
  it("should reject hardcoded JWT secret in production", () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET =
      "your-super-secret-jwt-key-change-this-in-production";

    expect(() => bootstrap()).toThrow("Default JWT_SECRET");
  });

  it("should rate limit login attempts", async () => {
    const attempts = [];
    for (let i = 0; i < 10; i++) {
      attempts.push(
        request(app.getHttpServer())
          .post("/api/v1/auth/login")
          .send({ email: "test@test.com", password: "wrong" }),
      );
    }

    const results = await Promise.all(attempts);
    const rateLimited = results.filter((r) => r.status === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

---

## Security Monitoring

### Metrics to Track

1. **Failed login attempts** (detect brute force)
2. **Password reset requests** (detect enumeration)
3. **Token refresh failures** (detect token theft)
4. **Unusual access patterns** (detect compromised accounts)

### Logging

**Update `api/src/modules/auth/auth.service.ts`:**

```typescript
async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email.toLowerCase() },
  });

  if (!user || !user.passwordHash) {
    // Log failed attempt
    this.logger.warn('Failed login attempt', {
      email: dto.email,
      reason: 'user_not_found',
      ip: this.request.ip,
    });

    throw new UnauthorizedException("Invalid credentials");
  }

  // ... rest of login
}
```

---

## Summary

**Current State:** Good foundation with industry-standard practices

**Critical Gaps:** Token revocation, rate limiting, hardcoded secrets

**Timeline to Production Ready:**

- P0 fixes: **4-6 hours**
- P1 improvements: **2-4 hours**
- Testing: **2-3 hours**

**Total:** 1-2 days of focused work

---

**Next Steps:**

1. Fix P0 issues (start with JWT secret validation)
2. Add rate limiting
3. Implement token revocation
4. Add security headers
5. Test thoroughly
6. Deploy to staging
7. Security audit
8. Deploy to production

---

**Last Updated:** November 2025
**Security Audit By:** Claude (AI Security Analysis)

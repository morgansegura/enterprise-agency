import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { PrismaService } from "./common/services/prisma.service";

/**
 * Dynamic CORS origin validator.
 * - Always allows ADMIN_URL (the builder — only one)
 * - Always allows localhost in development
 * - Validates all other origins against tenant_domains in the database
 * - Caches allowed domains for 60s to avoid per-request DB hits
 */
function createCorsOriginValidator(prisma: PrismaService) {
  let cachedDomains: Set<string> = new Set();
  let cacheExpiry = 0;
  const CACHE_TTL = 60_000; // 60 seconds

  const staticOrigins = new Set(
    [
      process.env.ADMIN_URL,
      ...(process.env.NODE_ENV !== "production"
        ? ["http://localhost:4001", "http://localhost:4002"]
        : []),
    ].filter((v): v is string => Boolean(v)),
  );

  async function refreshCache() {
    const now = Date.now();
    if (now < cacheExpiry) return;

    try {
      const domains = await prisma.tenantDomain.findMany({
        select: { domain: true },
      });

      cachedDomains = new Set(
        domains.flatMap((d) => [`https://${d.domain}`, `http://${d.domain}`]),
      );
      cacheExpiry = now + CACHE_TTL;
    } catch {
      // If DB is unreachable, keep stale cache
    }
  }

  return async (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin) return callback(null, true);

    // Static origins (builder, localhost)
    if (staticOrigins.has(origin)) return callback(null, true);

    // Allow all Vercel preview deployments for this team
    if (
      process.env.VERCEL_PROJECT_PATTERN &&
      origin.endsWith(process.env.VERCEL_PROJECT_PATTERN)
    ) {
      return callback(null, true);
    }

    // Check tenant domains
    await refreshCache();
    if (cachedDomains.has(origin)) return callback(null, true);

    callback(new Error(`CORS: origin ${origin} not allowed`));
  };
}

async function bootstrap() {
  // SECURITY: Validate production environment
  if (process.env.NODE_ENV === "production") {
    const required = ["JWT_SECRET", "DATABASE_URL"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length) {
      throw new Error(`Missing required env vars: ${missing.join(", ")}`);
    }

    // Ensure JWT_SECRET is not default/weak
    if (process.env.JWT_SECRET?.includes("change-this")) {
      throw new Error("Default JWT_SECRET detected in production");
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Enable raw body parsing for Stripe webhooks
    rawBody: true,
  });

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:", "http://localhost:*"],
          frameAncestors: ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // Cookie parser middleware (required for reading cookies)
  app.use(cookieParser());

  // Serve static files from uploads directory
  // Use process.cwd() instead of __dirname for dev/prod compatibility
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });

  // Dynamic CORS — validates origins against tenant_domains table
  const prisma = app.get(PrismaService);
  app.enableCors({
    origin: createCorsOriginValidator(prisma),
    credentials: true,
  });

  // Global exception filter - standardized error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe - validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert primitive types
      },
    }),
  );

  // Root health check — responds before middleware/prefix so Render health checks pass
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get(
    "/",
    (_req: unknown, res: { json: (body: unknown) => void }) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    },
  );

  // API prefix - all routes start with /api
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 4000;
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`API server running on http://localhost:${port}`);
  logger.log(`Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();

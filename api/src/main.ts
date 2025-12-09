import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

import { AppModule } from "./app.module";

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

  // Cookie parser middleware (required for reading cookies)
  app.use(cookieParser());

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/",
  });

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      "http://localhost:4002", // app (dev)
      "http://localhost:4001", // admin (dev)
      process.env.APP_URL || "",
      process.env.ADMIN_URL || "",
    ],
    credentials: true,
  });

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

  // API prefix - all routes start with /api
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();

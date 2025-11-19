import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Cookie parser middleware (required for reading cookies)
  app.use(cookieParser())

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:4002', // app (dev)
      'http://localhost:4001', // admin (dev)
      process.env.APP_URL || '',
      process.env.ADMIN_URL || '',
    ],
    credentials: true,
  })

  // Global validation pipe - validates all DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert primitive types
      },
    })
  )

  // API prefix - all routes start with /api
  app.setGlobalPrefix('api/v1')

  const port = process.env.PORT || 4000
  await app.listen(port)

  console.log(`🚀 API server running on http://localhost:${port}`)
  console.log(`📚 Health check: http://localhost:${port}/api/v1/health`)
}

bootstrap()

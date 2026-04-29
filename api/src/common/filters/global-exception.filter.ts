import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isProduction = process.env.NODE_ENV === "production";

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : "Internal server error";

    // Pull ValidationPipe's per-field error messages out of the response body
    // so we log what actually failed instead of just "Bad Request Exception".
    let details: unknown = undefined;
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === "object" && body !== null) {
        const bodyAny = body as Record<string, unknown>;
        if (Array.isArray(bodyAny.message)) {
          details = bodyAny.message;
        }
      }
    }

    if (this.isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = "An unexpected error occurred. Please try again later.";
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${message}${
          details ? ` — ${JSON.stringify(details)}` : ""
        }`,
      );
    }

    response.status(status).json({
      error: {
        statusCode: status,
        message,
        ...(details ? { details } : {}),
        timestamp: new Date().toISOString(),
        ...(this.isProduction ? {} : { path: request.url }),
      },
    });
  }
}

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { PrismaService } from "@/common/services/prisma.service";
import { CreatePreviewTokenDto } from "./dto/create-preview-token.dto";
import {
  PreviewTokenResponseDto,
  ValidatedPreviewTokenDto,
} from "./dto/preview-token-response.dto";

@Injectable()
export class PreviewService {
  private readonly logger = new Logger(PreviewService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a preview token for content
   */
  async generateToken(
    tenantId: string,
    userId: string,
    dto: CreatePreviewTokenDto,
  ): Promise<PreviewTokenResponseDto> {
    // Verify content exists
    await this.verifyContentExists(tenantId, dto.contentType, dto.contentId);

    const token = randomUUID();
    const expiresAt = this.calculateExpiry(dto.expiresIn || "7d");

    const previewToken = await this.prisma.previewToken.create({
      data: {
        token,
        contentType: dto.contentType,
        contentId: dto.contentId,
        tenantId,
        createdBy: userId,
        expiresAt,
      },
      include: {
        tenant: {
          select: { slug: true },
        },
      },
    });

    const url = this.buildPreviewUrl(previewToken.token);

    this.logger.log(
      `Preview token generated for ${dto.contentType}:${dto.contentId} by user ${userId}`,
    );

    return {
      token: previewToken.token,
      url,
      expiresAt: previewToken.expiresAt.toISOString(),
    };
  }

  /**
   * Validate a preview token and return content info
   */
  async validateToken(token: string): Promise<ValidatedPreviewTokenDto | null> {
    const previewToken = await this.prisma.previewToken.findUnique({
      where: { token },
      include: {
        tenant: {
          select: { slug: true },
        },
      },
    });

    if (!previewToken) {
      return null;
    }

    // Check expiration
    if (previewToken.expiresAt < new Date()) {
      this.logger.log(`Preview token expired: ${token}`);
      return null;
    }

    // Get content slug
    const contentSlug = await this.getContentSlug(
      previewToken.contentType as "page" | "post",
      previewToken.contentId,
    );

    if (!contentSlug) {
      return null;
    }

    return {
      contentType: previewToken.contentType as "page" | "post",
      contentId: previewToken.contentId,
      tenantSlug: previewToken.tenant.slug,
      contentSlug,
    };
  }

  /**
   * Revoke a preview token
   */
  async revokeToken(tenantId: string, token: string): Promise<void> {
    const previewToken = await this.prisma.previewToken.findFirst({
      where: {
        token,
        tenantId,
      },
    });

    if (!previewToken) {
      throw new NotFoundException("Preview token not found");
    }

    await this.prisma.previewToken.delete({
      where: { id: previewToken.id },
    });

    this.logger.log(`Preview token revoked: ${token}`);
  }

  /**
   * List active preview tokens for content
   */
  async listTokensForContent(
    tenantId: string,
    contentType: "page" | "post",
    contentId: string,
  ) {
    return this.prisma.previewToken.findMany({
      where: {
        tenantId,
        contentType,
        contentId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Clean up expired tokens (can be called via cron job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.previewToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired preview tokens`);
    }

    return result.count;
  }

  /**
   * Verify content exists for the tenant
   */
  private async verifyContentExists(
    tenantId: string,
    contentType: "page" | "post",
    contentId: string,
  ): Promise<void> {
    if (contentType === "page") {
      const page = await this.prisma.page.findFirst({
        where: { id: contentId, tenantId },
      });
      if (!page) {
        throw new NotFoundException("Page not found");
      }
    } else if (contentType === "post") {
      const post = await this.prisma.post.findFirst({
        where: { id: contentId, tenantId },
      });
      if (!post) {
        throw new NotFoundException("Post not found");
      }
    }
  }

  /**
   * Get content slug for redirect
   */
  private async getContentSlug(
    contentType: "page" | "post",
    contentId: string,
  ): Promise<string | null> {
    if (contentType === "page") {
      const page = await this.prisma.page.findUnique({
        where: { id: contentId },
        select: { slug: true },
      });
      return page?.slug || null;
    } else if (contentType === "post") {
      const post = await this.prisma.post.findUnique({
        where: { id: contentId },
        select: { slug: true },
      });
      return post?.slug || null;
    }
    return null;
  }

  /**
   * Calculate expiry date from duration string
   */
  private calculateExpiry(duration: string): Date {
    const now = new Date();
    const match = duration.match(/^(\d+)([dhm])$/);

    if (!match) {
      throw new BadRequestException(
        "Invalid duration format. Use format like '7d', '24h', or '30m'",
      );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "d":
        now.setDate(now.getDate() + value);
        break;
      case "h":
        now.setHours(now.getHours() + value);
        break;
      case "m":
        now.setMinutes(now.getMinutes() + value);
        break;
    }

    return now;
  }

  /**
   * Build the full preview URL
   */
  private buildPreviewUrl(token: string): string {
    const clientUrl = this.configService.get<string>(
      "CLIENT_PREVIEW_URL",
      "http://localhost:3000",
    );
    return `${clientUrl}/api/preview?token=${token}`;
  }
}

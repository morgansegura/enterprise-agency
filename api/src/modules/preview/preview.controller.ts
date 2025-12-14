import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { PreviewService } from "./preview.service";
import { CreatePreviewTokenDto } from "./dto/create-preview-token.dto";
import {
  PreviewTokenResponseDto,
  ValidatedPreviewTokenDto,
} from "./dto/preview-token-response.dto";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { TenantGuard } from "@/common/guards/tenant.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { TenantId } from "@/common/decorators/tenant.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";

@ApiTags("Preview")
@Controller("preview")
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}

  /**
   * Generate a shareable preview token
   * Requires authentication and tenant context
   */
  @Post("token")
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles("owner", "admin", "editor")
  @ApiOperation({
    summary: "Generate preview token",
    description: "Creates a shareable preview token for draft content",
  })
  @ApiResponse({
    status: 201,
    description: "Preview token generated",
    type: PreviewTokenResponseDto,
  })
  async generateToken(
    @TenantId() tenantId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePreviewTokenDto,
  ): Promise<PreviewTokenResponseDto> {
    return this.previewService.generateToken(tenantId, user.id, dto);
  }

  /**
   * Validate a preview token
   * Public endpoint - used by client app to enable draft mode
   */
  @Get("validate")
  @Public()
  @ApiOperation({
    summary: "Validate preview token",
    description: "Validates a preview token and returns content info",
  })
  @ApiQuery({
    name: "token",
    description: "The preview token to validate",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Token is valid",
    type: ValidatedPreviewTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired token",
  })
  async validateToken(
    @Query("token") token: string,
  ): Promise<ValidatedPreviewTokenDto | { valid: false; message: string }> {
    const result = await this.previewService.validateToken(token);

    if (!result) {
      return { valid: false, message: "Invalid or expired preview token" };
    }

    return result;
  }

  /**
   * Revoke a preview token
   */
  @Delete("token/:token")
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles("owner", "admin", "editor")
  @ApiOperation({
    summary: "Revoke preview token",
    description: "Revokes a preview token, making it invalid",
  })
  @ApiResponse({
    status: 200,
    description: "Token revoked",
  })
  async revokeToken(
    @TenantId() tenantId: string,
    @Param("token") token: string,
  ): Promise<{ success: true }> {
    await this.previewService.revokeToken(tenantId, token);
    return { success: true };
  }

  /**
   * List active preview tokens for content
   */
  @Get("tokens/:contentType/:contentId")
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles("owner", "admin", "editor")
  @ApiOperation({
    summary: "List preview tokens",
    description: "Lists all active preview tokens for a piece of content",
  })
  async listTokens(
    @TenantId() tenantId: string,
    @Param("contentType") contentType: "page" | "post",
    @Param("contentId") contentId: string,
  ) {
    return this.previewService.listTokensForContent(
      tenantId,
      contentType,
      contentId,
    );
  }
}

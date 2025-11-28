import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { WebhooksService } from "./webhooks.service";
import { Webhook } from "svix";

@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post("clerk")
  async handleClerkWebhook(
    @Body() body: Record<string, unknown>,
    @Headers() headers: Record<string, string>,
  ) {
    // Verify webhook signature from Clerk
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new UnauthorizedException("Webhook secret not configured");
    }

    // Get Svix headers for verification
    const svixId = headers["svix-id"];
    const svixTimestamp = headers["svix-timestamp"];
    const svixSignature = headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new UnauthorizedException("Missing Svix headers");
    }

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    let evt: Record<string, unknown>;

    try {
      evt = wh.verify(JSON.stringify(body), {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as Record<string, unknown>;
    } catch (err) {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    // Handle the webhook event
    const eventType = evt.type as string;

    switch (eventType) {
      case "user.created":
        await this.webhooksService.handleUserCreated(
          evt.data as Record<string, unknown>,
        );
        break;

      case "user.updated":
        await this.webhooksService.handleUserUpdated(
          evt.data as Record<string, unknown>,
        );
        break;

      case "user.deleted":
        await this.webhooksService.handleUserDeleted(
          evt.data as Record<string, unknown>,
        );
        break;

      default:
        this.logger.warn(`Unhandled webhook event: ${eventType}`);
    }

    return { success: true };
  }
}

import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/common/services/prisma.service";

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleUserCreated(data: Record<string, unknown>) {
    this.logger.log("Handling user.created webhook");

    const clerkUserId = data.id as string;
    const emailAddresses = data.email_addresses as Array<{
      email_address: string;
      id: string;
    }>;
    const primaryEmailId = data.primary_email_address_id as string;

    // Find primary email
    const primaryEmail = emailAddresses.find((e) => e.id === primaryEmailId);

    if (!primaryEmail) {
      this.logger.error("No primary email found for user");
      return;
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (existingUser) {
      this.logger.log(`User ${clerkUserId} already exists, skipping creation`);
      return;
    }

    // Create user in our database
    const user = await this.prisma.user.create({
      data: {
        clerkUserId,
        email: primaryEmail.email_address,
        firstName: (data.first_name as string) || null,
        lastName: (data.last_name as string) || null,
        avatarUrl: (data.image_url as string) || null,
        emailVerified: true,
        status: "active",
      },
    });

    this.logger.log(`Created user: ${user.email}`);
  }

  async handleUserUpdated(data: Record<string, unknown>) {
    this.logger.log("Handling user.updated webhook");

    const clerkUserId = data.id as string;
    const emailAddresses = data.email_addresses as Array<{
      email_address: string;
      id: string;
    }>;
    const primaryEmailId = data.primary_email_address_id as string;

    const primaryEmail = emailAddresses.find((e) => e.id === primaryEmailId);

    if (!primaryEmail) {
      this.logger.error("No primary email found for user");
      return;
    }

    // Update user in our database
    await this.prisma.user.update({
      where: { clerkUserId },
      data: {
        email: primaryEmail.email_address,
        firstName: (data.first_name as string) || null,
        lastName: (data.last_name as string) || null,
        avatarUrl: (data.image_url as string) || null,
      },
    });

    this.logger.log(`Updated user: ${clerkUserId}`);
  }

  async handleUserDeleted(data: Record<string, unknown>) {
    this.logger.log("Handling user.deleted webhook");

    const clerkUserId = data.id as string;

    // Soft delete by updating status
    await this.prisma.user.update({
      where: { clerkUserId },
      data: {
        status: "deleted",
      },
    });

    this.logger.log(`Deleted user: ${clerkUserId}`);
  }
}

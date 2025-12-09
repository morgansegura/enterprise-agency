import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  PaymentsController,
  PaymentsWebhookController,
} from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  imports: [ConfigModule],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

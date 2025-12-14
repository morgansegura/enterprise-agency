import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PreviewController } from "./preview.controller";
import { PreviewService } from "./preview.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  imports: [ConfigModule],
  controllers: [PreviewController],
  providers: [PreviewService, PrismaService],
  exports: [PreviewService],
})
export class PreviewModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RevalidationService } from "./revalidation.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  imports: [ConfigModule],
  providers: [RevalidationService, PrismaService],
  exports: [RevalidationService],
})
export class RevalidationModule {}

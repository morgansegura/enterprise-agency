import { Module } from "@nestjs/common";
import { HeadersController } from "./headers.controller";
import { HeadersService } from "./headers.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  controllers: [HeadersController],
  providers: [HeadersService, PrismaService],
  exports: [HeadersService],
})
export class HeadersModule {}

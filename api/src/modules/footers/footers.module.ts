import { Module } from "@nestjs/common";
import { FootersController } from "./footers.controller";
import { FootersService } from "./footers.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  controllers: [FootersController],
  providers: [FootersService, PrismaService],
  exports: [FootersService],
})
export class FootersModule {}

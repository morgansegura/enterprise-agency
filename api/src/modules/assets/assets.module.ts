import { Module } from "@nestjs/common";
import { AssetsController } from "./assets.controller";
import { AssetsService } from "./assets.service";
import { PrismaService } from "@/common/services/prisma.service";
import { StorageService } from "@/common/services/storage.service";
import { UsersModule } from "@/modules/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, StorageService],
  exports: [AssetsService, StorageService],
})
export class AssetsModule {}

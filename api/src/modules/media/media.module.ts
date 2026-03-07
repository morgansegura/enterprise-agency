import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { FoldersController } from "./folders.controller";
import { MediaService } from "./media.service";
import { FoldersService } from "./folders.service";
import { PrismaService } from "@/common/services/prisma.service";
import { StorageService } from "@/common/services/storage.service";

@Module({
  controllers: [MediaController, FoldersController],
  providers: [MediaService, FoldersService, PrismaService, StorageService],
  exports: [MediaService, FoldersService],
})
export class MediaModule {}

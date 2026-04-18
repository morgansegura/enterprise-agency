import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { FoldersController } from "./folders.controller";
import { MediaService } from "./media.service";
import { FoldersService } from "./folders.service";
import { PrismaService } from "@/common/services/prisma.service";
import { StorageService } from "@/common/services/storage.service";
import { ImageProcessorService } from "@/common/services/image-processor.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  // FoldersController must come first so its more-specific
  // /tenants/:tenantId/media/folders routes win over MediaController's
  // /tenants/:tenantId/media/:id route.
  controllers: [FoldersController, MediaController],
  providers: [
    MediaService,
    FoldersService,
    PrismaService,
    StorageService,
    ImageProcessorService,
    AuditLogService,
  ],
  exports: [MediaService, FoldersService],
})
export class MediaModule {}

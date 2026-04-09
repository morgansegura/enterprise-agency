import { Module } from "@nestjs/common";
import { LibraryController } from "./library.controller";
import { LibraryService } from "./library.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, PrismaService, AuditLogService],
  exports: [LibraryService],
})
export class LibraryModule {}

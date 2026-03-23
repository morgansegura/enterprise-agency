import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, AuditLogService],
  exports: [PostsService],
})
export class PostsModule {}

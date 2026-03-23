import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "@/common/services/prisma.service";
import { AuditLogService } from "@/common/services/audit-log.service";
import { AuthModule } from "@/modules/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuditLogService],
  exports: [UsersService],
})
export class UsersModule {}

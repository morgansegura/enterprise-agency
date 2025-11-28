import { Module } from "@nestjs/common";
import { PagesController } from "./pages.controller";
import { PagesService } from "./pages.service";
import { StructureValidationService } from "./services/structure-validation.service";
import { PrismaService } from "@/common/services/prisma.service";

@Module({
  controllers: [PagesController],
  providers: [PagesService, StructureValidationService, PrismaService],
  exports: [PagesService],
})
export class PagesModule {}

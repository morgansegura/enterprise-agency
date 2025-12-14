import { Module } from "@nestjs/common";
import { PagesController } from "./pages.controller";
import { PagesService } from "./pages.service";
import { StructureValidationService } from "./services/structure-validation.service";
import { PageVersionService } from "./services/page-version.service";
import { PrismaService } from "@/common/services/prisma.service";
import { RevalidationModule } from "@/modules/revalidation/revalidation.module";

@Module({
  imports: [RevalidationModule],
  controllers: [PagesController],
  providers: [
    PagesService,
    StructureValidationService,
    PageVersionService,
    PrismaService,
  ],
  exports: [PagesService, PageVersionService],
})
export class PagesModule {}

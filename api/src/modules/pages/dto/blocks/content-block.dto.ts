import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

// Content Blocks
import { HeadingBlockDto } from "./content-blocks/heading-block.dto";
import { TextBlockDto } from "./content-blocks/text-block.dto";
import { ButtonBlockDto } from "./content-blocks/button-block.dto";
import { ImageBlockDto } from "./content-blocks/image-block.dto";
import { CardBlockDto } from "./content-blocks/card-block.dto";
import { RichTextBlockDto } from "./content-blocks/rich-text-block.dto";
import { VideoBlockDto } from "./content-blocks/video-block.dto";
import { AudioBlockDto } from "./content-blocks/audio-block.dto";
import { ListBlockDto } from "./content-blocks/list-block.dto";
import { QuoteBlockDto } from "./content-blocks/quote-block.dto";
import { DividerBlockDto } from "./content-blocks/divider-block.dto";
import { SpacerBlockDto } from "./content-blocks/spacer-block.dto";
import { AccordionBlockDto } from "./content-blocks/accordion-block.dto";
import { TabsBlockDto } from "./content-blocks/tabs-block.dto";
import { EmbedBlockDto } from "./content-blocks/embed-block.dto";
import { IconBlockDto } from "./content-blocks/icon-block.dto";
import { StatsBlockDto } from "./content-blocks/stats-block.dto";
import { MapBlockDto } from "./content-blocks/map-block.dto";
import { LogoBlockDto } from "./content-blocks/logo-block.dto";

// Container Blocks
import { GridBlockDto } from "./container-blocks/grid-block.dto";
import { FlexBlockDto } from "./container-blocks/flex-block.dto";
import { StackBlockDto } from "./container-blocks/stack-block.dto";
import { ContainerBlockDto } from "./container-blocks/container-block.dto";
import { ColumnsBlockDto } from "./container-blocks/columns-block.dto";

/**
 * Discriminated union type for all block types
 * This allows type-safe validation based on the _type field
 */
export type Block =
  | HeadingBlockDto
  | TextBlockDto
  | ButtonBlockDto
  | ImageBlockDto
  | CardBlockDto
  | RichTextBlockDto
  | VideoBlockDto
  | AudioBlockDto
  | ListBlockDto
  | QuoteBlockDto
  | DividerBlockDto
  | SpacerBlockDto
  | AccordionBlockDto
  | TabsBlockDto
  | EmbedBlockDto
  | IconBlockDto
  | StatsBlockDto
  | MapBlockDto
  | LogoBlockDto
  | GridBlockDto
  | FlexBlockDto
  | StackBlockDto
  | ContainerBlockDto
  | ColumnsBlockDto;

/**
 * DTO for validating a single block with discriminated union
 * Uses class-transformer's discriminator to validate based on _type
 */
export class ContentBlockDto {
  @IsString()
  _key: string;

  @IsEnum([
    // Content blocks
    "heading-block",
    "text-block",
    "button-block",
    "image-block",
    "card-block",
    "rich-text-block",
    "video-block",
    "audio-block",
    "list-block",
    "quote-block",
    "divider-block",
    "spacer-block",
    "accordion-block",
    "tabs-block",
    "embed-block",
    "icon-block",
    "stats-block",
    "map-block",
    "logo-block",
    // Container blocks
    "grid-block",
    "flex-block",
    "stack-block",
    "container-block",
    "columns-block",
  ])
  _type: string;

  @ValidateNested()
  @Type(() => Object, {
    discriminator: {
      property: "_type",
      subTypes: [
        // Content blocks
        { value: HeadingBlockDto, name: "heading-block" },
        { value: TextBlockDto, name: "text-block" },
        { value: ButtonBlockDto, name: "button-block" },
        { value: ImageBlockDto, name: "image-block" },
        { value: CardBlockDto, name: "card-block" },
        { value: RichTextBlockDto, name: "rich-text-block" },
        { value: VideoBlockDto, name: "video-block" },
        { value: AudioBlockDto, name: "audio-block" },
        { value: ListBlockDto, name: "list-block" },
        { value: QuoteBlockDto, name: "quote-block" },
        { value: DividerBlockDto, name: "divider-block" },
        { value: SpacerBlockDto, name: "spacer-block" },
        { value: AccordionBlockDto, name: "accordion-block" },
        { value: TabsBlockDto, name: "tabs-block" },
        { value: EmbedBlockDto, name: "embed-block" },
        { value: IconBlockDto, name: "icon-block" },
        { value: StatsBlockDto, name: "stats-block" },
        { value: MapBlockDto, name: "map-block" },
        { value: LogoBlockDto, name: "logo-block" },
        // Container blocks
        { value: GridBlockDto, name: "grid-block" },
        { value: FlexBlockDto, name: "flex-block" },
        { value: StackBlockDto, name: "stack-block" },
        { value: ContainerBlockDto, name: "container-block" },
        { value: ColumnsBlockDto, name: "columns-block" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  data: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto) // Recursive validation for nested blocks in container blocks
  blocks?: ContentBlockDto[];
}

import type { CardBlockData } from "@/lib/blocks";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonBlock } from "@/components/block/button-block";
import Image from "next/image";
import "./card-block.css";

type CardBlockProps = {
  data: CardBlockData;
};

/**
 * CardBlock - Renders feature cards with title, description, image, and actions
 * Content block (leaf node) - cannot have children
 */
export function CardBlock({ data }: CardBlockProps) {
  const {
    title,
    description,
    image,
    imagePosition = "top",
    actions,
    variant = "default",
  } = data;

  return (
    <Card
      data-slot="card-block"
      data-variant={variant}
      data-image-position={imagePosition}
    >
      {image && imagePosition === "top" ? (
        <div data-slot="card-block-image-top">
          <Image
            src={image.url}
            alt={image.alt || ""}
            width={image.width || 400}
            height={image.height || 225}
            data-object-fit={image.objectFit || "cover"}
          />
        </div>
      ) : null}

      {image && imagePosition === "background" ? (
        <div data-slot="card-block-image-background">
          <Image
            src={image.url}
            alt={image.alt || ""}
            fill
            data-object-fit={image.objectFit || "cover"}
          />
          <div data-slot="card-block-overlay" />
        </div>
      ) : null}

      <div
        data-slot="card-block-content-wrapper"
        data-image-position={imagePosition}
      >
        {image && imagePosition === "left" ? (
          <div data-slot="card-block-image-left">
            <Image
              src={image.url}
              alt={image.alt || ""}
              width={image.width || 200}
              height={image.height || 200}
              data-object-fit={image.objectFit || "cover"}
            />
          </div>
        ) : null}

        <div data-slot="card-block-text">
          {title || description ? (
            <CardHeader>
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </CardHeader>
          ) : null}

          {actions && actions.length > 0 ? (
            <CardFooter data-slot="card-block-actions">
              {actions.map((action, index) => (
                <ButtonBlock key={index} data={action} />
              ))}
            </CardFooter>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

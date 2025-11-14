import type { ButtonBlockData } from "@/lib/blocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./button-block.css";

type ButtonBlockProps = {
  data: ButtonBlockData;
};

/**
 * ButtonBlock - Renders call-to-action buttons
 * Content block (leaf node) - cannot have children
 */
export function ButtonBlock({ data }: ButtonBlockProps) {
  const { text, href, onClick, variant = "default", size = "default" } = data;

  // If there's an href, render as link
  if (href) {
    return (
      <Button asChild variant={variant} size={size} data-slot="button-block">
        <Link href={href}>{text}</Link>
      </Button>
    );
  }

  // Otherwise render as button
  return (
    <Button
      variant={variant}
      size={size}
      data-slot="button-block"
      data-action={onClick}
    >
      {text}
    </Button>
  );
}

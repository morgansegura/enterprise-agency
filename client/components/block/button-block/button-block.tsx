import type { ButtonBlockData } from "@/lib/blocks";
import Link from "next/link";
import "./button-block.css";

type ButtonBlockProps = {
  data: ButtonBlockData & {
    fullWidth?: boolean;
  };
};

/**
 * ButtonBlock — clean output matching builder renderer.
 * All styling comes from generated CSS via .e-{key} wrapper.
 */
export function ButtonBlock({ data }: ButtonBlockProps) {
  const { text, href, fullWidth } = data;

  if (!href) {
    return (
      <span
        data-slot="button-block"
        {...(fullWidth ? { "data-full-width": "" } : {})}
      >
        {text}
      </span>
    );
  }

  const isExternal = href.startsWith("http") || href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        data-slot="button-block"
        {...(fullWidth ? { "data-full-width": "" } : {})}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <Link
      href={href}
      data-slot="button-block"
      {...(fullWidth ? { "data-full-width": "" } : {})}
    >
      {text}
    </Link>
  );
}

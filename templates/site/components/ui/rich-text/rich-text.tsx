import * as React from "react";

import { cn } from "@/lib/utils";

import "./rich-text.css";

type RichTextProps = {
  html?: string;
  children?: React.ReactNode;
  className?: string;
};

/** Styled long-form content. Pass `html` (e.g. from the CMS) or children. */
function RichText({ html, children, className }: RichTextProps) {
  if (html) {
    return (
      <div
        className={cn("rich-text", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <div className={cn("rich-text", className)}>{children}</div>;
}

export { RichText };
export type { RichTextProps };

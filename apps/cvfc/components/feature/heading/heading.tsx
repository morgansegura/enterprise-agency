import { cn } from "@/lib/utils";

import "./heading.css";

export type EyebrowStyle = "full" | "rule" | "plain" | "none";
export type HeadingTag = "h1" | "h2";
export type HeadingSize = "display" | "section" | "compact";
export type HeadingAlign = "left" | "center";

type HeadingProps = {
  className?: string;
  eyebrow?: string;
  eyebrowStyle?: EyebrowStyle;
  heading: string;
  headingAs?: HeadingTag;
  headingSize?: HeadingSize;
  description?: React.ReactNode;
  align?: HeadingAlign;
  id?: string;
};

export function Heading({
  className,
  eyebrow,
  eyebrowStyle = "full",
  heading,
  headingAs = "h2",
  headingSize = "section",
  description,
  align = "center",
  id,
}: HeadingProps) {
  const HeadingTag = headingAs;

  return (
    <header data-align={align} className={cn("heading-block", className)}>
      {eyebrow && eyebrowStyle !== "none" ? (
        <p className="heading-block-eyebrow" data-style={eyebrowStyle}>
          {eyebrowStyle === "full" ? <span>{eyebrow}</span> : null}
          {eyebrowStyle === "rule" ? (
            <>
              <span className="eyebrow-rule" aria-hidden="true" />
              {eyebrow}
            </>
          ) : null}
          {eyebrowStyle === "plain" ? eyebrow : null}
        </p>
      ) : null}

      <HeadingTag
        id={id}
        data-size={headingSize}
        className="heading-block-heading"
      >
        {heading}
      </HeadingTag>

      {description ? (
        <div className="heading-block-description">{description}</div>
      ) : null}
    </header>
  );
}

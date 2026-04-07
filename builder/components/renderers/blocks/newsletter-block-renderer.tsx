"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface NewsletterBlockData {
  heading?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  variant?: "inline" | "stacked";
}

export default function NewsletterBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as NewsletterBlockData;
  const {
    heading = "Subscribe to our newsletter",
    description = "Get the latest updates delivered to your inbox.",
    placeholder = "Enter your email",
    buttonText = "Subscribe",
    variant = "inline",
  } = data;

  const update = (field: string, value: string) => {
    if (onChange)
      onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <div data-slot="newsletter-block" className="max-w-md mx-auto text-center">
      <h3
        data-slot="newsletter-block-heading"
        className="text-lg font-bold mb-1"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          const v = e.currentTarget.textContent || "";
          if (v !== heading) update("heading", v);
        }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {heading}
      </h3>
      <p
        data-slot="newsletter-block-description"
        className="text-[14px] text-(--el-500) mb-4"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          const v = e.currentTarget.textContent || "";
          if (v !== description) update("description", v);
        }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {description}
      </p>
      <div
        data-slot="newsletter-block-form"
        data-variant={variant}
        className={variant === "inline" ? "flex gap-2" : "space-y-2"}
      >
        <input
          data-slot="newsletter-block-input"
          type="email"
          className="flex-1 h-10 px-3 text-[14px] border border-(--border-default) rounded-[3px] bg-(--el-0)"
          placeholder={placeholder}
          disabled={isEditing}
        />
        <button
          data-slot="newsletter-block-submit"
          type="button"
          className="h-10 px-6 bg-(--accent-primary) text-(--accent-primary-foreground) rounded-[3px] text-[14px] font-medium whitespace-nowrap"
          disabled={isEditing}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

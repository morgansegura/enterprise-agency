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
    if (onChange) onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <h3
        className="text-lg font-bold mb-1"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => { const v = e.currentTarget.textContent || ""; if (v !== heading) update("heading", v); }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {heading}
      </h3>
      <p
        className="text-[14px] text-[var(--el-500)] mb-4"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => { const v = e.currentTarget.textContent || ""; if (v !== description) update("description", v); }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {description}
      </p>
      <div className={variant === "inline" ? "flex gap-2" : "space-y-2"}>
        <input
          type="email"
          className="flex-1 h-10 px-3 text-[14px] border border-[var(--border-default)] rounded-[3px] bg-[var(--el-0)]"
          placeholder={placeholder}
          disabled={isEditing}
        />
        <button
          type="button"
          className="h-10 px-6 bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] rounded-[3px] text-[14px] font-medium whitespace-nowrap"
          disabled={isEditing}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

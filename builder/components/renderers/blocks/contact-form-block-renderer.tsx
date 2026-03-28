"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface ContactFormBlockData {
  heading?: string;
  description?: string;
  fields: Array<{ label: string; type: string; required: boolean }>;
  submitText?: string;
  recipientEmail?: string;
}

export default function ContactFormBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as ContactFormBlockData;
  const {
    heading = "Contact Us",
    description = "Send us a message and we'll get back to you.",
    fields = [
      { label: "Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Message", type: "textarea", required: true },
    ],
    submitText = "Send Message",
  } = data;

  return (
    <div className="max-w-lg mx-auto">
      {heading && (
        <h3
          className="text-xl font-bold mb-1"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== heading && onChange) onChange({ ...block, data: { ...block.data, heading: v } });
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {heading}
        </h3>
      )}
      {description && (
        <p
          className="text-[14px] text-[var(--el-500)] mb-4"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== description && onChange) onChange({ ...block, data: { ...block.data, description: v } });
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {description}
        </p>
      )}
      <div className="space-y-3">
        {fields.map((field, i) => (
          <div key={i}>
            <label className="text-[12px] font-semibold text-[var(--el-800)] mb-1 block">
              {field.label}
              {field.required && <span className="text-[var(--status-error)] ml-0.5">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="w-full h-24 px-3 py-2 text-[14px] border border-[var(--border-default)] rounded-[3px] bg-[var(--el-0)]"
                placeholder={`Your ${field.label.toLowerCase()}`}
                disabled={isEditing}
              />
            ) : (
              <input
                type={field.type}
                className="w-full h-8 px-3 text-[14px] border border-[var(--border-default)] rounded-[3px] bg-[var(--el-0)]"
                placeholder={`Your ${field.label.toLowerCase()}`}
                disabled={isEditing}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="w-full h-10 bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] rounded-[3px] text-[14px] font-medium"
          disabled={isEditing}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
}

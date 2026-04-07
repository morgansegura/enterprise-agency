"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

interface FeatureGridBlockData {
  heading?: string;
  description?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "card" | "centered";
}

export default function FeatureGridBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as FeatureGridBlockData;
  const {
    heading,
    description,
    features = [],
    columns = 3,
    variant = "default",
  } = data;

  const updateFeature = (index: number, field: string, value: string) => {
    if (!onChange) return;
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...block, data: { ...block.data, features: updated } });
  };

  return (
    <div data-slot="feature-grid-block" data-variant={variant}>
      {(heading || description || isEditing) && (
        <div data-slot="feature-grid-block-header" className="text-center mb-8">
          {(heading || isEditing) && (
            <h3
              data-slot="feature-grid-block-heading"
              className="text-xl font-bold"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== heading && onChange)
                  onChange({
                    ...block,
                    data: { ...block.data, heading: v },
                  });
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {heading || "Features"}
            </h3>
          )}
          {(description || isEditing) && (
            <p
              data-slot="feature-grid-block-description"
              className="text-[14px] text-(--el-500) mt-1"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== description && onChange)
                  onChange({
                    ...block,
                    data: { ...block.data, description: v },
                  });
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {description || "What we offer"}
            </p>
          )}
        </div>
      )}
      <div
        data-slot="feature-grid-block-grid"
        data-columns={String(columns)}
        className={cn(
          "grid gap-6",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {features.map((feature, i) => (
          <div
            key={i}
            data-slot="feature-grid-block-item"
            data-variant={variant}
            className={cn(
              "p-5",
              variant === "card" &&
                "bg-(--el-0) border border-(--border-default) rounded-lg shadow-sm",
              variant === "centered" && "text-center",
              variant === "default" && "bg-(--el-100)/20 rounded-lg",
            )}
          >
            {feature.icon && (
              <div
                data-slot="feature-grid-block-icon"
                className="text-2xl mb-2"
              >
                {feature.icon}
              </div>
            )}
            <h4
              data-slot="feature-grid-block-title"
              className="text-[14px] font-semibold mb-1"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== feature.title) updateFeature(i, "title", v);
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {feature.title}
            </h4>
            <p
              data-slot="feature-grid-block-text"
              className="text-[13px] text-(--el-500)"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== feature.description)
                  updateFeature(i, "description", v);
              }}
              style={
                isEditing ? { cursor: "text", outline: "none" } : undefined
              }
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

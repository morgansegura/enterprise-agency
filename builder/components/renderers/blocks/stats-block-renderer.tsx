import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface StatItem {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  trend?: { direction: "up" | "down"; value: string };
}

interface StatsBlockData {
  stats: StatItem[];
  layout?: "horizontal" | "vertical" | "grid";
  variant?: "default" | "bordered" | "cards";
}

export default function StatsBlockRenderer({
  block,
  isEditing,
  onChange,
}: BlockRendererProps) {
  const data = block.data as unknown as StatsBlockData;
  const {
    stats = [],
    layout = "horizontal",
    variant = "default",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  void hasStyle;
  // Update a single stat field on blur (canvas editing)
  const updateStatField = (
    index: number,
    field: keyof StatItem,
    value: string,
  ) => {
    if (!onChange) return;
    const next = [...stats];
    next[index] = { ...next[index], [field]: value };
    onChange({
      ...block,
      data: { ...block.data, stats: next },
    });
  };

  return (
    <div
      data-slot="stats-block"
      data-layout={layout}
      data-variant={variant}
    >
      {stats.map((stat, index) => (
        <div key={index} data-slot="stats-block-item">
          <div data-slot="stats-block-header">
            {stat.icon ? (
              <span data-slot="stats-block-icon" aria-hidden="true">
                {stat.icon}
              </span>
            ) : null}
            <div
              data-slot="stats-block-value"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newValue = e.currentTarget.textContent ?? "";
                if (newValue !== stat.value) {
                  updateStatField(index, "value", newValue);
                }
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {stat.value}
            </div>
          </div>
          <div data-slot="stats-block-meta">
            <div
              data-slot="stats-block-label"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newValue = e.currentTarget.textContent ?? "";
                if (newValue !== stat.label) {
                  updateStatField(index, "label", newValue);
                }
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {stat.label}
            </div>
            {stat.description !== undefined ? (
              <div
                data-slot="stats-block-description"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newValue = e.currentTarget.textContent ?? "";
                  if (newValue !== stat.description) {
                    updateStatField(index, "description", newValue);
                  }
                }}
                style={
                  isEditing ? { cursor: "text", outline: "none" } : undefined
                }
              >
                {stat.description}
              </div>
            ) : null}
            {stat.trend ? (
              <div
                data-slot="stats-block-trend"
                data-direction={stat.trend.direction}
                aria-label={`Trend ${stat.trend.direction} ${stat.trend.value}`}
              >
                <span aria-hidden="true">
                  {stat.trend.direction === "up" ? "\u2191" : "\u2193"}
                </span>
                {stat.trend.value}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

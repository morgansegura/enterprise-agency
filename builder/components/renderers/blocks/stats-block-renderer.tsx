import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  description?: string;
}

interface StatsBlockData {
  stats: StatItem[];
  layout?: "horizontal" | "vertical" | "grid";
  variant?: "default" | "bordered" | "cards";
}

const layoutClasses = {
  horizontal: "flex flex-wrap justify-center gap-8",
  vertical: "flex flex-col gap-6",
  grid: "grid grid-cols-2 md:grid-cols-4 gap-6",
};

const variantClasses = {
  default: "",
  bordered: "border border-border rounded-lg p-6",
  cards: "",
};

const itemVariantClasses = {
  default: "text-center",
  bordered: "text-center",
  cards: "bg-card border border-border rounded-lg p-4 text-center shadow-sm",
};

export default function StatsBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as StatsBlockData;
  const { stats = [], layout = "horizontal", variant = "default" } = data;

  return (
    <div className={cn(layoutClasses[layout], variantClasses[variant])}>
      {stats.map((stat, index) => (
        <div key={index} className={itemVariantClasses[variant]}>
          <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm font-medium text-foreground mt-1">
            {stat.label}
          </div>
          {stat.description && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {stat.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface FeatureGridBlockProps {
  data: {
    heading?: string;
    description?: string;
    features?: Array<{ icon?: string; title: string; description: string }>;
    columns?: 2 | 3 | 4;
    variant?: "default" | "card" | "centered";
  };
}

export function FeatureGridBlock({ data }: FeatureGridBlockProps) {
  const { heading, description, features = [], columns = 3, variant = "default" } = data;

  return (
    <div className="w-full">
      {(heading || description) && (
        <div className="text-center mb-8">
          {heading && <h3 className="text-xl font-bold">{heading}</h3>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      <div className={cn("grid gap-6", columns === 2 && "grid-cols-1 md:grid-cols-2", columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
        {features.map((f, i) => (
          <div key={i} className={cn("p-5", variant === "card" && "bg-card border rounded-lg shadow-sm", variant === "centered" && "text-center", variant === "default" && "bg-muted/20 rounded-lg")}>
            {f.icon && <div className="text-2xl mb-2">{f.icon}</div>}
            <h4 className="font-semibold mb-1">{f.title}</h4>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

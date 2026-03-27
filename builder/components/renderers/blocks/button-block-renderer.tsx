import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface ButtonBlockData {
  text: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
  openInNewTab?: boolean;
}

const variantClasses = {
  default: "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] hover:bg-[var(--accent-primary)]/90",
  secondary: "bg-[var(--el-100)] text-[var(--el-800)] hover:bg-[var(--el-100)]/80",
  outline:
    "border border-[var(--el-150)] bg-[var(--el-0)] hover:bg-accent hover:text-[var(--el-800)]",
  ghost: "hover:bg-accent hover:text-[var(--el-800)]",
  link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
  destructive:
    "bg-[var(--status-error)] text-[var(--el-0)] hover:bg-[var(--status-error)]/90",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export default function ButtonBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as ButtonBlockData;
  const {
    text,
    href = "#",
    variant = "default",
    size = "default",
    fullWidth = false,
    openInNewTab = false,
  } = data;

  const className = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
  );

  return (
    <a
      href={href}
      className={className}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {text}
    </a>
  );
}

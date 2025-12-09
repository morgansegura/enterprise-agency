import { cn } from "@/lib/utils";

type LogoProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function Logo({ children, className, style }: LogoProps) {
  return (
    <div className={cn("logo", className)} style={style}>
      {children}
    </div>
  );
}

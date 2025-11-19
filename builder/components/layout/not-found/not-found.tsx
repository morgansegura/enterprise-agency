import { cn } from "@/lib/utils";
import "./not-found.css";

type NotFoundLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function NotFoundLayout({ children, className }: NotFoundLayoutProps) {
  return (
    <div className={cn("not-found-layout", className)}>
      <div className="not-found-container">{children}</div>
    </div>
  );
}

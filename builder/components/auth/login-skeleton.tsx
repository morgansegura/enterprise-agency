import { Skeleton } from "@/components/ui/skeleton";
import "./login-skeleton.css";

export function LoginSkeleton() {
  return (
    <div className="login-skeleton-container">
      <div className="login-skeleton-card">
        <div className="login-skeleton-header">
          <Skeleton className="login-skeleton-title" />
          <Skeleton className="login-skeleton-subtitle" />
        </div>

        <div className="login-skeleton-form">
          <div className="login-skeleton-field">
            <Skeleton className="login-skeleton-label" />
            <Skeleton className="login-skeleton-input" />
          </div>

          <div className="login-skeleton-field">
            <Skeleton className="login-skeleton-label-short" />
            <Skeleton className="login-skeleton-input" />
          </div>

          <div className="login-skeleton-actions">
            <Skeleton className="login-skeleton-button" />
            <div className="login-skeleton-link-container">
              <Skeleton className="login-skeleton-link" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

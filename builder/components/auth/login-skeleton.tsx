import { Skeleton } from "@/components/ui/skeleton";
import "./login-skeleton.css";
import "./auth-form.css";

export function LoginSkeleton() {
  return (
    <div className="auth-layout">
      <div className="login-skeleton-card">
        <div className="login-skeleton-header">
          <Skeleton className="login-skeleton-logo" />
          <Skeleton className="login-skeleton-subtitle" />
        </div>

        <div className="login-skeleton-form">
          <div className="login-skeleton-fields">
            <div className="login-skeleton-field">
              <Skeleton className="login-skeleton-label" />
              <Skeleton className="login-skeleton-input" />
            </div>

            <div className="login-skeleton-field">
              <Skeleton className="login-skeleton-label-short" />
              <Skeleton className="login-skeleton-input" />
            </div>
          </div>

          <Skeleton className="login-skeleton-button" />
        </div>
      </div>
    </div>
  );
}
